# Scenario 7a: Multi-Tab Financial Model

**Transactions + chart of accounts + budget → working Excel P&L with formulas, lookups, conditional formatting, and exception flags**

A fictional manufacturer ("Hartwell Industries") closes its Q1 2026 books. The bookkeeper has a flat list of 75 transactions, a chart of accounts that maps account codes to categories, and a 2026 budget. Cowork must produce a multi-tab Excel workbook that any CFO would expect: a real P&L with cross-sheet references, working formulas, conditional formatting, and a data-quality tab that flags problems.

---

## Documents

| File | Rows | Content |
|------|------|---------|
| `transactions_q1_2026.csv` | 75 | Q1 transactions — date, vendor/customer, description, account_code, amount |
| `chart_of_accounts.csv` | 16 | account_code → account_name → category → type |
| `budget_2026.csv` | 13 | Monthly + Q1 budget by category |

---

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

---

## Prompt

```
Build a Q1 2026 financial model in Excel from the inputs in the inputs folder.

Produce a single workbook (q1_2026_financial_model.xlsx) in the outputs folder
with these tabs:

1. "P&L" — categorized profit and loss showing Jan / Feb / Mar / Q1 total /
   Q1 budget / variance ($ and %). Group by Revenue, COGS, OpEx, Other.
   Bold the totals. Conditional-format variance % red when unfavorable
   beyond 5%, green when favorable beyond 5%.

2. "Transactions" — full transaction list with two extra columns added by
   VLOOKUP or INDEX-MATCH against the chart of accounts: "account_name"
   and "category". Use real formulas, not pasted values.

3. "Category summary" — pivot-style summary, one row per category,
   showing actual Q1, budget Q1, variance, variance %.

4. "Data quality" — list every row in the transaction file that has any
   of the following issues, with a description column explaining why:
   - Missing account_code
   - Missing vendor/customer
   - Possible duplicate (same date, same vendor, same amount)
   - Vendor name variant of another vendor (likely typo)
   - Unsigned amount inconsistent with category direction (revenue should be positive, expense negative)
   - Account_code present but not found in the chart of accounts

5. "Notes" — short prose. Headline P&L result, top 3 things a CFO should
   know, and how confident you are given the data-quality issues.

Also produce "q1_2026_pl_summary.md" — a one-page text summary suitable for
a board email.
```

---

## Expected Insights

| # | Cowork Should Find |
|---|-------------------|
| 1 | **Duplicate payroll: T-2026-019 and T-2026-020** — identical date, vendor, amount, and description. Flag, exclude from totals, note the ~$428k impact |
| 2 | **Vendor typo: "Nordvale Logisitcs" (T-2026-056)** — should be "Nordvale Logistics" — flag as variant |
| 3 | **Missing account_code: T-2026-043 and T-2026-074** — one is a TBD wire transfer, one is a refund. Both should be flagged. T-2026-043 also has no vendor |
| 4 | **Marketing budget overrun ~19%** — actual ~$178k vs budget $150k, driven by trade show (jan booth deposit + feb balance + mar agency) + a brand-refresh project |
| 5 | **Software budget overrun ~10%** — actual ~$116k vs budget $105k — driven by an extra subscription (Penumbra Insights) |
| 6 | **Travel materially under-spent** — actual ~$15k vs budget $75k — flag whether intentional or a tracking gap |
| 7 | **Revenue ahead** — recurring + products + services Q1 totals can be checked against the $6.25M revenue budget |
| 8 | **VLOOKUP / INDEX-MATCH must be real formulas** — not pasted values; opening the file in Excel and editing a chart-of-accounts row should propagate |
| 9 | **Conditional formatting on variance %** — actually applied, not just colored cells |

---

## What You're Testing

| Capability | Question |
|------------|----------|
| Multi-source joins | Does it use lookup formulas to join transactions to chart of accounts? |
| Real Excel competence | Are formulas formulas, not strings? Does the workbook open cleanly? |
| Data-quality vigilance | Does it find all 4 categories of issue (duplicate, typo, missing fields, refund without code)? |
| Variance reasoning | Does it explain *why* a category is over/under, not just that it is? |
| Layout judgment | Does it group categories sensibly and bold totals? |
| CFO usability | Could a CFO open the workbook and use it Monday morning, or would they have to rework it? |

---

## Cleanup

```bash
./cleanup.sh
```
