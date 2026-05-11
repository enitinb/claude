# Scenario 4a: Organize Downloads

**22 mixed files → categorized folder structure**

---

## Documents

| Category | Example files |
|----------|---------------|
| Resumes / cover letters | `Resume_AlexMorgan_v3_FINAL.pdf`, `Resume_AlexMorgan_v2.pdf`, `cv-cover-letter-final-final.docx` |
| Vendor / finance PDFs | `nordvale-invoice-INV-0042.pdf`, `meridian-quote-april2026.pdf`, `mortgage-statement-mar-2026.pdf` |
| Research / whitepapers | `Halcyon-Labs-Whitepaper-2026.pdf` |
| Travel | `boarding-pass-SkyRail-MAR15.pdf` |
| Camera photos | `IMG_20260214_142233.jpg`, `IMG_20260214_142401.jpg`, `IMG_20260309_091122.jpg` |
| Screenshots | `Screenshot 2026-02-14 at 9.15.22 AM.png` (x3) |
| Office docs | `q1-board-deck-draft.pptx`, `house-budget-2026.xlsx` |
| Personal notes | `recipes_to_try.txt`, `random_notes.txt`, `untitled.txt` |
| Media / archives / installers | `zoom_recording_2026-03-12.mp4`, `tax_documents_2025.zip`, `installer_brightloom.dmg` |

Modification dates are set by `setup.sh` so date-based organization is meaningfully testable (files span Oct 2025 → Apr 2026).

---

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

---

## Prompt

```
Organize the files in the inputs folder into a clean, categorized structure
in the outputs folder.

Group by type (documents, images, media, archives, installers) and within
each type group by month based on file modification date. Use folder names
that would make sense in a real Downloads folder.

Where you find clear duplicates or older versions of the same file, place
the older copy into an "_archive" sub-folder rather than deleting it.

Produce a short report ("organization_report.md") at the top of the
outputs folder explaining:
- How many files were sorted
- The folder structure you chose and why
- Anything ambiguous you had to decide
```

---

## Expected Insights

| # | Cowork Should Find / Do |
|---|------------------------|
| 1 | Detect `Resume_AlexMorgan_v2.pdf` as superseded by `..._v3_FINAL.pdf` and archive the older one |
| 2 | Treat `installer_brightloom.dmg` as a disposable installer (separate from documents) |
| 3 | Distinguish screenshots from camera photos despite both being images |
| 4 | Handle `untitled.txt` gracefully (low-information filename) — flag rather than mis-categorize |
| 5 | Use modification date, not filename date, when they disagree |
| 6 | Produce a transparent report explaining its decisions |

---

## What You're Testing

| Capability | Question |
|------------|----------|
| File-type inference | Does it correctly classify by extension *and* name pattern? |
| Duplicate detection | Does it recognize `_v2` vs `_v3_FINAL` as versions of one document? |
| Date awareness | Does it group by month using actual file metadata? |
| Transparency | Does it explain what it did, instead of silently moving files? |

---

## Cleanup

```bash
./cleanup.sh
```
