# Agent Workflow Kit Docs

This folder is the installed documentation root for Agent Workflow Kit (AWK).

Use this folder for AWK process references, workflow decisions, and installation guidance that apply
across target repositories. AWK is a lightweight agent-loop contract:

```text
Intake -> Shape -> Execute -> Review -> Improve
```

The docs should explain how to make work safe for autonomous handoff. They should not turn external
trackers, specs, ADRs, discovery, or procedural specialist passes into mandatory ceremony.

Do not put project-specific product plans, UX direction, specs, ADRs, spikes, or work items here.
Those belong under `docs/development/` when they become durable project artifacts. AWK executable
skills live under `.agents/skills/awk/`; this folder explains the process those skills follow.

## Map

- `workflow/`: canonical operating flow, GitHub surface companion, and installation guide.
- `adrs/`: accepted AWK process decisions copied with the kit.
