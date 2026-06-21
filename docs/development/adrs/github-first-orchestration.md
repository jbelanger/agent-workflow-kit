# ADR: GitHub-First Orchestration Surface

Status: Accepted

## Context

Agent Workflow Kit started with a GitHub-native planning direction, then tested Archon as an
optional execution profile. The Archon experiment produced stronger portable skills, especially for
grooming, discovery, durable artifact drafting, artifact review, and specialist lenses. It also
showed that dashboard/run-store state is not the right source of truth for human-centered planning.

The current GitHub Project and early issues are stale dogfooding artifacts. They should be treated
as historical evidence, not as active workflow state. The next workflow iteration should restart the
GitHub coordination surface from a clean Project and fresh issues while keeping the better skills
from the Archon branch.

## Decision

Use GitHub as the active orchestration surface for normal Agent Workflow Kit work:

- GitHub Issues hold work items, conversation, human answers, and current collaboration state.
- GitHub Projects hold operating state for "what should happen next."
- GitHub PRs hold proposed durable docs or code changes and their review gates.
- Repo docs under `docs/development/` hold accepted durable truth: vision briefs, specs, ADRs,
  spikes, workflow docs, and source evidence.
- Local skills under `.agents/skills/` hold workflow procedure.
- Local Codex, Claude, opencode, and humans are interchangeable workers that read the same issues,
  docs, and project fields.

Archon remains experimental evidence and an optional runtime adapter. It is not the baseline
planning interface, board source of truth, or required install profile.

## Board Contract

A fresh GitHub Project should be created instead of repairing the stale board. The minimum useful
fields are:

| Field | Options |
| --- | --- |
| `Status` | `Inbox`, `Grooming`, `Discovery`, `Drafting`, `Breakdown`, `Ready`, `In Progress`, `Review`, `Done`, `Deferred` |
| `Issue Type` | `Initiative`, `Discovery`, `Spec`, `ADR`, `Spike`, `Task`, `Bug`, `Refactor` |
| `Next Actor` | `Human`, `Agent`, `Either` |
| `Decision Needed` | `None`, `Question`, `Approval`, `Research`, `Architecture`, `Access` |
| `Area` | Project-defined areas such as `Workflow`, `Agent Guidance`, `GitHub Config`, `CI`, `Docs`, `Governance`, `Unclassified` |
| `Merge Risk` | `Parallel-safe`, `Needs coordination`, `Serial only` |
| `Artifact State` | `None`, `Draft`, `Accepted`, `Implemented`, `Superseded` |

`Status` is only the coarse lifecycle. `Next Actor` and `Decision Needed` are the memory layer that
lets a human answer from GitHub Mobile and lets Codex resume without chat context.

Do not use `Blocked` as a normal board phase. A blocked item should be represented by `Next Actor`
and `Decision Needed`, plus a clear issue comment explaining the blocker.

## Orchestrator Contract

The `continue-work` skill is the read-only router for GitHub-first operation. It should inspect the
Project, issues, comments, linked PRs, and repo docs, then choose the next workflow verb:

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

It may recommend GitHub field updates and issue comments. It must not silently mutate scope, accept
artifacts, decide architecture, implement code, push, merge, or close work without explicit human
instruction.

Every planning reply should make the next state explicit:

```text
Status:
Next Actor:
Decision Needed:
Next Step:
```

## Migration

Restart the active GitHub coordination surface:

1. Close or archive stale dogfooding issues with a superseded/reset comment.
2. Create a new GitHub Project with the board contract above.
3. Create a new root initiative: `[Initiative] Build GitHub-first Agent Workflow Kit v0`.
4. Create fresh child issues for the GitHub-first ADR, project setup script, workflow docs update,
   `continue-work` skill, and first dogfood run.
5. Leave Archon route trackers, spikes, and adapters in the repository as historical and optional
   runtime evidence until a later cleanup decision removes or packages them.

## Consequences

The workflow becomes easier to operate remotely because GitHub Mobile can supply human answers and
approvals directly in the issue thread.

The kit stops competing with existing products on runtime machinery. It instead sharpens the parts
existing products do not fully solve for this workflow: planning state, readiness, architecture
guardrails, and agent-resumable next steps.

The cost is that GitHub Project setup becomes a first-class install concern. The kit needs scripts
and validation for labels, templates, Project fields, and the reset procedure.

## Alternatives Considered

| Alternative | Rejected because |
| --- | --- |
| Continue with Archon as primary UX | The dashboard/run model is useful for execution but awkward for PM-style interview, issue discussion, and remote mobile answers. |
| Preserve the current Project and issues | The existing board and issues encode stale assumptions from the Archon experiment and would keep confusing state alive. |
| Build a custom local runner first | That would recreate platform machinery before proving the simpler GitHub issue/PR coordination loop. |
| Repo-local Markdown work items as primary state | Useful as a fallback, but weaker for mobile operation, comments, PR linkage, and agent handoff. |

## Validation

The decision is valid when:

- `continue-work` exists as a process skill.
- Workflow docs identify GitHub Issues/Projects/PRs as the active orchestration surface.
- Install and validation scripts know about the GitHub-first profile.
- A fresh Project can be created and dogfooded from an empty board to a reviewed PR.
