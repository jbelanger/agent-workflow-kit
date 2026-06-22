---
name: groom-issue
description: Clarify a vague work item, issue, or idea and decide whether it should become a direct task, bug, refactor, spec, ADR, spike, drop, or defer. Use when the user says "start grooming", "groom this issue", "groom this work item", "make this ready", or "clarify this task".
---

# Groom Issue

You are turning a vague work item, issue, or idea into the next useful planning output. Do not
implement code.

Keep this skill narrow: classify unclear work, identify missing decisions, and prepare the work item
for interactive discovery, durable planning work, or `breakdown-issue`.

## Core Stance

- Grooming classifies unclear work before implementation.
- Grooming produces direction; `breakdown-issue` creates child implementation work items.
- Prefer updating the current work item over creating a parallel planning item.
- Durable project specs, ADRs, spikes, and discovery bundles belong under `docs/development/`.
- AWK workflow references and process decisions belong under `docs/awk/`.
- Repo-local work items under `docs/development/work-items/` are the portable default planning
  record when no external tracker is required.
- GitHub issues and PRs may mirror current planning, discussion, review, and audit trail.
- Recommend work item fields, labels, and board status changes, but do not depend on automatic
  project board transitions.
- Ask one clarification question at a time only for ordinary clarification that can resolve grooming
  itself. Do not conduct a product, UX, creative, game, platform, or architecture vision interview
  inside grooming.
- Give options, a recommendation, and the reason when asking an ordinary clarification question.
- Explain decisions in simple operational terms, assuming the human has not looked at the code
  recently.
- Use a compact table, diagram, or before/after flow when it makes the decision clearer.
- When product, creative direction, interaction design, game feel, information architecture, or
  platform choice is central to the value, route to `discover-vision` instead of compressing the
  idea into a small implementation shape.
- Do product/design research before recommending a vision when current market, genre, platform,
  competitor, or user-expectation evidence would materially change the answer. If the environment
  cannot access needed external evidence, say that and route to a spike or human-supplied sources.

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

For user-facing product, design, or creative work, also answer:

- Who is the intended user or player?
- What should the experience feel like?
- What comparable products, genre conventions, or market expectations matter?
- What is the core loop or primary workflow?
- What must be distinctive enough to justify building it?
- Which platform or technical shape options are credible, and what tradeoff does each create?
- Which decisions are product judgment rather than agent judgment?

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

## Visible Grooming Record

Before implementation, record the grooming result in the issue, a linked planning artifact, or the
implementation brief. Even `DIRECT_TASK` must make the skipped planning visible:

- Why direct implementation is safe.
- Ambiguities, alternatives, architecture concerns, and validation challenges considered.
- Human question asked and answered, or why no human answer was needed.
- Next workflow verb.

If meaningful ambiguity remains, absence of a visible human question is evidence that the work is
still in grooming unless the record explains why that ambiguity does not affect the next slice.

## Interview And Research Mode

Use interview mode when the work is vague and the missing information is product, design, creative,
workflow, architecture, or platform judgment. Grooming does not run that interview; it records that
interactive discovery is needed and hands the item to `discover-vision`.

1. Do not draft a spec, child work item, or implementation brief yet.
2. Record the decision area and, when helpful, a candidate first question for `discover-vision`.
3. Include options, a recommendation, and why the answer changes downstream work only as a handoff
   note, not as a completed interview.
4. Keep the work in `Grooming`.
5. Set `Grooming status: NEEDS_INTERVIEW`.
6. Set the next workflow verb to `discover-vision`.

Use research mode when the next useful answer depends on evidence the agent should gather before
asking the human to decide. In research mode:

1. Name the research question.
2. Name the sources to inspect: code/docs, comparable products, current market or genre references,
   platform/library options, accessibility or usability constraints, operational constraints, or
   prior decisions.
3. Separate evidence from interpretation and recommendation.
4. Set `Grooming status: NEEDS_RESEARCH`.

Use `Grooming status: READY_FOR_DRAFT` only when the next durable artifact can be drafted without
inventing meaningful product behavior, creative direction, architecture, ownership, platform shape,
or acceptance criteria.

Route to `discover-vision` when the work needs an orchestrated product, UX, creative, game,
platform, or architecture vision before a useful spec can exist. Do not run discovery for
`DIRECT_TASK`, `DROP`, or `DEFER`.

## Spec Flow

When the current work item needs a spec:

1. Recommend converting the current work item to `Work Item Type: Spec` by default.
2. Keep the work item in `Grooming` while asking clarification questions.
3. Use `Spec state: Draft` while the behavior or contract is proposed.
4. Once there is enough context to draft durable text and `Grooming status: READY_FOR_DRAFT`,
   recommend the next action as creating or updating a spec document under
   `docs/development/specs/`.
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
- Grooming status: `READY_FOR_DRAFT`, `NEEDS_INTERVIEW`, `NEEDS_RESEARCH`, `NEEDS_DECISION`,
  `DIRECT_TASK`, `DROP`, or `DEFER`.
- Recommended work item type.
- Draft goal.
- Draft non-goals.
- Vision / design analysis, when product or creative direction matters.
- Source evidence needed.
- Acceptance criteria draft.
- Merge risk.
- Human decision needed: `YES` or `NO`, with reason.
- Clarification question, or `None`.
- Recommended work item fields, labels, or status.
- Next action.

## Rules

- Do not create implementation child work items from a draft spec.
- Use `Blocked` only for a real unresolved dependency, missing access, or decision.
- Keep normal clarification in grooming.
- Prefer updating the current work item over creating a parallel planning item.
- If the work item is clear enough for implementation, hand it to `breakdown-issue` so the
  orchestrator can produce merge-safe executable task boundaries before `prepare-implementation`.
- If the work item needs a product, UX, creative, game, platform, or architecture interview, stop
  after recording the grooming handoff and route to `discover-vision`; do not run the interview in
  grooming.

## Test-Drive Feedback

This workflow is being dogfooded. If you notice process friction while using this skill, include a
brief `Process feedback` note in your reply, issue comment, or PR summary. Mention confusing
instructions, missing fields, too much ceremony, unsafe autonomy, merge-safety gaps, or ideas that
would make the workflow easier to use.
