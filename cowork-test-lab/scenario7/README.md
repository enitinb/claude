# Scenario 7: Advanced Spreadsheet Engineering

**Test Cowork's ability to produce real working Excel models — with lookup formulas, conditional formatting, cross-sheet references, and computed flags.**

---

## What You're Testing

| Capability | Question |
|------------|----------|
| Real Excel competence | Are formulas formulas (VLOOKUP, INDEX-MATCH, IF, AND) — not strings or pasted values? |
| Multi-source joins | Does Cowork join three CSVs on shared keys using lookup formulas, including two-key lookups? |
| Conditional formatting | Is it applied as actual rules, not just colored cells? |
| Data quality | Does Cowork catch duplicates, typos, missing fields, and category errors? |
| CFO/HR-usability | Could a finance or people leader open the workbook Monday morning and use it without rework? |

---

## Examples

| Folder | Task | Inputs | Time |
|--------|------|--------|------|
| [scenario7-financial-model](./scenario7-financial-model/) | Transactions + chart of accounts + budget → Q1 P&L workbook | 3 CSVs (~75 transactions) | ~8 min |
| [scenario7-hr-dashboard](./scenario7-hr-dashboard/) | Roster + comp bands + perf scores → comp dashboard | 3 CSVs (25 employees) | ~6 min |

---

## The Insight

> "The bar isn't 'can it produce a spreadsheet' — every chatbot can. The bar is whether the formulas are *real*: do they recalculate when you edit a band, do the conditional-format rules survive a copy-paste, are duplicates and typos in the underlying data actually surfaced? Most LLM-generated spreadsheets fail this test silently. The test is whether Cowork doesn't."

---

[← Back](../README.md)
