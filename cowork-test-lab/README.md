# 🧪 Cowork Test Lab

**Simple test scenarios for evaluating [Claude Cowork](https://support.anthropic.com/en/articles/11182706-getting-started-with-cowork).**

---

## What is Cowork?

Cowork is Anthropic's agentic AI capability in Claude Desktop. Unlike standard chat where you prompt and wait for responses, Cowork can:

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
└── scenario1/                          # Knowledge Synthesis
    ├── scenario1-meeting-notes/        # 3 docs → executive summary
    └── scenario2-customer-calls/       # 4 docs → customer insights
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

- macOS + [Claude Desktop](https://claude.ai/download)
- Paid Claude plan (Pro, Max, Team, Enterprise)

---

## Resources

- [Getting Started with Cowork](https://support.anthropic.com/en/articles/11182706-getting-started-with-cowork)
- [Claude Desktop Download](https://claude.ai/download)

---

<p align="center"><i>All test data is synthetic.</i></p>
