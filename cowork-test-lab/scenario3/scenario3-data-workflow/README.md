# Scenario 3: Data Workflow

**1 messy CSV → Full analysis in Excel workbook**

---

## Document

| File | Content |
|------|---------|
| `sales_data.csv` | Q1 sales data with intentional issues |

### Data Issues to Find

| Issue | Example |
|-------|---------|
| Inconsistent casing | "North" vs "NORTH" vs "north" |
| Missing value | Row with blank units |
| Negative revenue | -1950 (likely data entry error) |
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
Analyze the sales data in the inputs folder end-to-end:

1. Clean and normalize the data (document what you changed)
2. Identify outliers and anomalies with statistical justification
3. Summarize trends and key insights
4. Generate 3-4 charts suitable for an executive presentation
5. Output everything into a single Excel workbook with tabs:
   - Raw (original data)
   - Cleaned (with change log)
   - Analysis (stats, outliers, insights)
   - Charts

Save to outputs folder.
```

---

## What to Verify

| Check | What to Look For |
|-------|------------------|
| **Sequencing** | Did it clean before analyzing? |
| **Normalization** | Are regions standardized (North, South, East, West)? |
| **Outliers Found** | 500 units flagged? Negative revenue flagged? |
| **Method Named** | Does it say "IQR" or "z-score" or "standard deviations"? |
| **Change Log** | Can you see exactly what was modified? |
| **Charts Work** | Are they actual Excel charts, not images? |

---

## Expected Insights

| # | Cowork Should Find |
|---|-------------------|
| 1 | Total revenue ~$82K (after cleaning) |
| 2 | North region is top performer |
| 3 | Widget C has highest margin |
| 4 | Bob's 500-unit entry is anomaly (10x his average) |
| 5 | One negative revenue needs correction |
| 6 | Alice is most consistent performer |

---

## Cleanup

```bash
./cleanup.sh
```
