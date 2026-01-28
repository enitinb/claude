# Scenario 3: Data Workflow

**1 messy CSV → Cleaned, analyzed, charted Excel workbook**

---

## Documents

| File | Content |
|------|---------|
| `sales_data.csv` | 25 rows of Q1 sales with data issues |

### Issues Hidden in Data

| Issue | Example |
|-------|---------|
| Inconsistent casing | "North" vs "NORTH" |
| Missing value | Blank units field |
| Negative revenue | -1950 (error) |
| Outlier | 500 units (10x normal) |
| Zero row | 0 units, 0 revenue |

---

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

---

## Prompt

```
Analyze this dataset end-to-end:

1. Clean and normalize the data (document what you changed)
2. Identify outliers and anomalies with statistical justification
3. Summarize trends and key insights
4. Generate 3-4 charts suitable for an executive presentation
5. Output everything into a single Excel workbook with tabs for raw, cleaned, analysis, and charts

Save to outputs folder.
```

---

## What to Evaluate

| Dimension | What to Watch |
|-----------|---------------|
| **Workflow sequencing** | Does it clean *before* analyzing? Does it explain the sequence? |
| **Statistical rigor** | Are outlier methods named (IQR, z-score)? Are thresholds justified? |
| **Transparency** | Does it document transformations, or just silently change data? |
| **Output usability** | Can you actually use the charts, or do they need rework? |

---

## Expected Insights

| # | Cowork Should Find |
|---|-------------------|
| 1 | Regions normalized (North, South, East, West) |
| 2 | Bob's 500-unit entry flagged as outlier (statistical method named) |
| 3 | Negative revenue flagged and corrected |
| 4 | North region is top performer |
| 5 | Widget C has highest margin |
| 6 | Change log shows exactly what was modified |

---

## Cleanup

```bash
./cleanup.sh
```
