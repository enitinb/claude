# Scenario 6a: Journal Pattern Synthesis

**14 daily journal entries → themes, patterns, and quiet insights**

Two weeks of fictional daily journal (Apr 23 – May 6, 2026) from a single person. Entries cover work, sleep, exercise, a side writing project, a dog, and a friendship under strain. The test is whether Cowork can surface patterns that emerge only when the entries are read *together*.

---

## Documents

| File | Day | Tone |
|------|-----|------|
| `2026-04-23.txt` | Wed | Starting the journal, optimistic |
| `2026-04-24.txt` | Thu | Anxious about a work project; up too late |
| `2026-04-25.txt` | Fri | Foggy, unproductive after bad sleep |
| `2026-04-26.txt` | Sat | Reset day, long sleep, long walk |
| `2026-04-27.txt` | Sun | Best writing session in months |
| `2026-04-28.txt` | Mon | Productive Monday |
| `2026-04-29.txt` | Tue | Average; another canceled friend plan |
| `2026-04-30.txt` | Wed | Solid, finished an item that mattered |
| `2026-05-01.txt` | Thu | Stressed; couldn't sleep |
| `2026-05-02.txt` | Fri | Foggy after bad sleep — *pattern repeating* |
| `2026-05-03.txt` | Sat | Recovery; recognizes the pattern explicitly |
| `2026-05-04.txt` | Sun | Friendship resolution |
| `2026-05-05.txt` | Mon | High-energy, finished essay draft |
| `2026-05-06.txt` | Tue | Reflective two-week summary written by the journaler themselves |

---

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

---

## Prompt

```
Read all the journal entries in the inputs folder. Treat them as one person's
notebook, written for themselves and not for an audience.

Produce two outputs in the outputs folder:

1. patterns.md — a thoughtful synthesis of the patterns, themes, and quiet
   insights present across the entries. Cover:
   - Behavioral patterns (what predicts good days vs hard ones?)
   - Recurring themes — work, relationships, creative work, health
   - Wins and progress the journaler may be underweighting
   - Concerns the journaler is circling but not naming directly
   - One or two specific, gentle suggestions for the next two weeks,
     grounded in what the entries themselves say

2. timeline.md — a one-page chronological summary, day by day, with one
   line per day capturing the main thread.

Tone: respectful, observational, never preachy. This is the journaler's
own material being held up to a mirror, not advice from a stranger.
```

---

## Expected Insights

| # | Cowork Should Find |
|---|-------------------|
| 1 | **Sleep → next-day focus correlation** is the dominant behavioral pattern — appears at least 3 times (Thu/Fri Apr 24-25; Thu/Fri May 1-2). The journaler partially names this themselves. |
| 2 | **Morning walks → productive days** — present in 11 of 14 entries; absence on May 2 coincides with worst day |
| 3 | **No-screen mornings → best work** — Sun Apr 27 and Mon May 5 both call this out; Cowork should connect them |
| 4 | **The Hartwell project is a steady stressor**, not the cause of the bad weeks — only flares when combined with sleep/relationships |
| 5 | **Friendship arc with Jordan** — three canceled plans early; resolution May 4 reveals Jordan has been dealing with a parent's illness. Journaler underestimated context. |
| 6 | **Essay progress is non-linear but real** — started 8 weeks before, finishes a draft May 5. Worth flagging as a win the journaler is downplaying. |
| 7 | **The May 6 entry is meta-reflective** — Cowork should acknowledge it instead of re-summarizing; the journaler already did some of this work |

---

## What You're Testing

| Capability | Question |
|------------|----------|
| Cross-entry pattern detection | Does it surface patterns visible only across multiple days? |
| Affect-aware reading | Does it read tone, not just facts? |
| Restraint | Does it resist over-claiming, moralizing, or armchair-diagnosing? |
| Specificity | Are suggestions grounded in *what the entries actually say*, not generic wellness advice? |
| Respect for the writer's own work | Does it engage with the May 6 meta-entry instead of overriding it? |

---

## Cleanup

```bash
./cleanup.sh
```
