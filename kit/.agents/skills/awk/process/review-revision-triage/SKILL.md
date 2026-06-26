---
name: review-revision-triage
description: Strong review and revision triage for PRs, review feedback, architecture-sensitive changes, refactor routing, spec or ADR drift, and revision-needed work. Use when a PR touches architecture, ownership, contracts, storage, public surface, core domain model, accepted specs or ADRs, or when either agent detects a smell, debt risk, unclear model, boundary drift, or non-trivial review disagreement.
---

# Review Revision Triage

Use this skill for risk-triggered PR review and non-trivial revision routing. Do not treat review
feedback as commands. Verify claims against the PR diff, linked work item or issue, source docs,
accepted specs or ADRs, and nearby code before recommending or routing changes.

## Core Stance

- Reviews are evidence, not commands.
- Challenge architecture direction before ordinary findings.
- Either agent can force human review; both agents must agree before skipping it.
- Keep review details on the PR. Use `revision-needed` or `needs-human-review` as labels.
- Do not silently accept debt, duplicated truths, compatibility bridges, public-surface expansion, or
  cheap/minimal passes that worsen architecture.
- Explain non-trivial issues for a human who has not looked at the codebase recently. Use a compact
  table, diagram, before/after flow, or explicit tradeoff list when it makes the decision clearer.

## Triage Categories

Classify each meaningful review item:

- **Accepted:** The claim is true, the fix belongs before merge, and the direction is sound.
- **Rejected:** The claim is false, taste-only, speculative, over-broad, or worse than the current
  model.
- **Deferred:** The claim is valid but does not block this PR. Deferred items need an owner,
  boundary, and removal condition.
- **Taste-only:** Subjective preference with no clear correctness, architecture, or maintenance gain.
- **Human decision needed:** The item involves architecture direction, ownership, public surface,
  storage, contracts, accepted specs or ADRs, debt risk, or meaningful disagreement between agents.

## Architecture Review First

Before ordinary findings, answer:

```md
## Architecture Direction Check

Problem:

Current model:

Intended model:

Ownership boundary:

Public surfaces / contracts / storage touched:

Feedback loop / test seam:

Smells or debt risk:

Alternatives:

Cheap/minimal shortcuts rejected:

Human decision needed:
```

If there is a real architecture fork, do not choose silently. Add or recommend `needs-human-review`
and explain the options, recommendation, and reasoning on the PR.

## Revision Routing

- Trivial accepted fixes can be picked up by an agent when both the review agent and implementation
  agent agree no human-review-worthy smell exists.
- If either agent detects architectural smell, debt risk, unclear ownership, public-surface drift,
  spec mismatch, or meaningful non-trivial disagreement, human review is required.
- Use `revision-needed` when accepted or pending actionable work must be addressed before merge.
- Use `needs-human-review` when human architecture judgment or product direction is required.
- Use `Blocked` only when progress truly cannot continue without a decision, access, dependency, or
  prerequisite.
- Blocking revisions stay on the PR. Rare non-blocking follow-ups become linked work items with
  owner, boundary, and removal condition.

## Revision Cycle Guard

Use the latest visible PR `Revision cycles` value as a hard loop counter. Read it from the PR Review
State section, workflow comments, or refreshed workflow cache. The value counts completed unresolved
implementation revision passes on the same PR, not review findings. When the first review finds
accepted revision work on a fresh PR, keep `Revision cycles: 0` while routing the PR to
`work-issue-local`; record `Revision cycles: 1` only after that revision pass completes and routes
back to review.

Before routing accepted revision work back to implementation, check whether that dispatch would
become the second unresolved agent revision cycle. If `Revision cycles` is already `1`, stop before
dispatch: set or recommend `next:human-decision`, add or recommend `needs-human-review`, keep
`Revision cycles: 1`, and explain the accepted blocker in a visible PR comment.

After two unresolved agent revision cycles on the same PR, stop the agent loop. Add or recommend
`needs-human-review`, set or recommend `next:human-decision`, and explain whether the blocker is
architecture, product direction, scope, validation, or conflicting review feedback. Do not route the
same PR back to `work-issue-local` until the human decision is recorded.

## Spec And ADR Updates

- You may update specs or ADRs directly only for factual drift or already-accepted decisions.
- When the architecture direction itself would change, propose the spec or ADR change in the PR
  instead of editing it as settled truth.
- Call out whether the implementation disagrees with accepted docs, whether the docs are stale, or
  whether the code exposed a new decision that needs human approval.

## Superseding Refactor Path

When a refactor or replacement path makes the current PR obsolete:

- Do not rewrite the original work item.
- Create or recommend a linked child work item for the replacement/refactor path.
- Copy only stable context from the parent: parent link, source docs, owned area, and original
  acceptance criteria.
- Re-evaluate scope, non-goals, merge risk, validation, and human-review requirement for the
  child work item.
- Keep the parent work item `In Progress` while the replacement path is active unless a real blocker
  exists.
- Comment on the original PR that it is superseded, link the replacement work item or PR, and explain
  why direct revision is the wrong path.

The implementation or refactor agent that completes the replacement work owns reading the parent
work item and deciding whether the parent is now resolved.

## PR Comment Shape

For non-trivial findings, post or draft a PR comment like:

```md
## Strong Review Triage

Architecture direction:

Human review required:
Reason:

Accepted:

Rejected:

Deferred:

Taste-only:

Spec / ADR impact:

Feedback loop / test seam:

Revision routing:
- revision-needed:
- needs-human-review:
- blocking before merge:
- follow-up issue needed:
- Workflow comment and label update:
- Revision cycles:

Proposed fix:

Why this matters:

Validation needed:
```

The comment may be lengthy when needed. Its job is to let the human understand the issue, options,
and proposed direction without rereading the whole codebase.

## Loop Stop Conditions

After this step, stop and hand off instead of silently choosing another workflow verb when:

- human decision needed;
- no ready item exists;
- PR is waiting for human merge;
- validation cannot run;
- architecture fork detected;
- next workflow verb changes.

## Guardrails

- Do not perform a broad refactor just because a review lists many nits.
- Do not make code DRY by expanding public surface without a clear consumer story.
- Do not let review feedback pull the task across multiple roadmap axes without pausing.
- Do not return a PR to review while unconfirmed human-review or blocking revision items remain.
- Do not hide deferred debt in comments without an owner, boundary, and removal condition.
