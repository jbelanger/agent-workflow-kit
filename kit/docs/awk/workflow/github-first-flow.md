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
| GitHub Issue | Work item, discussion, human answers, visible grooming result, process feedback, source links, and routing labels. | Accepted durable specs or architecture truth by itself. |
| GitHub PR | Proposed repo doc or code change, review discussion, validation summary, issue linkage, native merge state, and routing labels. | Autonomous merge or hidden acceptance. |
| GitHub labels | Lightweight issue type, review signals, and the active `next:*` routing label. | Acceptance evidence or rich context by themselves. |
| `docs/development/` | Accepted durable truth after review: vision, specs, ADRs, spikes, workflow docs, and source evidence. | Raw scratch planning. |
| `.agents/skills/awk/` | Workflow procedure. | Project-specific accepted direction. |
| `.awk/cache/state.json` | Rebuildable local snapshot of GitHub issues, PRs, labels, comments, and derived routing facts for agents. | Durable truth, human-facing state, or anything that must survive regeneration. |
| Runtime worker loop | Active execution binding for one Ready issue. | Durable queue state, accepted direction, review evidence, or issue/PR replacement. |

## Routing Labels And Cache

Each active issue or PR should carry exactly one `next:*` label. Active means an open issue or open
PR. Merged and closed PRs are terminal for routing; their leftover `next:*` labels are archival and
must be ignored by `continue-work` and the cache. Issue type labels such as `spec`, `task`, `adr`,
and review labels such as `revision-needed` or `needs-human-review` provide additional routing
signals.

When a PR is the active work surface, it should carry its own `next:*` label. Mirror that route on
the linked active issue while the work remains agent-owned; if the issue and PR intentionally differ,
record the reason in a visible workflow comment.

After implementation opens or updates a PR, the PR becomes the active review surface. The worker must
verify the PR's own `next:*` label and visible review-state/comment before final handoff; updating
only the linked issue is incomplete.

AWK does not read hidden or constantly edited body metadata for routing. Bodies should stay readable
and describe the work. Workflow transitions should be recorded as ordinary issue or PR comments when
extra context is needed, and labels should be updated for routing.

Agents may rebuild a local cache when structured state helps:

```bash
node scripts/refresh-workflow-cache.mjs --repo owner/name
```

The generated `.awk/cache/state.json` is ignored by git and disposable. It summarizes GitHub-native
state plus derived facts such as next routing labels, type labels, review labels, linked PR/issue
numbers, merge state, and recent workflow comments. If it is stale, rebuild it; do not patch it by
hand.

For merged or closed PRs, the cache preserves raw labels for audit but reports no effective
`nextVerb`; post-merge routing belongs on the linked issue. Humans do not need to remove
`next:human-merge` after merging.

When a skill changes routing, it should recommend or apply label changes and, when useful, add a
short workflow comment with the reason, blocker, accepted direction, or handoff. Rich context belongs
in visible prose, not in a duplicated metadata block.

When a skill surfaces a material finding, GitHub should carry it as ordinary issue/PR prose before
the agent continues. Record the evidence, the assumption or artifact it may change, the owner of the
thinking step, and the recommended next route. Use `triage-finding` when the finding's implication,
owner, recording location, or next route is not obvious. Do not leave important findings only in
runtime chat or local logs.

Advisory experts are named in comments, not represented as `next:*` labels. The durable route should
remain an AWK verb such as `triage-finding`, `discover-vision`, `review-revision-triage`, or
`human-decision`; the comment may name the advisory expert to consult.

## Review Handoff Rule

For doc or code changes, `Status = Review` requires a linked GitHub PR that exposes the diff. Local
commits without a PR stay `In Progress`; the issue comment should record the commit and make opening
a PR the next action.

GitHub draft state is not the default workflow holding pen. Open PRs as ready for review when the
branch is pushed, validation has run, and the PR body records issue linkage and current review state.
Use draft only when work is knowingly incomplete, validation is missing, or the PR is exposing a WIP
diff without asking for attention.

Do not treat PR draft/ready state as proof that the completed agent review pass exists. Until the
issue or PR records that pass, keep implementation and general doc/code work agent-owned and
classify the PR before choosing the review verb. Route low-risk PRs to `review-local-changes`; route
architecture-sensitive PRs, including PRs touching contracts, storage, public surface, core domain
model, shared application state, first framework/toolchain setup, accepted specs, accepted UX
direction, or ADRs, to `review-revision-triage`. Route durable artifact PRs to
`review-artifact`; that skill is the agent review pass for artifact acceptance or revision routing.
If review finds architecture ambiguity, ownership drift, public-surface risk, storage risk, or an
unclear long-term model, route to human architecture judgment before merge approval.

`Review` is a visible acceptance handoff, not mandatory heavyweight ceremony. For low-risk docs,
process, or chore changes, clean validation plus explicit human approval is enough to move to the
human-owned merge step.

Use `Revision cycles` as a hard stop for repeated agent review loops. Record the count in the PR
Review State section or a visible workflow comment, and let the cache extract the latest value.
The count is completed unresolved implementation revision passes on the same PR, not review
findings. Keep `Revision cycles: 0` while sending a fresh PR to its first accepted revision pass;
record `Revision cycles: 1` only after that revision pass completes and routes back to review. After
two unresolved agent revision cycles, add or recommend `needs-human-review`, set or recommend the
`next:human-decision` label, and stop the agent loop until the human decision is recorded.
When a PR is already at `Revision cycles: 1` and accepted blocking revision work remains, stop
before dispatching the implementation pass that would become the second unresolved cycle. Keep
`Revision cycles: 1`, route to `human-decision`, and record the accepted blocker in a visible
comment.

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

If a planning step just changed the next route to `work-issue-local`, stop after recording that
handoff. A human selecting a route or slice during grooming is choosing durable routing state, not
authorizing implementation in the same uninterrupted worker loop.

## Loop Stop Conditions

After each workflow verb, stop and hand off instead of silently continuing when:

- human decision needed;
- no ready item exists;
- PR is waiting for human merge;
- validation cannot run;
- architecture fork detected;
- material finding requires product/design, architecture, validation, scope, or artifact judgment;
- next workflow verb changes.

## Process Feedback

Record workflow friction in the issue comment or PR summary where it was observed. Route durable
changes through `improve-workflow` when the feedback is actionable.
