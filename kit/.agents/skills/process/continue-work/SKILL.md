---
name: continue-work
description: Inspect GitHub-first workflow state and choose the next safe workflow action. Use when the user says "continue work", "what next", "resume this project", or wants Codex to infer the next step from GitHub issues, PRs, and repo docs.
---

# Continue Work

You are the issue-first workflow router. Your job is to decide the next safe workflow verb from
visible GitHub and repo state, not to perform every step yourself.

## Inputs To Read

- `AGENTS.md`.
- `docs/development/workflow/ai-dev-workflow.md`.
- `docs/development/adrs/github-first-orchestration.md`.
- Open GitHub PRs, including comments, review state, checks, labels, and linked issues.
- Open GitHub issues, including comments, labels, sub-issues, milestones, and linked PRs.
- Repo-local durable docs named by those issues or PRs.

If GitHub is unavailable, fall back to repo-local docs and explain that remote issue/PR state could
not be inspected.

## Core Stance

- GitHub issues hold active work items, discussion, human answers, and current collaboration state.
- GitHub PRs hold proposed doc/code changes and review gates.
- Repo docs hold accepted durable truth.
- Skills hold procedure.
- Agents do not merge, silently decide architecture, silently accept artifacts, or expand scope.
- Improving Agent Workflow Kit is part of the work: identify process weakness when the workflow
  itself is confusing, too heavy, too loose, unsafe, or hard to resume.
- For doc or code changes, review requires a linked PR. Local commits without a PR stay agent-owned;
  the next action is to open a PR or explain why review is issue-only.
- A linked PR without a recorded agent review result is still agent-owned. Route it to
  `review-local-changes` before human merge approval.
- Treat review as a visible acceptance handoff, not mandatory ceremony. Low-risk docs, process, or
  chore PRs with clean validation may move to human-owned merge when the human explicitly approves.

## Routing Order

1. Check whether the user named a specific issue, PR, branch, artifact, or work item. If so, route
   that item before scanning the whole repo.
2. Inspect active PRs before starting new work. A PR without recorded agent review usually routes to
   `review-local-changes`; a reviewable or revision-needed PR usually beats new planning work.
3. Inspect open issues that are labeled, recently updated, assigned, explicitly linked from docs, or
   mentioned by the user.
4. If several items are eligible, prefer:
   - review or revision work that unblocks merge,
   - accepted direction ready for breakdown,
   - narrow ready work with clear acceptance criteria,
   - high-value grooming or discovery,
   - stale cleanup only when it blocks the repo.
5. If no item is actionable, report the blocker and the smallest human decision needed.

## Workflow Verbs

Route to one of these verbs:

| Situation | Next skill |
| --- | --- |
| Backlog is noisy, stale, or unclear | `triage-backlog` |
| Several items are plausible | `pick-next-item` |
| Issue intent or type is unclear | `groom-issue` |
| Product, UX, creative, game, platform, or architecture vision is unresolved | `discover-vision` |
| Accepted or groomed direction needs a spec, ADR, or spike record | `draft-artifact` |
| Vision brief, spec, or ADR is ready for human acceptance or revision routing | `review-artifact` |
| Accepted direction must become merge-safe child issues | `breakdown-issue` |
| A child issue needs an implementation brief | `prepare-implementation` |
| A ready issue should be implemented and the user asked for implementation | `work-issue-local` |
| Local changes need pre-PR review | `review-local-changes` |
| PR feedback, architecture-sensitive review, or revision routing is needed | `review-revision-triage` |

Do not call a mutating implementation path merely because an issue looks ready. The user must ask to
implement or otherwise grant that action in the current turn.

## Issue And PR State Rules

Use issue bodies, comments, labels, linked PRs, and repo docs as the active state surface. If state
is missing, infer cautiously from visible discussion and recommend a clarifying issue comment or
label instead of pretending the repo is complete.

Use issue and PR labels for lightweight routing:

| Label | Meaning |
| --- | --- |
| `revision-needed` | Review found actionable work before merge. |
| `needs-human-review` | Human architecture or product judgment is needed before proceeding. |
| `needs-source-evidence` | Claims need code, docs, logs, or external evidence before work can proceed. |
| `human-only` | The item should not be autonomously executed by an agent. |

Do not recommend review for doc or code changes unless the issue has a linked PR. If the only
evidence is a local commit, keep the work agent-owned, record the commit in the issue, and make
opening a PR the next workflow step.

Do not use GitHub draft state as the default workflow holding pen. Open PRs as ready for review when
the branch is pushed, validation has run, and the PR body records issue linkage and current review
state. Use draft only when work is knowingly incomplete, validation is missing, or the PR is exposing
a WIP diff without asking for attention.

Do not treat PR draft/ready state as proof that the agent review gate is complete. If the issue or
PR does not record a completed `review-local-changes` pass, make `review-local-changes` the next
workflow verb. If review finds architecture ambiguity, ownership drift, public-surface risk, storage
risk, or an unclear long-term model, route to `review-revision-triage` or human architecture review.
After agent review is clean or ordinary findings are fixed/classified, the next human handoff is
merge approval, not permission to continue the agent loop.

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

## Evidence

## Next action

## Recommended GitHub updates

## Blockers or human decision

## Process feedback
```

When recommending an issue or PR comment, provide the exact Markdown body. When recommending labels,
list the target labels. Do not claim they were applied unless you actually apply them with an
explicit user request.

Use `Process feedback` to record weaknesses in the workflow itself, such as missing labels, unclear
handoff state, chat-only decisions, unsafe implementation permission, or ceremony that makes the next
step harder to see. Route actionable durable changes through `improve-workflow`.
