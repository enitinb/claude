# Scenario 6b: Reading Highlights → Synthesis

**5 sets of reading highlights → connected insights, tensions, and a personal synthesis**

A reader's highlights from five fictional sources on the same broad topic (focus, attention, and digital habits). The sources agree on some things, disagree on others, and have an interesting cross-reference (the podcast host interviews the book's author, who *updates* her own position).

---

## Documents

| File | Source type | Stance |
|------|-------------|--------|
| `01_book_highlights_concentration_economy.md` | Book (Imogen Wren) | Attentional crisis predates social media; friction is the answer |
| `02_article_attention_research_review.md` | Academic review | Calls out which popular claims are over-evidenced; champions environmental interventions |
| `03_podcast_notes_deep_work_episode.md` | Podcast (Wren as guest) | Wren *updates* her social-media position; introduces "attentional sovereignty" |
| `04_blog_post_frictionless_paradox.md` | Opinion blog | Friction is good, frictionless-habits industry is a scam |
| `05_newsletter_focus_issue.md` | Newsletter | Adopts "attentional sovereignty"; mushier on social-media question |

---

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

---

## Prompt

```
Read all 5 source highlight files in the inputs folder. They share a topic
(focus, attention, deep work, digital habits) but come from different
formats (book, academic article, podcast, blog, newsletter) and different
stances.

Produce in the outputs folder:

1. synthesis.md — a connected synthesis (not a summary). It should:
   - Identify the points where multiple sources converge.
   - Identify points where sources disagree or use the same idea
     differently, and name the disagreement.
   - Note any place where an author revises or updates their own
     previous position.
   - Surface specific, actionable ideas that would survive any of
     these authors disagreeing with each other.

2. one_pager.md — a single page suitable for a busy reader: 5-7 bullets
   capturing what they would take from these 5 sources combined.

Where you reference a source, name it (and the author if known).
```

---

## Expected Insights

| # | Cowork Should Find |
|---|-------------------|
| 1 | **Convergence: environmental > willpower** — the academic review, the blog post, and the newsletter all converge on this; the book implies it; Cowork should name it as the most-supported claim |
| 2 | **Real tension: friction vs frictionless** — the book and the blog explicitly argue *for* friction; mainstream productivity advice argues against; Cowork should call this out, not flatten it |
| 3 | **Wren updates herself** — in the podcast she revises her social-media position from the book ("the platforms are extraordinarily good at exploiting [the crisis]"). Cowork should notice and credit the update |
| 4 | **"Attentional sovereignty"** — the term migrates from podcast → newsletter. Cowork should notice the cross-reference and that the newsletter author *acknowledges they didn't coin it* |
| 5 | **Academic article's "23-minute" caveat** — pushes back on a figure the productivity literature treats as gospel. Cowork should weigh popular vs research evidence |
| 6 | **Calibration is a sub-theme** — Wren in the podcast, the blog comments, the newsletter Q&A all converge that one-size-fits-all advice fails |
| 7 | **Where would all five authors agree?** — phone-out-of-room or equivalent environmental change; protect early-morning attention; calibrate to your own pattern. Cowork should surface these as the durable claims |

---

## What You're Testing

| Capability | Question |
|------------|----------|
| Synthesis ≠ summarization | Does it *connect* across sources or just describe each one? |
| Disagreement detection | Does it notice substantive contradictions (friction vs frictionless)? |
| Position-update detection | Does it pick up that Wren revises herself in the podcast? |
| Source-tracking | Are claims attributed to the source they came from? |
| Epistemic humility | Does it weight academic vs. popular sources appropriately when they disagree? |

---

## Cleanup

```bash
./cleanup.sh
```
