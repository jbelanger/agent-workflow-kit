# Archon Concept Spikes

Status: superseded spike index

Superseded by `docs/development/adrs/github-first-orchestration.md`. This index is retained as
evidence from the Archon experiment; it is not the active backlog.

This document breaks the Archon route into short evidence-gathering spikes. Each spike should answer
one concrete question about Archon machinery before this kit depends on it.

Use this alongside `docs/development/workflow/archon-route-tracker.md`. The tracker owns the route
decision and open work. This file owns the spike protocol and backlog.

## Spike Protocol

Each spike is intentionally small:

- One Archon concept per spike.
- One explicit question.
- One short result artifact.
- No production workflow change unless the result is reviewed and promoted.
- No autonomous merge, push, PR creation, or source-of-truth migration.

Preferred result path:

```text
docs/development/workflow/spikes/archon-<id>-<slug>.md
```

Sub-agents may run spikes in parallel when their write paths are disjoint. A sub-agent must not edit
this index, the route tracker, shared `.archon/` workflow files, or canonical skills unless assigned
that exact write scope.

## Result Template

```md
# ARCHON-SPIKE-<id>: <Title>

Status: proposed | running | complete | blocked

## Question

## Setup

## Evidence

## Result

Pass | Conditional | Fail

## What This Means For Agent Workflow Kit

## Follow-Up Work
```

## Spike Backlog

| ID | Status | Concept | Question | Output |
| --- | --- | --- | --- | --- |
| 001 | Complete | Real CLI validation | Can Archon's own CLI validate and run this repo's workflow pack without relying on our text scanner? | `spikes/archon-001-cli-validation.md` - Pass for validation and deterministic workflow execution; AI execution deferred. |
| 002 | Proposed | Command artifact handoff | Do `.archon/commands` reliably produce useful `$ARTIFACTS_DIR` outputs for fresh downstream nodes? | One prepare artifact review with gaps. |
| 003 | Complete | Structured preflight | Can `output_format`, `when`, and `cancel` create a fail-closed `READY` / `STOP` / `NEEDS_DECISION` gate? | `spikes/archon-003-structured-preflight.md` - Pass with constraint; route from parsed artifact, not raw Codex output. |
| 004 | Proposed | Approval resume | Does an approval node pause, capture response, and resume safely in CLI and Web/GitHub surfaces? | Approval lifecycle evidence. |
| 005 | Proposed | Worktree isolation | Does a mutating workflow always run outside the live checkout and leave recoverable state? | Worktree path, diff, cleanup, and failure behavior notes. |
| 006 | Proposed | Script/bash deterministic nodes | Are script/bash nodes good enough for validators, GitHub reads, and ledger parsing without AI? | Deterministic node examples and limits. |
| 007 | Complete | GitHub adapter | Can a GitHub issue or PR comment safely trigger local read-only work and report back? | `spikes/archon-007-github-adapter.md` - Conditional. |
| 008 | Complete | GitHub approval control | Can GitHub comments approve/reject paused local work without broadening permissions too far? | `spikes/archon-008-github-approval-control.md` - Conditional. |
| 009 | Complete | Run store and dashboard | What state lives in Archon's DB/dashboard, and what must be copied into repo-visible artifacts? | `spikes/archon-009-run-store-dashboard.md` - Pass with boundary. |
| 010 | Complete | Skills with Codex | How does Archon actually expose `.agents/skills` to Codex nodes, and can workflow YAML scope them? | `spikes/archon-010-skills-with-codex.md` - Conditional. |
| 011 | Complete | Provider/tool permissions | Is Codex permission behavior inside Archon acceptable for mutating workflows, or do we need Claude/Pi variants for stronger node restrictions? | `spikes/archon-011-provider-tool-permissions.md` - Conditional. |
| 012 | Complete | `continue work` routing | Can Archon implement `continue work` by checking active runs first, then canonical planning state? | `spikes/archon-012-continue-work-routing.md` - Conditional. |
| 013 | Complete | Artifact promotion | Which Archon artifacts should become issue comments, docs, or ledger entries, and which must remain runtime evidence only? | `spikes/archon-013-artifact-promotion.md` - Conditional. |
| 014 | Complete | Recovery from failure | Can a human recover from paused, failed, cancelled, or abandoned runs without chat memory? | `spikes/archon-014-recovery-runbook.md` - Pass with CLI recovery dogfood; Web/GitHub details remain. |

## Delegation Shape

Use explorers for read-only concept spikes:

```text
Investigate ARCHON-SPIKE-007. Read Archon docs/source as needed. Do not edit shared files.
Write only docs/development/workflow/spikes/archon-007-github-adapter.md.
Answer the question, include exact file refs, and classify Pass/Conditional/Fail.
```

Use workers only after a spike has a narrow patch scope:

```text
Implement ARCHON-SPIKE-003 minimal workflow patch.
Write scope: .archon/workflows/<one-file>.yaml and scripts/validate-archon-pack.mjs only.
Do not modify tracker docs or unrelated commands.
```

## Promotion Rule

A completed spike can change durable workflow only after review:

1. Record the result in its spike file.
2. Update `docs/development/workflow/archon-route-tracker.md` if the result changes route status.
3. Update `.archon/`, skills, validators, or issue templates only when the result is accepted.
4. Keep rejected or conditional findings visible; do not erase the evidence.
