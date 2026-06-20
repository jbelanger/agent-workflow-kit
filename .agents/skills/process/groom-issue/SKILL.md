---
name: groom-issue
description: Clarify a vague work item, issue, or idea and decide whether it should become a direct task, bug, refactor, spec, ADR, spike, drop, or defer. Use when the user says "start grooming", "groom this issue", "groom this work item", "make this ready", or "clarify this task".
---

# Groom Issue

You are turning a vague work item, issue, or idea into the next useful planning output. Do not
implement code.

Keep this skill narrow: classify unclear work, ask for missing decisions, and prepare the work item
for durable planning work or `breakdown-issue`.

## Core Stance

- Grooming classifies unclear work before implementation.
- Grooming produces direction; `breakdown-issue` creates child implementation work items.
- Prefer updating the current work item over creating a parallel planning item.
- Durable specs, ADRs, spikes, and workflow guidance belong under `docs/development/`.
- Repo-local work items under `docs/development/work-items/` are the portable default planning
  record when no external tracker is required.
- GitHub issues and PRs may mirror current planning, discussion, review, and audit trail.
- Recommend work item fields, labels, and board status changes, but do not depend on automatic
  project board transitions.
- Ask one clarification question at a time.
- Give options, a recommendation, and the reason.
- Explain decisions in simple operational terms, assuming the human has not looked at the code
  recently.
- Use a compact table, diagram, or before/after flow when it makes the decision clearer.

## First Classify The Work Item

Choose the smallest useful output:

- **Direct task:** The work is clear, bounded, testable, and does not need behavior, contract, or
  architecture clarification. Use work item type `Task`.
- **Bug:** Actual behavior differs from expected behavior.
- **Refactor:** The goal is behavior-preserving structural improvement.
- **Spec:** Behavior, contracts, records, user-visible semantics, or acceptance criteria need to be
  settled before implementation.
- **ADR:** Architecture direction, ownership, storage, public surface, or operating policy needs a
  durable decision.
- **Spike:** Evidence is missing and production work would otherwise guess.
- **Drop:** The work should not be done.
- **Defer:** The work may be valid but should not move now.

## Required Analysis

Answer:

- What problem are we solving operationally?
- What is already true?
- What is missing?
- What source docs or code are authoritative?
- What is explicitly out of scope?
- What ownership boundary is involved?
- What architecture risks exist?
- Is this parallel-safe, needs coordination, or serial only?

## Clarification Behavior

Ask at most one clarification question at a time.

Each question must include:

- The question.
- Options.
- Recommended answer.
- Why it matters.

Use this shape when asking:

```md
Question:

Options:
1. ...
2. ...
3. ...

Recommendation:

Why:
```

## Spec Flow

When the current work item needs a spec:

1. Recommend converting the current work item to `Work Item Type: Spec` by default.
2. Keep the work item in `Grooming` while asking clarification questions.
3. Use `Spec state: Draft` while the behavior or contract is proposed.
4. Once there is enough context to draft durable text, recommend the next action as creating or
   updating a spec document under `docs/development/specs/`.
5. The spec PR owns review of the durable text.
6. After human acceptance, ensure the spec document says `Spec state: Accepted`.
7. If implementation work remains, send the accepted work item to `breakdown-issue`; if the spec
   itself was the deliverable, recommend `Complete`.

Do not create implementation child work items from a draft spec.

## Spec State

- `Draft`: proposed behavior or contract; not authoritative for autonomous implementation.
- `Accepted`: human-approved target for implementation.
- `Implemented`: merged code matches the accepted spec.
- `Superseded`: a newer spec or ADR replaced this one.

## Draft Spec Shape

```md
# Problem

# Current understanding

# Clarification questions

# Spec state
Draft

# Proposed behavior / contract

# Non-goals

# Source evidence

# Architecture / ownership implications

# Acceptance criteria for the spec

# Breakdown notes, after accepted
```

## Output

Return:

- Current understanding.
- Recommended work item type.
- Draft goal.
- Draft non-goals.
- Source evidence needed.
- Acceptance criteria draft.
- Merge risk.
- Recommended work item fields, labels, or status.
- Next action.

## Rules

- Do not create implementation child work items from a draft spec.
- Use `Blocked` only for a real unresolved dependency, missing access, or decision.
- Keep normal clarification in grooming.
- Prefer updating the current work item over creating a parallel planning item.
- If the work item is clear enough for implementation, hand it to `breakdown-issue` so the
  orchestrator can produce merge-safe executable task boundaries before `prepare-implementation`.

## Test-Drive Feedback

This workflow is being dogfooded. If you notice process friction while using this skill, include a
brief `Process feedback` note in your reply, issue comment, or PR summary. Mention confusing
instructions, missing fields, too much ceremony, unsafe autonomy, merge-safety gaps, or ideas that
would make the workflow easier to use.
