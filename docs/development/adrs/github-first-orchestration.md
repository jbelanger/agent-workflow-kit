# ADR: GitHub-First Orchestration Surface

Status: Accepted

## Context

Agent Workflow Kit needs a simple coordination surface that humans and local agents can both read.
The workflow should stay resumable from durable state instead of depending on chat memory, local
scratch files, or a custom runtime dashboard.

Earlier visual planning experiments and issues were dogfooding artifacts. They should be treated as
historical evidence, not as active workflow state. New work should start from fresh issues or a fresh
target repo instead of repairing stale playground state.

## Decision

Use GitHub issues and PRs as the active orchestration surface for normal Agent Workflow Kit work:

- GitHub Issues hold work items, conversation, human answers, and current collaboration state.
- GitHub PRs hold proposed durable docs or code changes and their review gates.
- Repo docs under `docs/development/` hold accepted durable truth: vision briefs, specs, ADRs,
  spikes, workflow docs, and source evidence.
- Local skills under `.agents/skills/` hold workflow procedure.
- Local Codex, Claude, opencode, and humans are interchangeable workers that read the same issues,
  PRs, and docs.

## Issue-First Contract

The issue thread is the durable work-item state. It should make the next move legible without a
separate planning tool:

| State Need | Where It Lives |
| --- | --- |
| Work shape | Issue title, issue template, and labels such as `task`, `spec`, `adr`, `bug`, or `refactor`. |
| Current status | Latest issue or PR comment, linked PR state, and labels such as `revision-needed`. |
| Human decision needed | Explicit issue or PR comment that asks one question or names the needed approval. |
| Accepted durable truth | Repo docs under `docs/development/` after review. |
| Proposed doc/code change | Linked PR with validation and issue linkage. |
| Merge readiness | PR review, checks, validation summary, and unresolved labels. |

## Orchestrator Contract

The `continue-work` skill is the read-only router for GitHub-first operation. It should inspect the
issues, comments, linked PRs, and repo docs, then choose the next workflow verb:

- `triage-backlog`
- `pick-next-item`
- `groom-issue`
- `discover-vision`
- `draft-artifact`
- `review-artifact`
- `breakdown-issue`
- `prepare-implementation`
- `work-issue-local`
- `review-local-changes`
- `review-revision-triage`

It may recommend GitHub labels and issue comments. It must not silently mutate scope, accept
artifacts, decide architecture, implement code, push, merge, or close work without explicit human
instruction.

Every planning reply should make the next state explicit:

```text
Selected item:
Evidence:
Next Step:
```

## Migration

Restart active coordination from a clean state:

1. Close or archive stale dogfooding issues with a superseded/reset comment.
2. Create one fresh issue only when it clarifies the current direction.
3. Prefer dogfooding in a separate target repository before promoting lessons back into the kit.

## Consequences

The workflow becomes easier to operate remotely because GitHub Mobile can supply human answers and
approvals directly in the issue thread.

The kit stops competing with existing products on runtime machinery. It instead sharpens the parts
existing products do not fully solve for this workflow: planning state, readiness, architecture
guardrails, and agent-resumable next steps.

The cost is that there is less visual workflow state than a dedicated planning UI provides. The kit
should compensate with concise issue comments, clear labels, linked PRs, and deterministic validation
before adding more machinery.

## Alternatives Considered

| Alternative | Rejected because |
| --- | --- |
| Build or adopt a custom dashboard first | That would create runtime machinery before proving the simpler GitHub issue/PR coordination loop. |
| Preserve stale planning state | Historical planning and issue state can encode stale assumptions and keep confusing state alive. |
| Build a custom local runner first | That would recreate platform machinery before proving the simpler GitHub issue/PR coordination loop. |
| Repo-local Markdown work items as primary state | Useful as a fallback, but weaker for mobile operation, comments, PR linkage, and agent handoff. |

## Validation

The decision is valid when:

- `continue-work` exists as a process skill.
- Workflow docs identify GitHub issues and PRs as the active orchestration surface.
- Install and validation scripts know about the GitHub-first profile.
- A fresh issue can clarify direction without requiring a separate planning UI.
