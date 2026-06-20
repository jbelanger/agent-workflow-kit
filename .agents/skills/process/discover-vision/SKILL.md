---
name: discover-vision
description: Orchestrate early discovery for vague product, UX, creative, game, platform, or architecture direction before specs or breakdown. Use when grooming returns NEEDS_INTERVIEW, NEEDS_RESEARCH, or NEEDS_DECISION for product/design vision work, when the user asks to discover or refine a vision, or when a vague idea needs specialist lenses before a durable spec.
---

# Discover Vision

You are the PM/PO-style discovery orchestrator. Concentrate human interaction here, before
specification and implementation. Do not implement code, create child work items, or mark a vision
accepted without explicit human acceptance.

## Core Stance

- Discovery decides what we are making and why, not every detail of how it works.
- Specialists are advisory lenses. They do not create accepted truth and do not ask the human
  directly.
- Ask the human exactly one highest-leverage question at a time.
- Prefer a small accepted vision over a large speculative spec.
- After the vision is accepted, later workflow stages should interrupt only for real forks.

## Inputs To Read

- `AGENTS.md` and `docs/development/workflow/ai-dev-workflow.md`.
- The grooming artifact, work item, issue, prompt, or prior discovery bundle.
- Existing specs, ADRs, spikes, research notes, or source docs named by the work item.
- Relevant specialist skills only after selecting the needed lenses.

## Lens Selection

Select lenses from `.agents/skills/specialist/`. Record which lenses were used and why.

Default lenses for vague product or platform work:

- `product-strategy`: user, value, market/genre expectations, differentiation.
- `technical-architecture`: feasible platform/system shape and architectural forks.
- `validation-strategy`: evidence, tests, playtests, and acceptance proof.

Conditional lenses:

- `ux-direction`: use when flows, interaction model, information architecture, accessibility, or
  usability are central to success.
- `creative-direction`: use when brand, tone, game design, emotional target, content, visual/audio
  direction, or memorability are central to success.

Rules:

- Use at most five lenses.
- Do not run discovery for `DIRECT_TASK`, `DROP`, or `DEFER`.
- Do not force UX or creative lenses onto purely backend, CLI, data, or maintenance work.
- If current market, library, genre, competitor, legal, or standards evidence would materially
  change direction and you cannot access it, route to research or request human-supplied sources.

## Discovery Stages

Use progressive elaboration:

| Stage | Goal | Allowed output | Not allowed |
| --- | --- | --- | --- |
| `L0 Discovery` | Understand the vague idea and identify lenses, risks, and first question. | Intake, lens selection, open decision map, one question. | Spec, child tasks, implementation details. |
| `L1 Direction` | Choose a high-level product and architecture direction. | Vision brief, decision log, research notes if needed. | Detailed behavior spec or breakdown. |
| `L2 Spec` | Define behavior or contracts for accepted direction. | Route to `draft-artifact`. | Reopening vision silently. |
| `L3 Breakdown` | Split accepted spec into executable work. | Route to `breakdown-issue`. | New product decisions. |
| `L4 Implementation` | Build one ready item. | Route to implementation workflow. | Scope expansion. |

Use an iteration cap for L0/L1: after three unanswered or unresolved rounds, recommend
`NEEDS_DECISION`, `NEEDS_RESEARCH`, `DEFER`, or human-led workshop instead of continuing to ask.

## Real Forks

A real fork is a decision that would invalidate or materially change accepted direction. Stop for a
human decision when a choice affects:

- Target user, product promise, or emotional/creative target.
- Core loop or primary workflow.
- Platform, architecture ownership, storage, public surface, or build/runtime model.
- Scope boundary or non-goals.
- Acceptance evidence or validation strategy.

Do not stop for ordinary implementation details that fit the accepted vision.

## Artifacts

Write or update a discovery bundle only when the user asked to create durable discovery artifacts or
the workflow adapter requires it. Use:

```text
docs/development/discovery/<slug>/
  00-intake.md
  vision-brief.md
  decision-log.md
  research-notes.md   # only when research exists
```

`00-intake.md`:

```md
# <Title> Intake

Status: Discovery

## Source
## Current understanding
## Constraints
## Non-goals
## Selected lenses
## First open decisions
```

`vision-brief.md`:

```md
# <Title> Vision Brief

Vision state: Draft

## Source
## Target user / audience
## Problem / opportunity
## Experience pillars
## Core loop or primary workflow
## Product and creative direction
## Technical direction
## Validation direction
## Non-goals
## Open questions
## Acceptance criteria for the vision
## Next workflow step after acceptance
```

`decision-log.md`:

```md
# <Title> Decision Log

## Resolved decisions
## Open decisions
## Deferred decisions
## Real forks
## Human decision history
```

`research-notes.md`:

```md
# <Title> Research Notes

## Research questions
## Sources inspected
## Evidence
## Interpretation
## Impact on readiness
```

Avoid permanent specialist transcript files by default. Summarize specialist findings in the vision
brief and decision log. Preserve raw specialist notes only when the human asks or the evidence is
too important to compress safely.

## Output

Return:

```md
## Discovery route
Stage:
Status: READY_FOR_VISION | NEEDS_INTERVIEW | NEEDS_RESEARCH | NEEDS_DECISION | READY_FOR_SPEC | DIRECT_TASK | DROP | DEFER
Selected lenses:
Skipped lenses:

## Synthesis

## Decision map

## Human question
Question:
Options:
1.
2.
3.
Recommendation:
Why:

## Artifacts

## Next workflow step

## Process feedback
```

Use `READY_FOR_SPEC` only after the vision is accepted or the human explicitly supplies enough
direction for a spec. Otherwise ask one question, route to research, or record the blocking decision.
