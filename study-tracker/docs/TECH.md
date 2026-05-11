# Study Tracker — Technical Design

> **Audience:** future-me (Claude) returning to this codebase. Captures the architecture, decisions, and the WHY behind each choice so the next session doesn't redo the analysis.

## Stack

- **Manifest V3** Chrome extension.
- **Plain JavaScript ES modules** — no bundler, no framework, no build step. Files are loaded directly by the browser.
- **No backend.** No telemetry. No analytics.
- Only outbound network call: YouTube oEmbed endpoint (`https://www.youtube.com/oembed`), called from the popup to fetch video title + thumbnail.

## Why no build tooling

For a personal POC, every line of infrastructure is a line of future maintenance. The extension is small enough (<700 LOC total) that vanilla JS is faster to iterate on than React + Vite + TypeScript. Migrate when complexity demands it, not before.

## File layout

```
study-tracker/
  manifest.json         MV3 declaration
  popup.html/.css/.js   Quick-save UI (toolbar icon popup)
  options.html/.css/.js Dashboard (full tab, opened via Extension Options)
  storage.js            chrome.storage.local wrapper
  backup.js             File System Access API wrapper + IndexedDB for the directory handle
  schema.js             Schema version + item factory + import/export builders
  docs/
    REQUIREMENTS.md     What the product does
    TECH.md             This file
  README.md             GitHub-facing readme
```

There is no `background.js` / service worker. Nothing in this app needs to run in the background — every action is user-initiated and runs in the popup or options page document context.

## Architecture

```
┌──────────┐  putItem  ┌──────────────────────┐
│  Popup   │──────────▶│ chrome.storage.local │  ← primary store, source of truth
└──────────┘           │ (one key per item)   │
       │               └──────────────────────┘
       │ writeBackup           ▲       │
       ▼                       │       │
┌──────────────────┐    putItem│       │ allItems
│ user's folder    │           │       ▼
│ study-tracker    │           │  ┌──────────────┐
│   .json          │◀──────────┴──│  Dashboard   │
└──────────────────┘  writeBackup └──────────────┘
       │
       ▼ (handled by user's cloud app, not us)
   iCloud / Drive / Dropbox sync
```

## Storage model

### Primary: `chrome.storage.local`

**Key scheme:** one key per item, prefixed `item:<uuid>`. Plus meta keys: `meta:dirty`, `meta:lastBackupAt`.

```js
{
  "item:abc-123": { id: "abc-123", url: "...", ... },
  "item:def-456": { id: "def-456", url: "...", ... },
  "meta:dirty": true,
  "meta:lastBackupAt": "2026-05-10T..."
}
```

**Why per-item keys instead of one big array under `items`:** `chrome.storage.local` reads/writes whole keys. A single-key design means every save serializes and writes the entire library. Per-item keys keep saves O(item size) instead of O(library size). At 10k items this is the difference between snappy and laggy.

**Why `chrome.storage.local` instead of IndexedDB:** simpler API (async key/value), smaller code, no schema migrations. The 10 MB quota covers ~10 years of expected use (~1 KB/item × ~10 items/day). Migrate to IndexedDB when:
- Item count crosses ~10k
- Storing larger blobs (article HTML, screenshots) becomes a goal
- We need indexed queries (e.g. "tagged X and saved in Y range") faster than in-memory filter

### Backup file: `study-tracker.json` in user-picked folder

Written via the **File System Access API**. The user picks a directory once; Chrome returns a `FileSystemDirectoryHandle` which we persist in IndexedDB (it can't be serialized to JSON or stored in `chrome.storage`). On future sessions we re-acquire permission with `requestPermission({ mode: 'readwrite' })`, which requires a user gesture.

**Why File System Access over the Google Drive API:**
- Zero OAuth, no app registration, no API keys committed.
- Cloud sync is delegated to whatever app the user already uses (Drive desktop, iCloud, Dropbox). We just write a file to a folder.
- Works offline.
- The user owns the file directly.

**Tradeoff:** Firefox doesn't support File System Access yet. Fallback is the Export / Import JSON buttons.

### When the backup is written

- After every popup save (popup is a document, can call FS APIs).
- After every dashboard edit / delete (also a document).
- Manually via the "Backup now" button.

If a write fails (e.g., session-permission revoked), the `meta:dirty` flag stays true and the status bar shows "pending changes." The next user-gesture-driven action (any dashboard button click) will retry.

## Module responsibilities

### `manifest.json`
MV3 spec. Permissions: `storage`, `activeTab`. No host permissions (oEmbed allows CORS). Action popup + options_ui (open_in_tab).

### `schema.js`
- `SCHEMA_VERSION` constant (currently 1).
- `newItem(...)` — factory that stamps `id` (UUID v4 via `crypto.randomUUID`), `createdAt`, `updatedAt`, initializes `revisitCount: 0`, `revisitedAt: []`.
- `buildExport(items)` — wraps the array with `{ schemaVersion, exportedAt, items }`.
- `parseImport(json)` — validates shape and schema version; throws on mismatch. Currently strict on `schemaVersion === 1`. When v2 lands, add a migration ladder here.

### `storage.js`
- `putItem(item)` — writes one key, stamps `updatedAt`, sets `meta:dirty`.
- `getItem(id)`, `deleteItem(id)`, `allItems()` — straightforward.
- `findByUrl(url)` — used by the popup to detect re-saves. Calls `normalizeUrl` internally.
- `normalizeUrl(u)` — strips tracking query params (`utm_*`, `fbclid`, `gclid`, `ref`, `ref_src`), removes hash fragments and trailing slashes. Two URLs that differ only in these are treated as the same item.
- `isDirty()` / `clearDirty()` — track whether the backup file is out of sync with `chrome.storage.local`.

### `backup.js`
- IndexedDB store `study-tracker-fs.handles` holds the single `backupDir` handle.
- `pickBackupFolder()` — `showDirectoryPicker({ mode: 'readwrite' })`, persists handle.
- `writeBackup(json)` — overwrites `study-tracker.json` atomically via a writable stream.
- `readBackup()` — reads and parses the JSON, returns null if file not found.
- `verifyPermission(handle)` — queries permission, requests if needed. Permission requests outside a user gesture context will fail silently; the next button click recovers.

### `popup.js`
- Reads active tab via `chrome.tabs.query({ active: true, currentWindow: true })` (needs `activeTab` permission).
- Detects YouTube via URL pattern, fetches oEmbed for thumbnail and clean title.
- Looks up existing item via `findByUrl`. If found: pre-fills the form, swaps "Save" → "Update", shows a notice with relative-time + revisit count.
- On submit:
  - **New:** calls `newItem(...)`.
  - **Existing:** spreads existing, overwrites fields, bumps `revisitCount`, appends to `revisitedAt`. Preserves `id` and `createdAt`.
- After `putItem`, tries `writeBackup` synchronously before closing popup.

### `options.js`
- Loads all items into a `cache` array. Filtering produces `filteredCache`; rendering is **windowed** (first `PAGE_SIZE = 50`, more loaded via an `IntersectionObserver` watching a `#scroll-sentinel` element with a 300 px `rootMargin`).
- **Search parser** (`parseQuery`): splits the query on whitespace; any token matching `^(tag|status|url|is):value$` becomes a structured filter, otherwise a free-text term. Free-text terms AND together against the concatenated `title + url + notes + tags` haystack. Qualifiers AND with each other and with free text. `is:revisited`, `is:youtube`, `is:web`, `is:done` are pre-baked predicates.
- Search input is debounced (~120 ms) before triggering a filter pass.
- Card construction is factored into `buildCard(item)` so the windowed renderer can call it incrementally.
- Each card has a status `<select>` (changes are immediately persisted), a delete button, and (if `revisitCount > 0`) a popularity badge.
- The `status` select uses a `data-status` attribute so CSS can color-code via attribute selectors.
- Card thumbnails set `loading="lazy"` so images outside the viewport don't fetch.
- A `#count` element above the list shows `N items` matching the current filter.
- On load: triggers `autoBackup()` if `isDirty()` is true and a backup folder is set.
- Listens to `chrome.storage.onChanged` (area `local`) and re-renders when any `item:*` key changes. Debounced 60 ms so rapid writes coalesce, scroll position is preserved. This makes the dashboard live-update when the popup saves in another tab.

**Why infinite-scroll over true virtualization:** cards are variable-height (thumbnail present or not, notes present or not, tag count varies). True virtualization would need height measurement and absolute positioning — significant complexity for vanilla JS. The windowed-append approach gives 95% of the performance benefit at 10% of the code cost. If we ever hit 50k+ items, revisit.

## Data schema

Current `schemaVersion: 1`. Item shape:

```ts
{
  id: string;                  // uuid v4
  url: string;
  title: string;
  type: 'video' | 'article' | 'web';
  source: 'youtube' | 'web';
  thumbnail: string;           // optional, empty string if none
  tags: string[];
  status: 'queued' | 'studying' | 'done';
  notes: string;
  timeSpentMin: number;        // reserved; nothing writes to it yet
  revisitCount: number;        // 0 for new items
  revisitedAt: string[];       // ISO timestamps; one per re-save
  createdAt: string;           // ISO
  updatedAt: string;           // ISO
}
```

Export envelope:

```ts
{
  schemaVersion: 1;
  exportedAt: string;     // ISO
  items: Item[];
}
```

### Schema evolution policy

- Add **optional** fields without bumping `schemaVersion`. Read code must tolerate missing fields (`it.revisitCount || 0`).
- Add **required** fields or change semantics → bump to `schemaVersion: 2`, add a migration in `parseImport`.
- Never reuse a field name with different meaning.

## Theming

The UI uses a "Claude-inspired" palette: warm cream backgrounds (`#F7F3EB`), terracotta primary (`#C96342`), serif headings (Georgia/Charter fallback chain since proprietary Tiempos isn't available), sans body. CSS variables in `:root` make it trivial to retheme.

Status pills, popularity badges, and tag chips all use the same warm palette with intentional contrast — terracotta for "current focus" energy, amber for queued, sage for done.

## Known limitations and accepted tradeoffs

- **Firefox**: backup folder feature unavailable. Acceptable — Export/Import is a reasonable fallback for a non-primary browser.
- **Mobile**: no capture path. Acceptable for now; the user's primary capture context is desktop.
- **Re-permission prompt on restart**: File System Access permissions don't persist across browser sessions in Chrome. Acceptable — one click on any dashboard action re-grants for the session.
- **No service worker**: means we can't do background metadata fetching or scheduled cleanups. Acceptable; everything that runs is user-triggered.
- **Sort order is hardcoded** (`createdAt desc`). Sort UI is a nice-to-have, not yet built.

## Performance notes

Verified safe at expected scale:
- 1 KB/item × 3.6k items/year = 3.5 MB → well under the 10 MB local quota.
- Per-item write = O(1 item size), not O(library).
- Dashboard render is O(N) DOM nodes; at 1k items this is ~50 ms.
- `findByUrl` scans all items in-memory (O(N) URL normalization + compare). At 10k items this is ~5 ms — fine for a popup-open event.

## Where it could break

- **YouTube changes their oEmbed endpoint or removes CORS** — enrichment breaks, save still works.
- **Chrome removes File System Access API** — extremely unlikely; if so, fall back to Export/Import.
- **User's cloud app doesn't sync the folder** (e.g., selective sync off) — silent failure mode. Worth a future doc warning.

## How to extend

- **New schema field**: edit `newItem` in `schema.js`, render it in `options.js`, possibly capture in `popup.js`. No migration needed if optional.
- **New filter**: add the control to `options.html` + handler in `options.js` filtering on `cache`.
- **New backup destination** (e.g., GitHub Gist): add a module parallel to `backup.js`. Keep the same `writeBackup` / `readBackup` interface.
