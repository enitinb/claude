# Scenario 7b: HR Dashboard

**Employee roster + comp bands + performance scores → working HR dashboard with band-check formulas and flight-risk flags**

A fictional company's 25-person headcount file plus the compensation bands HR maintains and the latest performance review scores. The test is whether Cowork can join three datasets with real lookup formulas, compute band placement, *and* exercise judgment about who is under-compensated for their performance — i.e., who's a flight risk.

---

## Documents

| File | Rows | Content |
|------|------|---------|
| `employee_roster.csv` | 25 | id, name, role, level, dept, hire date, salary, manager id |
| `compensation_bands.csv` | 21 | role × level → band min / mid / max |
| `performance_scores.csv` | 25 | id → score (1–5) + reviewer note |

---

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

---

## Prompt

```
Build a compensation & performance dashboard in Excel from the three files
in the inputs folder. Produce hr_dashboard_q1_2026.xlsx in the outputs folder
with these tabs:

1. "Dashboard" — one row per employee with: id, name, role, level, department,
   salary, band min, band mid, band max, "% of band" (where in the band they
   sit, 0%=min 100%=max), performance score, and a "flag" column for any of:
     - below_band  (salary < band_min)
     - above_band  (salary > band_max)
     - underpaid_for_performance  (performance ≥ 4 AND % of band < 35%)
     - overpaid_for_performance   (performance ≤ 2 AND % of band > 50%)
     - in_band

   Use real lookup formulas (VLOOKUP or INDEX-MATCH) on role+level to pull
   the band. Conditional-format the "% of band" column with a 3-color scale
   (red low, white middle, green high).

2. "Flagged employees" — filtered to anyone with a non-"in_band" flag.
   Each row should add a short "recommended action" column.

3. "Department summary" — one row per department: headcount, average salary,
   average band placement %, count of employees with each flag type.

4. "Notes" — short prose. Headline retention risks, comp-vs-performance
   patterns by department, and anything the data raises that HR should
   discuss in their next comp review.

Also produce "hr_summary.md" — a one-page text version a People lead could
read before a 1:1 with the CEO.
```

---

## Expected Insights

| # | Cowork Should Find |
|---|-------------------|
| 1 | **Mira Castellanos (E-004) is a flight risk** — performance 5, at the mid of SWE L3. Reviewer note "mentors L1/L2" suggests senior scope already; promotion to L4 (band 150-185) likely overdue |
| 2 | **Riley Lim (E-007) is underpaid for performance** — score 4, salary $98k at the floor of SWE L2 (band 95-120). Reviewer note flags her as promotion candidate H1 2026 — that should accelerate |
| 3 | **Kemi Adeyemi (E-010) is underpaid for performance** — score 4 as L1 SWE at the floor of band. Strong-for-cohort note suggests an in-band raise is warranted |
| 4 | **Nadia Petrov (E-024) is the largest scope-vs-comp gap** — score 5 with a note explicitly saying she "is effectively running rev ops single-handedly" — she's compensated as Ops Specialist L2 but doing manager-scope work |
| 5 | **Bea Castellanos (E-022) — overpaid for performance** — performance 2, on PIP, salary at mid of Marketing L2 band. Worth flagging though sensitively (a PIP outcome will resolve this) |
| 6 | **Sofia Karras (E-014) and Eloise Marchetti (E-016)** — both performance 5; Eloise is upper-band, Sofia is mid-band. Sofia is a softer retention case to raise |
| 7 | **Department patterns** — Engineering median band-% likely lower than Sales (because Sales VP and AEs are upper-band). Worth surfacing as a structural comp question, not just a list of individuals |
| 8 | **CEO not in roster** — the file has 25 employees, no CEO; the bands file has no CEO entry. Acceptable; should be noted in the "Notes" tab as data scope |

---

## What You're Testing

| Capability | Question |
|------------|----------|
| Compound lookups | Does it join on (role, level) — a two-key lookup — not just one column? |
| Calculated metrics | Is "% of band" a formula, not a pasted value? Does it work if a band changes? |
| Multi-condition flagging | Are the flags computed by formula (IF/AND), or hardcoded text? |
| Performance judgment | Does it move from data → recommended action, with the reviewer note as evidence? |
| Aggregate views | Does the dashboard pivot meaningfully by department, not just list employees? |
| Sensitivity | Is the PIP'd employee handled with care, not just listed as "overpaid"? |

---

## Cleanup

```bash
./cleanup.sh
```
