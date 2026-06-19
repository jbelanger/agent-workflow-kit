---
name: review-revision-triage
description: Strong review and revision triage for PRs, review feedback, architecture-sensitive changes, refactor routing, spec or ADR drift, and revision-needed work. Use when a PR touches architecture, ownership, contracts, storage, public surface, core domain model, accepted specs or ADRs, or when either agent detects a smell, debt risk, unclear model, boundary drift, or non-trivial review disagreement.
---

# Review Revision Triage

Use this skill for risk-triggered PR review and non-trivial revision routing. Do not treat review
feedback as commands. Verify claims against the PR diff, linked issue, source docs, accepted specs or
ADRs, and nearby code before recommending or routing changes.

## Core Stance

- Reviews are evidence, not commands.
- Challenge architecture direction before ordinary findings.
- Either agent can force human review; both agents must agree before skipping it.
- Keep review details on the PR. Use `revision-needed` or `needs-human-review` as labels or field
  signals, not as required board statuses.
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
- Blocking revisions stay on the PR. Rare non-blocking follow-ups become linked issues with owner,
  boundary, and removal condition.

## Spec And ADR Updates

- You may update specs or ADRs directly only for factual drift or already-accepted decisions.
- When the architecture direction itself would change, propose the spec or ADR change in the PR
  instead of editing it as settled truth.
- Call out whether the implementation disagrees with accepted docs, whether the docs are stale, or
  whether the code exposed a new decision that needs human approval.

## Superseding Refactor Path

When a refactor or replacement path makes the current PR obsolete:

- Do not rewrite the original issue.
- Create or recommend a linked sub-issue for the replacement/refactor path.
- Copy only stable context from the parent: parent link, source docs, owned area, and original
  acceptance criteria.
- Re-evaluate scope, non-goals, merge risk, validation, and human-review requirement for the
  sub-issue.
- Keep the parent issue `In Progress` while the replacement path is active unless a real blocker
  exists.
- Comment on the original PR that it is superseded, link the replacement issue or PR, and explain
  why direct revision is the wrong path.

The implementation or refactor agent that completes the replacement work owns reading the parent
issue and deciding whether the parent is now resolved.

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

Proposed fix:

Why this matters:

Validation needed:
```

The comment may be lengthy when needed. Its job is to let the human understand the issue, options,
and proposed direction without rereading the whole codebase.

## Guardrails

- Do not perform a broad refactor just because a review lists many nits.
- Do not make code DRY by expanding public surface without a clear consumer story.
- Do not let review feedback pull the task across multiple roadmap axes without pausing.
- Do not return a PR to review while unconfirmed human-review or blocking revision items remain.
- Do not hide deferred debt in comments without an owner, boundary, and removal condition.

## Test-Drive Feedback

This workflow is being dogfooded. If you notice process friction while using this skill, include a
brief `Process feedback` note in your reply, issue comment, or PR summary. Mention confusing
instructions, missing fields, too much ceremony, unsafe autonomy, merge-safety gaps, or ideas that
would make the workflow easier to use.
