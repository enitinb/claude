# Scenario 5a: Market Research Synthesis

**6 source documents → executive briefing on a fictional market**

Inputs span an analyst market report, a funding-round news article, a trend piece, a follow-on analyst note, an internal Slack export, and a prospect call transcript. Together they describe a fictional category ("AI-native document workflows for SMBs") with a focal competitor ("Quillshift").

---

## Documents

| File | Type | What's in it |
|------|------|---------------|
| `01_industry_market_report.md` | Analyst report | Market sizing, segmentation, vendor activity |
| `02_news_quillshift_series_b.md` | News article | $42M Series B announcement, mentions a *pivot* |
| `03_techstyle_article_market_heatup.md` | Trend piece | Why the space is crowded; skeptical view |
| `04_analyst_note_penumbra.md` | Analyst note (later) | Consolidation thesis, Q1 2026 readout |
| `05_internal_slack_export.md` | Internal chatter | Rumors, lost-deal patterns, pricing intel |
| `06_prospect_call_transcript.txt` | Customer-facing | A real head-to-head with Quillshift in flight |

---

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

---

## Prompt

```
Synthesize the source documents in the inputs folder into an executive briefing
for our leadership team. The deliverable should answer four questions clearly:

1. What is the state of the market and how is it changing?
2. Who is our most important competitor and what is their trajectory?
3. Where do we win, where do we lose, and what should we prioritize?
4. What strategic moves should we expect from competitors in the next 90 days?

Where the sources disagree (e.g., market sizing), reconcile or call out the
disagreement explicitly with the methodology behind each number.

Produce two outputs in the outputs folder:
  - briefing.md  (3-4 pages, polished, suitable for a leadership read-out)
  - sources.md   (list each source with one-line summary and what we drew from it)
```

---

## Expected Insights

| # | Cowork Should Find |
|---|-------------------|
| 1 | **Quillshift pivoted** from PDF redaction for legal to general SMB document workflows — only made explicit in source 02 and source 03 |
| 2 | **Market-size disagreement:** Penumbra says $3.2B (2025), the news article cites $5.1B — different category definitions, both should be reported |
| 3 | **Where we win:** pricing is materially cheaper (Slack: ~$45 vs ~$79; transcript confirms 70% cheaper) |
| 4 | **Where we lose:** integration breadth — 17 connectors vs 38 (Slack #1 evidence; prospect call confirms) |
| 5 | **Likely M&A in next 90 days** — analyst note says "weeks not months"; Slack rumor names Loomtide as a likely Quillshift target |
| 6 | **Support is a Quillshift weakness** to attack — flagged independently in both the prospect call and Slack |
| 7 | **Consolidation theme** — analyst note + trend article converge that sub-scale players will be acqui-hired by Q4 |

---

## What You're Testing

| Capability | Question |
|------------|----------|
| Cross-source synthesis | Does it connect a single fact (Quillshift's pivot, Loomtide rumor) across documents that mention it differently? |
| Source-tension handling | When sources disagree, does it reconcile rather than pick one silently? |
| Mixed-register reading | Can it pull insight from both formal (analyst) and informal (Slack) registers? |
| Strategic translation | Does it move from facts → recommended priorities, not just summarize? |
| Source attribution | Does each claim trace back to a specific source? |

---

## Cleanup

```bash
./cleanup.sh
```
