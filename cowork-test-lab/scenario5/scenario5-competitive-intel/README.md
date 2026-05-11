# Scenario 5b: Competitive Intelligence → Battlecard

**6 source documents → sales-ready competitive battlecard**

A fictional competitor ("Quillshift"). The inputs are their public-facing materials plus our internal sales evidence — exactly the mix a real CI analyst would work with.

---

## Documents

| File | Type | What's in it |
|------|------|---------------|
| `01_quillshift_homepage_text.md` | Public | Positioning, hero, "why choose us" |
| `02_quillshift_pricing_page.md` | Public | Pricing tiers, minimums, support SLAs |
| `03_quillshift_blog_post.md` | Public | CEO's 2026 strategic priorities |
| `04_quillshift_g2_reviews.md` | Public | 6 reviews, mixed sentiment |
| `05_lost_deal_notes.md` | Internal | 3 deals we lost to them in 90 days |
| `06_quillshift_press_release.md` | Public | A new feature launch from this week |

---

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

---

## Prompt

```
You are preparing a competitive battlecard for our sales team. They use it
in live deals where Quillshift is the other vendor in the eval.

Read all source documents in the inputs folder and produce
"battlecard_quillshift.md" in the outputs folder, structured like this:

1. One-line summary (who they are, who they target, where they're strong)
2. Their strengths (substantiated with evidence from the sources)
3. Their weaknesses (substantiated, with quotes where useful)
4. Where we win (use lost-deal patterns as well as their weaknesses)
5. Where they win (be honest — pretending otherwise loses deals)
6. Pricing positioning — side-by-side, including the "true" cost (minimums, billing cycle, add-ons)
7. Objection-handling scripts — 4 to 6 of the questions a prospect is most likely to ask
8. Watch-this-quarter — what we should track based on their public direction

Cite the source for each substantive claim (file name and one-line context).

Also produce "talking_points_one_pager.md" — a one-page version a rep
could glance at 30 seconds before a call.
```

---

## Expected Insights

| # | Cowork Should Find |
|---|-------------------|
| 1 | **Pricing positioning is our biggest lever** — Team plan jumps from $29 (Solo) to $79 (Team) at the 3-seat minimum; this surfaces in pricing page *and* a review |
| 2 | **Support SLA is a real weakness** — Team plan is 24h, one review reports 4-day actual response; flagged in 2 of 6 reviews |
| 3 | **Integration breadth is their moat** — every lost deal cites integrations; 38 vs (ours) lower count |
| 4 | **Multi-step agent reliability is a weak point** — one review describes a multi-step failure that "silently skipped" items |
| 5 | **Strategic direction = vertical agents** — blog post + press release converge on finance/expense as the focused vertical |
| 6 | **They're cooling on enterprise this year** — blog explicitly says "not chasing enterprise aggressively" — leaves enterprise opening |
| 7 | **They acknowledge their support problem and are fixing it** — blog post #3 — battlecard should note window is closing |
| 8 | **Counter-position the Expense Pilot launch** — if we already offer expense reporting, the press release becomes a feature-parity opportunity |

---

## What You're Testing

| Capability | Question |
|------------|----------|
| Evidence-grounded claims | Does every claim cite a specific source? |
| Tone calibration | Is the battlecard *sales-usable* (concrete, quotable) vs vague? |
| Steel-manning | Does it credit competitor strengths instead of trashing them? |
| Time-sensitivity | Does it notice that an *announced fix* changes how durable a weakness is? |
| Format awareness | Does it produce two outputs at different depths (full + one-pager) appropriately? |

---

## Cleanup

```bash
./cleanup.sh
```
