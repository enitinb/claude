# Scenario 4b: Receipts → Expense Report

**8 receipts + corporate policy → policy-checked expense report**

A fictional trip to a conference in San Francisco, March 14–16, 2026. The traveller (Alex Morgan, fictional) is on company "Cedarcrest" expense rules.

---

## Documents

| File | Content |
|------|---------|
| `corporate_expense_policy.md` | Reimbursement rules, caps, exclusions |
| `receipt_01_skyrail_flight.txt` | PDX↔SFO economy round-trip |
| `receipt_02_sterling_cove_hotel.txt` | 2-night hotel folio |
| `receipt_03_halcyon_coffee.txt` | Coffee w/ a client contact |
| `receipt_04_meridian_team_dinner.txt` | 4-person client dinner with wine |
| `receipt_05_ridehail_to_airport.txt` | Rideshare PDX outbound |
| `receipt_06_ridehail_from_airport.txt` | Rideshare PDX inbound |
| `receipt_07_brightloom_coworking.txt` | Day pass + meeting room |
| `receipt_08_ironpeak_outfitters.txt` | Rain shell + umbrella |

---

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

---

## Prompt

```
Read the corporate expense policy and all receipts in the inputs folder.

Produce a polished expense report (Excel workbook) in the outputs folder containing:

1. A "Summary" tab with: trip dates, total submitted, total reimbursable,
   total excluded, and totals broken down by policy category.
2. A "Line items" tab listing each receipt with: date, vendor, category,
   amount, reimbursable amount, excluded amount, and a "policy note"
   column explaining any cap, partial reimbursement, or exclusion.
3. A "Policy issues" tab listing anything that violates or partially
   violates policy, with the rule that was triggered and the math.

Also produce a 1-page "expense_report_summary.md" suitable for a manager
to skim before approving.
```

---

## Expected Insights

| # | Cowork Should Find |
|---|-------------------|
| 1 | **Meridian team dinner exceeds the $60/person cap** — 4 attendees, total ~$313.63, ~$78.40/person → ~$73.60 over cap |
| 2 | **Wine on team dinner partially non-reimbursable** — policy allows 1 drink per attendee, receipt has 4 glasses for 4 attendees (within rule, but should be itemized in the report) |
| 3 | **Ironpeak Outfitters is non-reimbursable** — outdoor gear / clothing is explicitly excluded by policy |
| 4 | **Hotel minibar water ($9.00) is non-reimbursable** — in-room minibar excluded |
| 5 | Hotel nightly rate ($269) is **within** the $275 Tier-1 cap — should explicitly note this passes |
| 6 | Coffee meeting attendees noted on receipt (Priya Iyer, Nordvale) — captures business purpose for a sub-$25 receipt |
| 7 | All receipts ≥ $25 are itemized as policy requires |

---

## What You're Testing

| Capability | Question |
|------------|----------|
| Policy comprehension | Does it actually apply the policy, or just total the receipts? |
| Math transparency | When an item is capped/partial, does it show the calculation? |
| Categorization | Does each line map to a policy category cleanly? |
| Judgment | Does it flag the gear purchase rather than blindly reimbursing it? |
| Output usability | Is the Excel actually openable with working formulas, not text-only? |

---

## Cleanup

```bash
./cleanup.sh
```
