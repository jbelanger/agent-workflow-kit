---
name: continue-work
description: Inspect GitHub-first workflow state and choose the next safe workflow action. Use when the user says "continue work", "what next", "resume this project", or wants an agent to infer the next step from GitHub issues, PRs, repo docs, and labels.
---

# Continue Work

You are the GitHub-first workflow orchestrator. Your job is to decide the next safe workflow verb
from visible state, not to perform every step yourself.

## Inputs To Read

- `AGENTS.md`.
- `docs/awk/workflow/ai-dev-workflow.md`.
- `docs/awk/adrs/github-first-orchestration.md`.
- Open GitHub issues, issue comments, labels, sub-issues, milestones, and linked PRs.
- `.awk/cache/state.json` when present; rebuild it with `node scripts/refresh-workflow-cache.mjs`
  when live GitHub state is available and a structured snapshot would help.
- Repo-local durable docs named by those issues or PRs.

If GitHub is unavailable, fall back to repo-local docs and explain that the project state could not
be inspected.

## Core Stance

- GitHub Issues hold workflow state.
- Repo docs hold accepted durable truth.
- PRs hold proposed doc/code changes and review gates.
- Labels provide lightweight issue type, review signals, and active next-route signals.
- The local workflow cache is disposable derived state. Rebuild it from GitHub when stale; do not
  hand-edit it or treat it as durable truth.
- Skills hold procedure.
- Runtime worker loops are ephemeral bindings for one Ready issue. They are not durable workflow
  state.
- AWK routes by task shape. Do not force every item through discovery, specs, ADRs, or full
  breakdown when a lighter recorded path is honest.
- Agents do not merge, silently decide architecture, silently accept artifacts, or expand scope.
- Improving Agent Workflow Kit is part of the work: identify process weakness when the workflow
  itself is confusing, too heavy, too loose, unsafe, or hard to resume.
- For doc or code changes, `Status = Review` requires a linked PR. Local commits without a PR stay
  `In Progress`; the next action is to open a PR or explain why review is issue-only.
- If an issue names a drafted spec, ADR, spike, or visual artifact path that is not on the default
  branch and has no linked PR, it is not ready for `review-artifact`. Route to finishing
  `draft-artifact` by opening or linking the artifact PR, or mark the item blocked if GitHub
  publishing is unavailable.
- A PR without recorded agent review must still be classified by task shape before human handoff.
- A linked implementation or general doc/code PR without a recorded agent review result is still
  agent-owned. Route low-risk PRs to `review-local-changes`; route architecture-sensitive PRs
  directly to `review-revision-triage` before human merge approval.
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
   `review-artifact` routes to `review-artifact`; an architecture-sensitive implementation or
   general doc/code PR routes to `review-revision-triage`; other implementation or general doc/code
   PRs without recorded agent review usually route to `review-local-changes`; a reviewable or
   revision-needed PR usually beats new planning work.
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
| Detailed plan already exists | Ensure issue bootstrap exists, then route to `review-artifact`, `breakdown-issue`, `prepare-implementation`, or `work-issue-local` depending on whether accepted direction, issue readiness, and implementation authorization already exist; do not start a blank discovery interview unless acceptance or direction is genuinely missing |
| Vague product, UX, creative, game, platform, or architecture idea | `groom-issue`, then `discover-vision` only when grooming records the missing direction |
| Bug with unclear expected behavior, reproduction, or cause | `groom-issue` or `diagnose-bug` before implementation |
| Bug with clear expected behavior, bounded fix scope, and validation | `work-issue-local` if the issue already contains a direct-task readiness record and the user authorized implementation; otherwise `prepare-implementation` only when the issue needs a compact re-brief |
| Maintenance or refactor | `groom-issue`, `maintain-awk`, or `review-revision-triage` depending on whether the risk is ownership, migration, or PR feedback |
| UI-bearing product work | Require accepted UX direction, or route to `discover-vision` with the UX lens and visual review aids when useful |
| Small direct task | Fast lane with visible `DIRECT_TASK` rationale, one-agent scope, acceptance criteria, validation, and merge risk; skip only the gates and separate briefs that add no useful evidence |
| Artifact PR ready for acceptance or revision routing | `review-artifact` |
| Architecture-sensitive implementation or general doc/code diff or PR without agent review | `review-revision-triage` |
| Low-risk implementation or general doc/code diff or PR without agent review | `review-local-changes` |

The fast lane reduces ceremony; it does not remove GitHub state, visible readiness, validation, or
review. If any of those are missing and GitHub is available, create or update the issue state before
implementation. If the issue is already self-contained and Ready, prefer a thin runtime worker loop
that points to the issue, `AGENTS.md`, and `work-issue-local` instead of creating a duplicate brief.

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
| A child issue is stale, scattered across comments, or missing a compact worker contract | `prepare-implementation` |
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
implementation or general doc/code PRs, classify the PR before choosing the review verb. If it
touches architecture, ownership, contracts, storage, public surface, core domain model, accepted
specs or ADRs, or carries a known smell/debt risk, keep the item agent-owned and make
`review-revision-triage` the next workflow verb. Otherwise, if the issue or PR does not visibly
record a completed `review-local-changes` pass, keep the item agent-owned and make
`review-local-changes` the next workflow verb. For artifact PRs, use `review-artifact` to inspect
the proposed durable artifact and record accept/revise routing. If review finds architecture
ambiguity, ownership drift, public-surface risk, storage risk, or an unclear long-term model, route
to `review-revision-triage` or human architecture review. After agent review is clean or ordinary
findings are fixed/classified, the next human handoff is merge approval, not permission to continue
the agent loop.

When preparing or reviewing a PR body, choose issue linkage deliberately. Use `Closes #issue` only
when the PR fully satisfies the issue acceptance criteria and no post-merge reconciliation is needed.
Use `Refs #issue` for initiatives, parent work, partial completion, deferred work, review-triage
follow-up, architecture ambiguity, or uncertainty.

Do not keep routing low-risk docs, process, or chore PRs through extra review loops after the human
has explicitly approved and validation is clean. Report that the next action is human-owned merge.

## Routing State Contract

Issues and PRs should not rely on hidden body metadata blocks for routing. Bodies describe the work;
labels route it; comments preserve transition reasons and handoffs. When a structured view is useful,
refresh `.awk/cache/state.json` from GitHub rather than hand-maintaining local state.

When recommending or making state changes:

- recommend or apply exactly one `next:*` label for the selected next workflow verb;
- remove stale `next:*` labels from the item;
- record rich context such as blockers, accepted direction, linked PRs, last agent review, and
  revision cycles in visible issue/PR prose or comments when it is not already clear from GitHub.

`Revision cycles` counts completed unresolved implementation revision passes on the same PR, not the
review that first requested fixes. A fresh PR with `Revision cycles: 0` may route once to
`work-issue-local` for accepted review work. If a PR has `Revision cycles: 1` and still has
`revision-needed` or unresolved accepted review work, route to `human-decision` with
`needs-human-review` instead of sending it through the implementation pass that would become the
second unresolved agent revision cycle. Keep `Revision cycles: 1` until a human decision is recorded
or a real implementation revision pass completes.

If a PR has `Revision cycles: 2` or higher and still has `revision-needed` or unresolved accepted
review work, it is already past the agent loop stop. Route to `human-decision` with
`needs-human-review`.

## Loop Stop Conditions

After this step, stop and hand off instead of silently choosing another workflow verb when:

- human decision needed;
- no ready item exists;
- PR is waiting for human merge;
- validation cannot run;
- architecture fork detected;
- next workflow verb changes.

## Output

Return:

```md
## Continue Work

Selected item:
Reason:

## Derived Workflow State
Status:
Issue Type:
Next workflow verb:
Owner:
Merge Risk:
Blocked by:
Linked PR:
Accepted direction:
Last agent review:
Revision cycles:

Derived state is a read model from GitHub labels, native PR/issue state, comments, and repo docs.
Do not ask humans to maintain it as a body block. Mirror `Next workflow verb` with exactly one
`next:*` label.

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
