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
- Improving Agent Workflow Kit is part of the work: identify process weakness when the workflow
  itself is confusing, too heavy, too loose, unsafe, or hard to resume.
- For doc or code changes, `Status = Review` requires a linked PR. Local commits without a PR stay
  `In Progress`; the next action is to open a PR or explain why review is issue-only.
- A linked PR without a recorded agent review result is still agent-owned. Route it to
  `review-local-changes` before human merge approval.
- Treat `Review` as a visible acceptance handoff, not mandatory ceremony. Low-risk docs, process, or
  chore PRs with clean validation may move to human-owned merge when the human explicitly approves.

## Routing Order

1. Check whether the user named a specific issue, PR, branch, artifact, or work item. If so, route
   that item before scanning the whole board.
2. Inspect active PRs before starting new work. A PR without recorded agent review usually
   routes to `review-local-changes`; a reviewable or revision-needed PR usually beats new planning
   work.
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

Do not recommend `Status = Review` for doc or code changes unless the issue has a linked PR. If the
only evidence is a local commit, keep or recommend `In Progress`, record the commit in the issue,
and make opening a PR the next workflow step.

Do not use GitHub draft state as the default workflow holding pen. Open PRs as ready for review when
the branch is pushed, validation has run, and the PR body records issue linkage and current review
state. Use draft only when work is knowingly incomplete, validation is missing, or the PR is exposing
a WIP diff without asking for attention.

Do not treat PR draft/ready state as proof that the agent review gate is complete. If the issue or
PR does not record a completed `review-local-changes` pass, keep or recommend `Status = In
Progress`, `Next Actor = Agent`, and `Decision Needed = None`, then make `review-local-changes` the
next workflow verb. If review finds architecture ambiguity, ownership drift, public-surface risk,
storage risk, or an unclear long-term model, route to `review-revision-triage` or human architecture
review. After agent review is clean or ordinary findings are fixed/classified, the next human
handoff is merge approval, not permission to continue the agent loop.

When preparing or reviewing a PR body, choose issue linkage deliberately. Use `Closes #issue` only
when the PR fully satisfies the issue acceptance criteria and no post-merge reconciliation is needed.
Use `Refs #issue` for initiatives, parent work, partial completion, deferred work, review-triage
follow-up, architecture ambiguity, or uncertainty.

Do not keep routing low-risk docs, process, or chore PRs through extra review loops after the human
has explicitly approved and validation is clean. Report that the next action is human-owned merge.

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

Use `Process feedback` to record weaknesses in the workflow itself, such as missing fields, unclear
handoff state, chat-only decisions, unsafe implementation permission, or ceremony that makes the next
step harder to see. Route actionable durable changes through `improve-workflow`.
