---
name: triage-finding
description: Classify and route material findings from any skill, PR, harness, spike, playtest, review, or implementation pass. Use when evidence may change product/design direction, architecture, validation targets, scope, accepted artifacts, readiness, or whether current work should continue.
---

# Triage Finding

You are classifying a finding before the workflow keeps moving. A finding is evidence, not a command.
Do not implement, tune, rewrite accepted artifacts, decide product direction, or decide architecture.

## Core Stance

- Preserve momentum by separating routine notes from findings that need thinking.
- Treat material findings as stop-and-route events.
- Record the finding where the next agent or human will actually resume.
- Name the owner of the next thinking step.
- Keep exactly one durable `next:*` route on the active issue or PR when labels are available.
- Advisory or domain skills can be named in the comment, but the durable `next:*` label should point
  to the owning AWK verb such as `discover-vision`, `review-revision-triage`, `groom-issue`,
  `draft-artifact`, or `human-decision`.

## Inputs To Read

- The raw finding: logs, test output, harness report, review note, playtest note, issue comment, PR
  diff, or agent summary.
- The active issue or PR and its current `next:*` route.
- The work item's visible grooming record, accepted spec, ADR, discovery note, spike result, or
  implementation re-brief.
- Relevant repo docs under `docs/development/`.
- `AGENTS.md` and `docs/awk/workflow/ai-dev-workflow.md` when routing is unclear.
- `.agents/advisory-experts.md` when present.
- Project-specific domain or advisory skills when the finding is in their domain.

## Classify The Finding

Use the smallest classification that is honest:

- **Routine note:** Useful detail, but it does not change direction, readiness, validation, scope,
  architecture, accepted artifacts, or the next route.
- **Material finding:** Evidence may change an assumption, readiness, validation target, artifact,
  scope boundary, design direction, or architecture direction.
- **Real fork:** The finding exposes a product, design, architecture, ownership, public-surface,
  storage, validation, or scope choice that an agent must not decide.
- **Needs evidence:** The claim might matter, but current evidence is too thin or unverified.
- **Invalid / rejected:** The claim is false, already handled, taste-only, or contradicted by the
  accepted source of truth.
- **Process feedback:** The finding is about AWK procedure, routing, templates, labels, or agent
  behavior rather than the project work itself.

## Route By Owner

- Product, UX, creative, game-design, platform, or validation findings: route to `discover-vision`,
  a named advisory/domain skill when available, `draft-artifact`, `review-artifact`, a spike, or
  `human-decision`.
- Architecture, ownership, contract, storage, public-surface, migration, core-model, or accepted-ADR
  findings: route to `review-revision-triage`, ADR/spec work, or `human-decision`.
- Scope, readiness, acceptance criteria, merge-risk, or task-boundary findings: route to
  `groom-issue`, `breakdown-issue`, `prepare-implementation`, or `human-decision`.
- Reproducible behavior failures with clear expected behavior: route to `diagnose-bug` or
  `work-issue-local` only after readiness still holds and the user authorizes implementation.
- Workflow or agent-process findings: route to `improve-workflow`.
- Thin or questionable evidence: route to a spike or ask for the missing source before changing
  direction.

## Where To Record It

Use the most active durable surface:

- If the finding came from an active PR, record it in the PR Review State or a PR workflow comment,
  then mirror the route on the linked issue while the work remains agent-owned.
- If the finding came from an issue, grooming pass, harness run without a PR, or local worker loop,
  record it as an issue comment.
- If the finding changes a proposed artifact, record it on the artifact PR or review thread.
- If it may change an accepted artifact, record it on the active issue first; only update the
  artifact through `draft-artifact`, `review-artifact`, ADR/spec revision, or human decision.
- If GitHub is unavailable, record it in the repo-local work item or provide exact text to add when
  GitHub is available. Do not leave material findings only in runtime chat or local logs.

If you cannot mutate GitHub, return the exact comment body and label changes. Do not claim they were
applied.

## Workflow Comment Shape

```md
## Finding triage

Source:

Evidence:

Interpretation:

Classification: Routine note | Material finding | Real fork | Needs evidence | Invalid / rejected | Process feedback

May change:

Owner:

Recommended route:

Advisory/domain skill, if useful:

Label update:

Continue rule:
```

`Continue rule` must say one of:

- Continue current work; record as routine context.
- Stop current work until the named route runs.
- Stop for human decision.
- Gather evidence first.

## Loop Stop Conditions

After this step, stop and hand off instead of silently choosing another workflow verb when:

- human decision needed;
- no ready item exists;
- PR is waiting for human merge;
- validation cannot run;
- architecture fork detected;
- material finding requires product/design, architecture, validation, scope, or artifact judgment;
- next workflow verb changes.

## Output

Return:

- Finding classification.
- Evidence summary.
- Assumption, artifact, validation target, scope, or boundary that may change.
- Owner of the next thinking step.
- Recommended workflow comment.
- Recommended `next:*` label update and stale labels to remove.
- Advisory/domain skill to use, if any.
- Continue rule.
- Human decision needed: `YES` or `NO`, with reason.
