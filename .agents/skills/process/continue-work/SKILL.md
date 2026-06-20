---
name: continue-work
description: Inspect GitHub-first workflow state and choose the next safe workflow action. Use when the user says "continue work", "what next", "resume this project", or wants Codex to infer the next step from GitHub issues, project fields, PRs, and repo docs.
---

# Continue Work

You are the GitHub-first workflow orchestrator. Your job is to decide the next safe workflow verb
from visible state, not to perform every step yourself.

## Inputs To Read

- `AGENTS.md`.
- `docs/development/workflow/ai-dev-workflow.md`.
- `docs/development/adrs/github-first-orchestration.md`.
- The active GitHub Project when available.
- Open GitHub issues, issue comments, labels, sub-issues, milestones, linked PRs, and project field
  values.
- Repo-local durable docs named by those issues or PRs.

If GitHub is unavailable, fall back to repo-local docs and explain that the project state could not
be inspected.

## Core Stance

- GitHub Issues and Projects hold active workflow state.
- Repo docs hold accepted durable truth.
- PRs hold proposed doc/code changes and review gates.
- Skills hold procedure.
- Agents do not merge, silently decide architecture, silently accept artifacts, or expand scope.

## Routing Order

1. Check whether the user named a specific issue, PR, branch, artifact, or work item. If so, route
   that item before scanning the whole board.
2. Inspect active PRs before starting new work. A reviewable or revision-needed PR usually beats new
   planning work.
3. Inspect Project items with `Next Actor = Agent` or `Either`.
4. If several items are eligible, prefer:
   - review or revision work that unblocks merge,
   - accepted direction ready for breakdown,
   - narrow Ready work,
   - high-value grooming or discovery,
   - stale cleanup only when it blocks the board.
5. If no item is actionable, report the blocker and the smallest human decision needed.

## Workflow Verbs

Route to one of these verbs:

| Situation | Next skill |
| --- | --- |
| Board is noisy, stale, or unclear | `triage-backlog` |
| Several items are plausible | `pick-next-item` |
| Issue intent or type is unclear | `groom-issue` |
| Product, UX, creative, game, platform, or architecture vision is unresolved | `discover-vision` |
| Accepted or groomed direction needs a spec, ADR, or spike record | `draft-artifact` |
| Vision brief, spec, or ADR is ready for human acceptance or revision routing | `review-artifact` |
| Accepted direction must become merge-safe child issues | `breakdown-issue` |
| A child issue needs an implementation brief | `prepare-implementation` |
| A Ready issue should be implemented and the user asked for implementation | `work-issue-local` |
| Local changes need pre-PR review | `review-local-changes` |
| PR feedback, architecture-sensitive review, or revision routing is needed | `review-revision-triage` |

Do not call a mutating implementation path merely because an issue is Ready. The user must ask to
implement or otherwise grant that action in the current turn.

## GitHub State Rules

Interpret the recommended Project fields this way:

| Field | Meaning |
| --- | --- |
| `Status` | Coarse lifecycle: where the item is in the workflow. |
| `Issue Type` | What kind of work or artifact this is. |
| `Next Actor` | Who should move it next: `Human`, `Agent`, or `Either`. |
| `Decision Needed` | Why progress cannot continue automatically, or `None`. |
| `Artifact State` | Whether linked durable planning text is draft, accepted, implemented, or superseded. |
| `Merge Risk` | Whether implementation can safely proceed in parallel. |

If fields are missing, infer cautiously from issue text and comments, then recommend the field
updates instead of pretending the board is complete.

## Output

Return:

```md
## Continue Work

Selected item:
Reason:
Next workflow verb:

## Current state

Status:
Issue Type:
Next Actor:
Decision Needed:
Artifact State:
Merge Risk:

## Evidence

## Next action

## Recommended GitHub updates

## Blockers or human decision

## Process feedback
```

When recommending an issue comment, provide the exact Markdown body. When recommending Project field
updates, list the target field/value pairs. Do not claim they were applied unless you actually apply
them with an explicit user request.
