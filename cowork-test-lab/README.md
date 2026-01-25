# 🧪 Cowork Test Lab

**Simple test scenarios for evaluating [Claude Cowork](https://support.claude.com/en/articles/13345190-getting-started-with-cowork).**

---

## What is Cowork?

Cowork uses the same agentic architecture that powers Claude Code, now accessible within Claude Desktop and without opening the terminal. Instead of responding to prompts one at a time, Claude can take on complex, multi-step tasks and execute them on your behalf.

With Cowork, you can describe an outcome, step away, and come back to finished work—formatted documents, organized files, synthesized research, and more.

Unlike standard chat where you prompt and wait for responses, Cowork can:

- **Take on multi-step tasks** and execute them autonomously
- **Read and write local files** directly on your machine
- **Coordinate parallel workstreams** using sub-agents
- **Run for extended periods** without timeouts

You describe an outcome, step away, and come back to finished work — documents, analysis, organized files, and more.

---

## Purpose of This Repo

This repo provides **ready-to-run test scenarios** to evaluate Cowork's capabilities:

- ✅ Does it read multiple documents correctly?
- ✅ Does it connect information across files?
- ✅ Does it surface insights not explicitly stated?
- ✅ Does it produce useful, structured output?

Each scenario includes synthetic test data, setup scripts, prompts, and expected insights so you can quickly validate Cowork's performance.

---

## Structure

```
cowork-test-lab/
├── scenario1/                          # Knowledge Synthesis
│   ├── scenario1-meeting-notes/        # 3 docs → executive summary
│   └── scenario1-customer-calls/       # 4 docs → customer insights
└── scenario2/                          # Messy → Polished Outputs
    └── scenario2-messy-to-polished/    # 3 rough files → report, slides, spreadsheet
```

---

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/cowork-test-lab.git
cd cowork-test-lab/scenario1/scenario1-meeting-notes
chmod +x setup.sh && ./setup.sh
```

Then: Claude Desktop → Cowork mode → Run the prompt from README

---

## Requirements

- macOS + [Claude Desktop](https://claude.com/download)
- Paid Claude plan (Pro, Max, Team, Enterprise)

---

## Resources

- [Getting Started with Cowork](https://support.claude.com/en/articles/13345190-getting-started-with-cowork)
- [Claude Desktop Download](https://claude.com/download)

---

<p align="center"><i>All test data is synthetic.</i></p>
