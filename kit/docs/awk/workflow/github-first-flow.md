# GitHub-First Workflow Surface

Status: draft

This companion explains how GitHub carries AWK state. The canonical operating loop is in
`docs/awk/workflow/ai-dev-workflow.md`; the accepted boundary decision is in
`docs/awk/adrs/github-first-orchestration.md`.

AWK is still one loop:

```text
Intake -> Shape -> Execute -> Review -> Improve
```

GitHub issues, PRs, labels, and repo docs are the durable coordination surface for that loop.
GitHub is not a runtime platform, and AWK does not use external tracker fields as workflow state.
Runtime worker loops such as a Codex goal, headless prompt, local script, or human working session
consume GitHub state; they do not replace it.

## Product Promise

```text
Human leaves the keyboard
  -> answers a question or approves direction in GitHub
  -> later asks an agent to continue work
  -> the agent reads GitHub issues, PRs, repo docs, and labels
  -> the agent knows the next safe workflow step
```

## Surfaces

| Surface | Owns | Does not own |
| --- | --- | --- |
| GitHub Issue | Work item, discussion, human answers, visible grooming result, process feedback, and source links. | Accepted durable specs or architecture truth by itself. |
| GitHub PR | Proposed repo doc or code change, review discussion, validation summary, and issue linkage. | Autonomous merge or hidden acceptance. |
| GitHub labels | Lightweight issue type, review signals, and the active `next:*` routing label. | Acceptance evidence or rich context by themselves. |
| `docs/development/` | Accepted durable truth after review: vision, specs, ADRs, spikes, workflow docs, and source evidence. | Raw scratch planning. |
| `.agents/skills/awk/` | Workflow procedure. | Project-specific accepted direction. |
| Runtime worker loop | Active execution binding for one Ready issue. | Durable queue state, accepted direction, review evidence, or issue/PR replacement. |

## AWK State Block

Every issue and PR should carry one canonical state block:

```md
<!-- awk-state:start -->
## AWK State
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
<!-- awk-state:end -->
```

Use this block for human-readable state and rich context. Use exactly one `next:*` label for the
machine-readable routing signal when labels are available. When a skill changes routing, it should
replace this block or recommend the exact replacement, then add the new `next:*` label and remove
stale `next:*` labels.

`Status`, `Blocked by`, `Accepted direction`, `Linked PR`, `Last agent review`, and
`Revision cycles` belong in the block because they carry explanation. Do not spread those fields
across competing comments unless the comment contains a replacement block.

## Review Handoff Rule

For doc or code changes, `Status = Review` requires a linked GitHub PR that exposes the diff. Local
commits without a PR stay `In Progress`; the issue comment should record the commit and make opening
a PR the next action.

GitHub draft state is not the default workflow holding pen. Open PRs as ready for review when the
branch is pushed, validation has run, and the PR body records issue linkage and current review state.
Use draft only when work is knowingly incomplete, validation is missing, or the PR is exposing a WIP
diff without asking for attention.

Do not treat PR draft/ready state as proof that the completed agent review pass exists. Until the
issue or PR records that pass, keep implementation and general doc/code work agent-owned, then route
to `review-local-changes`. Route durable artifact PRs to `review-artifact`; that skill is the agent
review pass for artifact acceptance or revision routing.
If review finds architecture ambiguity, ownership drift, public-surface risk, storage risk, or an
unclear long-term model, route to human architecture judgment before merge approval.

`Review` is a visible acceptance handoff, not mandatory heavyweight ceremony. For low-risk docs,
process, or chore changes, clean validation plus explicit human approval is enough to move to the
human-owned merge step.

Use `Revision cycles` as a hard stop for repeated agent review loops. Increment it when the same PR
is routed from agent review back to implementation. After two unresolved agent revision cycles, add
or recommend `needs-human-review`, set `Next workflow verb: human-decision`, and stop the agent loop
until the human decision is recorded.

## Issue Linkage Rule

PR bodies should use GitHub closing keywords only when the PR can close the work item by itself.
Use `Closes #issue` when the PR fully satisfies the issue acceptance criteria and needs no
post-merge reconciliation. Use `Refs #issue` for initiatives, parent work, partial completion,
deferred work, review-triage follow-up, architecture ambiguity, or uncertainty.

## Continue-Work Entry Point

Use `continue-work` when the human asks to resume from GitHub state. It reads open PRs, issues,
comments, repo docs, and labels, then chooses one next workflow verb.
`continue-work` owns the detailed task-shape routing table; this document should not duplicate it.

Implementation still requires issue state, a visible grooming result or `DIRECT_TASK` rationale,
clear acceptance criteria, validation, merge-risk classification, and explicit user authorization
for the current turn. A self-contained Ready issue can route directly to `work-issue-local`; use
`prepare-implementation` only when a stale or scattered issue needs a compact re-brief before a
fresh worker loop starts.

## Loop Stop Conditions

After each workflow verb, stop and hand off instead of silently continuing when:

- human decision needed;
- no ready item exists;
- PR is waiting for human merge;
- validation cannot run;
- architecture fork detected;
- next workflow verb changes.

## Process Feedback

Record workflow friction in the issue comment or PR summary where it was observed. Route durable
changes through `improve-workflow` when the feedback is actionable.
