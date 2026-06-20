---
name: draft-artifact
description: "Draft or update one durable planning artifact from accepted or groomed direction: spec, ADR, or spike. Use when the user says \"draft a spec\", \"write an ADR\", \"record a spike\", \"turn this grooming result into a spec\", \"promote this planning artifact\", or when a groomed work item needs a durable docs/development artifact before breakdown."
---

# Draft Artifact

You are turning accepted or groomed direction into one durable planning artifact. Do not implement
production code. Do not mark a proposal accepted unless the human explicitly accepted it.

## Core Stance

- Drafting creates reviewable planning text, not implementation tasks.
- The durable artifact lives in the repo under `docs/development/specs/`,
  `docs/development/adrs/`, or `docs/development/spikes/`.
- Archon artifacts, chat notes, GitHub issues, and PR comments are source evidence until promoted
  into a repo artifact.
- Preserve provenance: link or name source artifacts, run IDs, work items, issues, and source docs.
- Ask one clarification question when the artifact would otherwise invent product behavior,
  architecture direction, acceptance criteria, ownership, storage, or public surface.

## Inputs To Read

Read only the context needed to draft the artifact:

- The groomed work item, issue, or Archon grooming artifact.
- Existing specs, ADRs, or spike notes in the same area.
- Relevant source docs or code references named by the work item.
- Prior decisions that constrain the artifact.

## Artifact Type

Choose the artifact type from the work item or explicit user request:

- `Spec`: behavior, contracts, records, user-visible semantics, or acceptance criteria.
- `ADR`: architecture direction, ownership, storage, public surface, or operating policy.
- `Spike`: evidence gathering when production work would otherwise guess.

If the type is unclear, ask one clarification question instead of drafting multiple artifacts.

## Spec Draft Rules

Use specs for proposed behavior or contracts. Write or update one file under
`docs/development/specs/`.

The draft must include:

```md
# <Spec Title>

Spec state: Draft

## Source

## Problem

## Current understanding

## Proposed behavior / contract

## Non-goals

## Source evidence

## Architecture / ownership implications

## Acceptance criteria

## Open questions

## Breakdown notes after acceptance
```

Rules:

- Keep `Spec state: Draft` until human acceptance.
- Do not create child implementation work items from a draft spec.
- If the spec file already exists and is `Accepted`, `Implemented`, or `Superseded`, do not rewrite
  it without explicit instruction. Propose a new draft or ask.

## ADR Draft Rules

Use ADRs for durable decisions about direction, ownership, storage, public surface, or operating
policy. Write or update one file under `docs/development/adrs/`.

The draft must include:

```md
# <ADR Title>

Status: Proposed

## Context

## Decision

## Consequences

## Alternatives considered

## Open questions
```

Rules:

- Use `Status: Proposed` unless the human explicitly accepted the decision.
- Do not hide a real architecture fork inside the recommendation.
- Include a compact options table when the decision is not obvious.

## Spike Record Rules

Use spikes for evidence gathering or results. Write or update one file under
`docs/development/spikes/`.

The record must include:

```md
# <Spike Title>

Status: proposed | running | complete | blocked

## Question

## Setup

## Evidence

## Result

## What this means

## Follow-up work
```

Rules:

- Use `Status: proposed` for a planned spike and `Status: complete` only when evidence exists.
- Separate evidence from recommendation.
- Do not turn a spike result into implementation work until accepted direction exists.

## Output

Return:

```md
## Artifact drafted
Type:
Path:
State/status:

## Source provenance

## Summary

## Human decision needed

## Next action

## Process feedback
```

If drafting is blocked, do not create a placeholder artifact. Explain the missing input and ask one
clarification question with options, a recommendation, and why it matters.

## Test-Drive Feedback

This workflow is being dogfooded. If you notice process friction while using this skill, include a
brief `Process feedback` note in your reply, issue comment, or PR summary. Mention confusing
instructions, missing fields, too much ceremony, unsafe autonomy, merge-safety gaps, or ideas that
would make the workflow easier to use.
