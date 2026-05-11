# Scenario 4: File & Document Management

**Test Cowork's ability to manage real-world file collections — organize, categorize, and rename.**

---

## What You're Testing

| Capability | Question |
|------------|----------|
| File-type inference | Does Cowork correctly classify files by extension *and* name pattern? |
| Metadata awareness | Does it use modification dates (not just filenames) when grouping? |
| Policy comprehension | Can it apply written rules (an expense policy) when categorizing? |
| Pattern unification | Can it detect multiple naming conventions and unify them? |
| Auditability | Does it produce a transparent log of every move, decision, or rename? |

---

## Examples

| Folder | Task | Inputs | Time |
|--------|------|--------|------|
| [scenario4-organize-downloads](./scenario4-organize-downloads/) | Messy Downloads → categorized structure | 22 mixed files | ~5 min |
| [scenario4-receipts-to-expense-report](./scenario4-receipts-to-expense-report/) | Receipts + policy → policy-checked expense report | 8 receipts + policy | ~5 min |
| [scenario4-batch-rename](./scenario4-batch-rename/) | Inconsistently named files → unified naming | 12 files | ~4 min |

---

## A note on test files

The files with binary extensions (`.pdf`, `.jpg`, `.png`, `.pptx`, etc.) are intentional **text placeholders** — they won't open in Preview, Photos, or PowerPoint. This is by design: these scenarios test how Cowork organizes and renames files based on their **names, extensions, and modification dates**, not their binary contents. Plain-text files (notes, receipts, the expense policy) contain real content for Cowork to read.

---

## The Insight

> "These tasks look mechanical but aren't. Each one requires Cowork to read the *content* and *metadata* — not just the filename — and to make judgment calls (which version is canonical, which expense exceeds policy, which file is ambiguous). The audit trail is the test: a system that silently moves files isn't trustworthy."

---

[← Back](../README.md)
