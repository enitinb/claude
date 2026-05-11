# Study Tracker

A minimal Chrome extension to track what you're learning — YouTube videos, articles, blog posts, docs — without an account, server, or subscription.

One click to save. Local-first. Auto-backs up to a folder you pick (drop it inside iCloud / Google Drive / Dropbox to get free cross-device sync).

## Why

I keep watching tutorials and reading articles and forgetting them. Existing tools (Pocket, Notion, Raindrop) felt like overkill or required accounts. I wanted something with the friction of a browser bookmark and a tiny bit more structure: tags, notes, status, and a signal for "I keep coming back to this."

## Features

- **One-click save** from any tab via toolbar icon
- **YouTube auto-enrichment** — pulls title and thumbnail
- **Tags, notes, status** (queued / studying / done)
- **Search & filter** in the dashboard
- **Duplicate detection** — re-saving the same URL updates the existing entry (URL tracking params are normalized away)
- **Revisit counter** — re-saving bumps a counter and timestamps the revisit. Cards show a popularity badge that warms in color the more times you've come back
- **Auto-backup to a local folder** via the File System Access API. Drop the folder inside any cloud-sync app for free multi-device sync
- **Manual Export / Import JSON** as fallback
- **Restore from backup** — wipes nothing, merges items by ID
- **No accounts, no servers, no telemetry**

## Screenshots

Add your own once you've installed it:
- `docs/screenshot-popup.png` — the toolbar popup
- `docs/screenshot-dashboard.png` — the dashboard with a few items

## Install

This is an unpacked extension — not on the Chrome Web Store.

1. Clone or download this repo.
2. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`).
3. Toggle **Developer mode** on (top-right).
4. Click **Load unpacked** and select this folder.
5. Pin the **Study Tracker** icon from the puzzle-piece menu in your toolbar.

The extension uses the default puzzle-piece icon — custom icons are on the roadmap.

## First-time setup

1. Click the toolbar icon → **Open dashboard →**.
2. Click **Pick backup folder…** and choose a folder.
   - For cross-device sync: pick a subfolder inside your cloud-synced folder, e.g.
     - macOS iCloud: `~/Library/Mobile Documents/com~apple~CloudDocs/study-tracker/`
     - Google Drive: `~/Google Drive/My Drive/study-tracker/`
     - Dropbox: `~/Dropbox/study-tracker/`
3. Chrome will ask permission to edit files in that folder — click **Allow**.

That's it. Every save now also writes `study-tracker.json` to that folder.

## Usage

- **Save a page**: click the toolbar icon → tweak title / tags / notes → **Save**.
- **Reopen a page you've saved**: the popup shows "Already saved" with a revisit count; fields pre-fill; **Save** becomes **Update**.
- **Review**: open the dashboard. Search, filter by status, change status inline, delete.

## Sync to another machine

1. Install the extension on the new machine.
2. Open the dashboard → **Pick backup folder…** and point it at the same synced folder (cloud app must have synced `study-tracker.json` there).
3. Click **Restore from backup**.

## Data shape

```json
{
  "schemaVersion": 1,
  "exportedAt": "2026-05-10T12:00:00Z",
  "items": [
    {
      "id": "uuid",
      "url": "https://...",
      "title": "...",
      "type": "video | article | web",
      "source": "youtube | web",
      "thumbnail": "https://...",
      "tags": ["..."],
      "status": "queued | studying | done",
      "notes": "...",
      "timeSpentMin": 0,
      "revisitCount": 0,
      "revisitedAt": [],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

`study-tracker.json` is a plain text file. You can open it in any editor, version-control it, email it to yourself — whatever.

## How sync works

The extension itself never talks to any cloud service. Sync works because the folder you pick is already synced by some other app:

```
Mac A: extension writes → ~/iCloud/study-tracker/study-tracker.json
                              ↓
                         iCloud syncs the file
                              ↓
Mac B: ~/iCloud/study-tracker/study-tracker.json  →  click Restore
```

This means: no OAuth, no API keys, no service to go down, no privacy policy to read. Your data, your folder, your sync app.

## Browser support

| Browser | Save / dashboard | Auto-backup folder | Export / Import JSON |
|---|---|---|---|
| Chrome / Edge / Brave / Opera | yes | yes | yes |
| Firefox | yes | no (File System Access API not supported) | yes |
| Safari | not tested | n/a | n/a |

## Project structure

```
study-tracker/
  manifest.json         MV3 manifest
  popup.html/.css/.js   Quick-save popup
  options.html/.css/.js Dashboard
  storage.js            chrome.storage.local wrapper
  backup.js             File System Access API + IndexedDB for the handle
  schema.js             Schema version + factories
  docs/
    REQUIREMENTS.md     What the product does and doesn't do
    TECH.md             Architecture and decisions
```

## Development

There's no build step. Edit any file and reload the extension at `chrome://extensions` (click the circular reload icon on the Study Tracker card).

For changes to be safe across re-saves: read `docs/TECH.md` first — especially the schema evolution policy.

## Roadmap

- Custom extension icon (currently default puzzle piece)
- Sort by popularity / recently revisited
- Recently-revisited filter on the dashboard
- Time-spent tracking (schema field exists but unused)
- Open Graph metadata auto-fetch for non-YouTube pages
- Mobile capture via PWA share target

## Privacy

- No outbound network calls except the YouTube oEmbed endpoint when you save a YouTube URL (no auth, fetches public metadata only).
- No telemetry, no analytics, no remote logging.
- Data lives in `chrome.storage.local` and the folder you pick.

## License

MIT — add a `LICENSE` file with your name and the current year before publishing.

## Status

Personal POC. Used daily by one person (the author). API and schema may change without notice while it's still v0.x.
