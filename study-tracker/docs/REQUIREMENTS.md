# Study Tracker — Requirements

> **Audience:** future-me (Claude) returning to this codebase, or anyone forking it.
> **Status:** POC, single-user, personal use.

## Problem

The user (a developer) consumes a lot of learning material — YouTube videos, articles, blog posts, docs — across browsing sessions. They want to:

1. Keep track of what they've watched/read so it doesn't get forgotten.
2. Note **why** they saved something (intent, context).
3. Know which things they keep coming back to (signal of importance).
4. Manage what's queued vs. in-progress vs. done.
5. Not depend on a SaaS account or third-party server.

Existing tools (Pocket, Notion, Raindrop, Karakeep) were either overkill, required accounts, or had too much overhead to capture quickly.

## Core principle: saving must be frictionless

The make-or-break feature. If saving takes more than ~3 seconds and 1–2 clicks, the user won't use it. Every design decision is judged against this.

## Functional requirements

### Must have (v0.1 — done)
- **One-click save** of the current tab via toolbar popup; auto-fills title and URL.
- **YouTube enrichment** — pulls video title and thumbnail via the oEmbed endpoint.
- **Per-item fields**: title, URL, tags (comma-separated), notes, status (queued / studying / done).
- **Dashboard** in the extension's options page:
  - List view with thumbnails.
  - Search across title / URL / notes / tags (free-text + qualifiers).
  - **Search qualifiers**: `tag:<x>`, `status:<queued|studying|done>`, `url:<substr>`, `is:revisited`, `is:youtube`, `is:web`, `is:done`. Multiple qualifiers AND together with free-text terms.
  - Status filter dropdown (separate from qualifiers, applies on top).
  - Inline status change.
  - Delete.
  - **Bounded rendering**: first 50 cards rendered eagerly, more loaded via IntersectionObserver as the user scrolls. Match count shown above the list. Scales to tens of thousands of items without UI lag.
- **Local backup file** (`study-tracker.json`) written to a user-chosen folder:
  - Auto-written on every save / edit / delete.
  - Picked once via File System Access API; permission persisted via IndexedDB.
  - Acts as both safety net and de facto cloud sync (folder is inside the user's Google Drive / iCloud / Dropbox).
- **Manual Export / Import JSON** as a fallback for browsers without File System Access support (Firefox).
- **Restore from backup** — reads the JSON file, merges items into local storage.
- **Duplicate detection** — saving the same URL re-opens the existing item (no duplicate entries). URL is normalized: tracking params (`utm_*`, `fbclid`, `gclid`, `ref*`) and fragments stripped, trailing slash removed.
- **Revisit counter** — every time the user re-saves a URL, `revisitCount` bumps and the timestamp is appended to `revisitedAt`. Surfaced as a popularity badge on dashboard cards (gray → amber at 2× → terracotta at 5×).
- **Copy queue as markdown** — one-click "Copy queue" button copies all `status: queued` items as a markdown list (title + link + tags + notes) to the clipboard. Used to self-remind by pasting into Notes / Messages / email / etc.

### Nice to have (not yet built)
- Sort dashboard by popularity / recency / revisit recency.
- Saved searches / pinned filters.
- "Recently revisited this week" filter as a one-click chip.
- Time-spent tracking (the schema reserves `timeSpentMin` but nothing writes to it).
- Mini revisit timeline under each card.
- Custom extension icon (currently default puzzle piece).
- Mobile capture via PWA share target.
- Auto-fetch Open Graph metadata for non-YouTube pages.
- Bulk operations (tag many items at once, archive done items).

### Explicitly out of scope (for now)
- Multi-user / accounts / auth.
- Server-side anything. No backend.
- Browser sync via `chrome.storage.sync` (100KB cap is too small).
- Direct Google Drive / Dropbox API integration (cloud sync is delegated to the user's existing desktop sync app).
- Full-text search of the saved article body.
- Spaced repetition / quizzing.
- Sharing items with other users.
- Analytics or telemetry of any kind.

## Non-functional requirements

| Quality | Target |
|---|---|
| Save latency (popup click → confirmation) | < 500 ms typical, < 1.5 s with backup write |
| Dashboard load with 1k items | < 200 ms |
| Storage budget | Stays well under `chrome.storage.local`'s 10 MB cap at expected use (~3.5 MB/year) |
| Privacy | No outbound network requests except YouTube oEmbed |
| Offline | Fully works offline; only YouTube enrichment requires network |
| Browser support | Chrome, Edge, Brave, Opera (Chromium with File System Access API). Firefox runs in degraded mode (Export/Import only). |
| Data portability | Plain JSON, human-readable, documented schema |

## User stories

- **Capture:** *"I'm watching a YouTube tutorial. I want to save it with one click, add a tag, and get back to it later."*
- **Triage:** *"On Sunday I want to look through everything I queued this week and pick what to actually study."*
- **Resume:** *"I started a long video three days ago. I want to find it quickly and mark it as 'studying'."*
- **Discover patterns:** *"I keep re-saving the same article. The dashboard should make that obvious — it means it's important."*
- **Migrate:** *"I got a new laptop. I want my library to follow me without any account."*

## Success criteria

- The user actually uses it daily for two weeks without abandoning it.
- They can find any item they vaguely remember saving within ~10 seconds.
- Zero data loss across a Chrome reinstall (proven via Restore flow).

## Open questions / future decisions

- **Sort default:** stay on `createdAt desc`, or move to a "smart" sort that weighs popularity?
- **Schema v2:** when adding new fields, bump `schemaVersion` and write a migration, or keep v1 permissive? Currently permissive (missing fields default at read time).
- **YouTube short URLs (`youtu.be`) vs. full URLs:** currently treated as different. Worth normalizing to the same canonical form.
- **Same video at different timestamps (`?t=120`):** currently treated as same after normalization. Confirm this is desired.
