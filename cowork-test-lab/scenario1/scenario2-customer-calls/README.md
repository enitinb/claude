# Scenario 2: Customer Calls

**4 documents → Customer insights**

---

## Documents

| File | Content |
|------|---------|
| `call_john.txt` | Frustrated customer, export issue |
| `call_maria.txt` | Happy customer, upgrade interest |
| `products.txt` | Plan pricing |
| `customers.csv` | Account data |

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
1. Each call: sentiment, issue, resolution
2. Churn risks with evidence
3. Upsell opportunities with pricing
4. Recommended actions

Save to outputs folder.
```

---

## Expected Insights

| # | Cowork Should Find |
|---|-------------------|
| 1 | John is churn risk — frustrated, renews in 30 days, health score 45 |
| 2 | John has 500 contacts but Starter only allows 200 — needs Pro ($99) |
| 3 | Maria wants API access → Business plan upsell ($199, +$100/mo) |

---

## Cleanup

```bash
./cleanup.sh
```
