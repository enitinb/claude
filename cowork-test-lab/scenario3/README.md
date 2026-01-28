# Scenario 3: Autonomous Data Workflow

**Test Cowork's ability to run a complete data analysis pipeline.**

---

## What You're Testing

| Dimension | Question |
|-----------|----------|
| Workflow Sequencing | Does it clean *before* analyzing? |
| Statistical Rigor | Are methods named (IQR, z-score)? Thresholds justified? |
| Transparency | Does it document what it changed? |
| Output Usability | Are charts actually usable? |

---

## Examples

| Folder | Task | Input | Output |
|--------|------|-------|--------|
| [scenario3-data-workflow](./scenario3-data-workflow/) | Messy sales data → Full analysis | 1 CSV | Excel workbook with 4 tabs |

---

## The Insight

> "This tests whether Cowork has internalized a data science workflow without being given one. The documentation of transformations is critical — autonomous systems need to be auditable."

---

[← Back](../README.md)
