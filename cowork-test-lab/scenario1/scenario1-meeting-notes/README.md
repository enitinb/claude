# Scenario 1: Meeting Notes

**3 documents → Executive summary**

---

## Documents

| File | Content |
|------|---------|
| `meeting_q1_planning.txt` | Leadership decides API over mobile |
| `meeting_engineering.txt` | Engineers find a quick fix option |
| `personal_notes.txt` | Unshared concerns |

---

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

---

## Prompt

```
Analyze all documents in the inputs folder.

Create:
1. Executive summary (what was decided, what changed)
2. All action items with owners
3. Risks or concerns not discussed
4. Recommendation

Save to outputs folder.
```

---

## Expected Insights

| # | Cowork Should Find |
|---|-------------------|
| 1 | Original API decision may not be needed — there's a 2-day quick fix |
| 2 | Quick fix opens possibility of doing mobile in Q1 |
| 3 | Sarah already told customers about "major upgrade" — messaging risk |

---

## Cleanup

```bash
./cleanup.sh
```
