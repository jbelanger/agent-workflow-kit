---
name: continue-work
description: Inspect GitHub-first workflow state and choose the next safe workflow action. Use when the user says "continue work", "what next", "resume this project", or wants Codex to infer the next step from GitHub issues, PRs, repo docs, and labels.
---

# Continue Work

You are the GitHub-first workflow orchestrator. Your job is to decide the next safe workflow verb
from visible state, not to perform every step yourself.

## Inputs To Read

- `AGENTS.md`.
- `docs/awk/workflow/ai-dev-workflow.md`.
- `docs/awk/adrs/github-first-orchestration.md`.
- Open GitHub issues, issue comments, labels, sub-issues, milestones, and linked PRs.
- Repo-local durable docs named by those issues or PRs.

If GitHub is unavailable, fall back to repo-local docs and explain that the project state could not
be inspected.

## Core Stance

- GitHub Issues hold workflow state.
- Repo docs hold accepted durable truth.
- PRs hold proposed doc/code changes and review gates.
- Labels provide lightweight issue type and review signals.
- Skills hold procedure.
- AWK routes by task shape. Do not force every item through discovery, specs, ADRs, or full
  breakdown when a lighter recorded path is honest.
- Agents do not merge, silently decide architecture, silently accept artifacts, or expand scope.
- Improving Agent Workflow Kit is part of the work: identify process weakness when the workflow
  itself is confusing, too heavy, too loose, unsafe, or hard to resume.
- For doc or code changes, `Status = Review` requires a linked PR. Local commits without a PR stay
  `In Progress`; the next action is to open a PR or explain why review is issue-only.
- A PR without recorded agent review must still be classified by task shape before human handoff.
- A linked implementation or general doc/code PR without a recorded agent review result is still
  agent-owned. Route it to `review-local-changes` before human merge approval.
- A linked PR whose selected workflow verb is `review-artifact` should use `review-artifact` as the
  agent review pass for that durable planning artifact; do not add a separate `review-local-changes`
  loop merely because the artifact is proposed through a PR.
- Treat `Review` as a visible acceptance handoff, not mandatory ceremony. Low-risk docs, process, or
  chore PRs with clean validation may move to human-owned merge when the human explicitly approves.
- A fresh issue is not implementation-ready only because it has a goal and acceptance criteria.
  Without a visible grooming result, route to `groom-issue`.
- If issue/comment history leaves meaningful ambiguity about intent, behavior, ownership,
  architecture, acceptance criteria, or validation, route to `groom-issue` or `discover-vision`
  instead of implementation.

## Routing Order

1. Check whether the user named a specific issue, PR, branch, artifact, or work item. If so, route
   that item before scanning broader workflow state.
2. Inspect active PRs before starting new work. An artifact PR whose issue names
   `review-artifact` routes to `review-artifact`; an implementation or general doc/code PR without
   recorded agent review usually routes to `review-local-changes`; a reviewable or revision-needed
   PR usually beats new planning work.
3. If several items are eligible, prefer:
   - review or revision work that unblocks merge,
   - accepted direction ready for breakdown,
   - narrow Ready work,
   - high-value grooming or discovery,
   - stale cleanup only when it blocks the workflow.
4. If no item is actionable, report the blocker and the smallest human decision needed.

## Task Shape Routing

Classify the selected item before choosing a verb:

| Task shape | Route |
| --- | --- |
| New repo, copied kit, missing labels, missing pushed baseline, or no persisted issues | `init-awk` |
| Existing AWK install needs update, repair, or migration | `maintain-awk` |
| Detailed plan already exists | Ensure issue bootstrap exists, then route to `review-artifact`, `breakdown-issue`, or `prepare-implementation`; do not start a blank discovery interview unless acceptance or direction is genuinely missing |
| Vague product, UX, creative, game, platform, or architecture idea | `groom-issue`, then `discover-vision` only when grooming records the missing direction |
| Bug with unclear expected behavior, reproduction, or cause | `groom-issue` or `diagnose-bug` before implementation |
| Bug with clear expected behavior, bounded fix scope, and validation | `prepare-implementation` or `work-issue-local` if the issue already contains a direct-task readiness record and the user authorized implementation |
| Maintenance or refactor | `groom-issue`, `maintain-awk`, or `review-revision-triage` depending on whether the risk is ownership, migration, or PR feedback |
| UI-bearing product work | Require accepted UX direction, or route to `discover-vision` with the UX lens and visual review aids when useful |
| Small direct task | Fast lane with visible `DIRECT_TASK` rationale, one-agent scope, acceptance criteria, validation, and merge risk; skip only the gates that add no useful evidence |
| Artifact PR ready for acceptance or revision routing | `review-artifact` |
| Implementation or general doc/code diff or PR without agent review | `review-local-changes` |

The fast lane reduces ceremony; it does not remove GitHub state, visible readiness, validation, or
review. If any of those are missing and GitHub is available, create or update the issue state before
implementation.

## Workflow Verbs

Route to one of these verbs:

| Situation | Next skill |
| --- | --- |
| Issues, PRs, labels, or repo docs are noisy, stale, or unclear | `triage-backlog` |
| Several items are plausible | `pick-next-item` |
| Issue has no visible grooming result or direct-task rationale | `groom-issue` |
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

Do not recommend `Status = Review` for doc or code changes unless the issue has a linked PR. If the
only evidence is a local commit, keep or recommend `In Progress`, record the commit in the issue,
and make opening a PR the next workflow step.

Do not use GitHub draft state as the default workflow holding pen. Open PRs as ready for review when
the branch is pushed, validation has run, and the PR body records issue linkage and current review
state. Use draft only when work is knowingly incomplete, validation is missing, or the PR is exposing
a WIP diff without asking for attention.

Do not treat PR draft/ready state as proof that the agent review gate is complete. For
implementation or general doc/code PRs, if the issue or PR does not record a completed
`review-local-changes` pass, keep the item agent-owned and make `review-local-changes` the next
workflow verb. For artifact PRs, use `review-artifact` to inspect the proposed durable artifact and
record accept/revise routing.
If review finds architecture ambiguity, ownership drift, public-surface risk, storage risk, or an
unclear long-term model, route to `review-revision-triage` or human architecture review. After agent
review is clean or ordinary findings are fixed/classified, the next human handoff is merge approval,
not permission to continue the agent loop.

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
Merge Risk:
Owner:
Blocker:

## Evidence

## Next action

## Recommended issue or label updates

## Blockers or human decision

## Process feedback
```

When recommending an issue comment or label update, provide the exact Markdown body or labels. Do
not claim they were applied unless you actually apply them with an explicit user request.

Use `Process feedback` to record weaknesses in the workflow itself, such as missing fields, unclear
handoff state, chat-only decisions, unsafe implementation permission, or ceremony that makes the next
step harder to see. Route actionable durable changes through `improve-workflow`.
