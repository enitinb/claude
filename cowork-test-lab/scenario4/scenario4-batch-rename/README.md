# Scenario 4c: Batch Rename

**12 files in inconsistent patterns → unified `YYYY-MM-DD_<descriptive>.<ext>` naming**

A mix of camera photos, macOS screenshots, browser-saved images, manually named files, plain notes, and a versioned PowerPoint — collected over a 2-day fictional conference trip and a later board-prep file.

---

## Documents

| Original name | Pattern | Hint for new name |
|---------------|---------|-------------------|
| `IMG_20260315_092042.jpg` | camera | date embedded in filename |
| `IMG_20260315_142233.jpg` | camera | date embedded in filename |
| `IMG_20260315_171814.jpg` | camera | date embedded in filename |
| `Screenshot 2026-03-15 at 11.04.22 AM.png` | macOS | date embedded in filename |
| `Screenshot 2026-03-16 at 9.42.18 AM.png` | macOS | date embedded in filename |
| `photo (1).jpg` | browser dl | rely on mtime |
| `photo (2).jpg` | browser dl | rely on mtime |
| `photo (3).jpg` | browser dl | rely on mtime |
| `march15_keynote_panel.jpg` | manual | subject hint + date |
| `notes-march-15.txt` | manual | content/date — readable as conference Day 1 |
| `notes 3-16.txt` | manual | content/date — readable as conference Day 2 |
| `BoardPresentation-Final-v3-reviewed.pptx` | versioned doc | mtime; preserve version info |

---

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

---

## Prompt

```
Rename all files in the inputs folder to a consistent naming convention:

  YYYY-MM-DD_<short-descriptive-name>.<ext>

Rules:
- Determine the date from the filename when one is embedded.
- When the filename has no date, use the file's modification time.
- For text notes, read the content to derive a meaningful description.
- Preserve meaningful version info (e.g., "v3") when present.
- Keep names lowercase, dash-separated, no spaces or parentheses.

Place renamed copies in the outputs folder (do not modify originals).
Also produce a "rename_log.md" mapping old name -> new name -> reason.
```

---

## Expected Insights

| # | Cowork Should Find / Do |
|---|------------------------|
| 1 | Parse all three date formats (`YYYYMMDD`, `YYYY-MM-DD`, `M-DD`) consistently |
| 2 | Fall back to mtime for the three `photo (N).jpg` files and pick distinct dates |
| 3 | Read the two notes files and derive descriptions like `conference-day-1` / `conference-day-2` |
| 4 | Preserve `v3` (or similar) on the board deck rather than dropping version info |
| 5 | Produce a rename log so the user can audit / revert |
| 6 | Sort numbered photo bursts by mtime within the same day (e.g., `09-20`, `14-22`, `17-18`) without collisions |

---

## What You're Testing

| Capability | Question |
|------------|----------|
| Pattern recognition | Does it detect that multiple naming conventions exist and unify them? |
| Content-aware naming | Does it actually read text files for descriptions, not just guess from filename? |
| Metadata fallback | Does it use mtime when the filename is ambiguous? |
| Audit trail | Does it log the rename mapping so the action is reversible? |
| Collision safety | Does the new naming scheme avoid name collisions on the same date? |

---

## Cleanup

```bash
./cleanup.sh
```
