# Scenario 1: Messy to Polished

**3 rough inputs → Report, Slides, Spreadsheet**

---

## Documents

| File | Type | Content |
|------|------|---------|
| `voice_memo_q4_review.txt` | Raw notes | Rambling Q4 thoughts |
| `q4_numbers.csv` | Partial data | Monthly revenue, deals, churn |
| `deck_outline.txt` | Bullet list | Rough slide outline |

---

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

---

## Prompt

```
Analyze all documents in the inputs folder.

Create three deliverables for a board meeting:

1. A polished Word report summarizing Q4 performance (1-2 pages)
2. A PowerPoint deck (5-6 slides) suitable for a 10-minute presentation
3. An Excel spreadsheet with the Q4 data, including:
   - Totals and averages
   - % vs target calculation
   - A simple chart

Save all files to the outputs folder.
```

---

## What to Verify

| Check | What to Look For |
|-------|------------------|
| **Report** | Professional tone, organized sections, key insights highlighted |
| **Slides** | Executive-friendly, not too much text, clear headlines |
| **Excel** | Formulas work (not just static numbers), totals are correct |
| **Abstraction** | Report has detail, slides have headlines, spreadsheet has data |

---

## Expected Outputs

Cowork should produce files that show:

| # | Insight |
|---|---------|
| 1 | Revenue: $2.4M total (18% above $2.03M target) |
| 2 | Formulas in Excel: =SUM(), =AVERAGE(), =(actual-target)/target |
| 3 | Slides have clear headlines, not walls of text |
| 4 | Report mentions both wins (Acme, TechStart) and challenges (churn, hiring) |
| 5 | Q1 recommendation included (mobile focus) |

---

## Cleanup

```bash
./cleanup.sh
```
