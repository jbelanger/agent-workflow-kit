---
name: groom-to-spec-v2
description: Use when grooming vague ideas, backlog issues, feature requests, architecture concerns, or unclear tasks into direct tasks, spec issues, ADR issues, or spikes. Convert the current issue into a draft spec by default when behavior or contracts need clarification, then ask one human-friendly clarification question at a time.
---

# Groom To Spec V2

## Core Stance

- Grooming classifies unclear work before implementation.
- Convert the current issue into the needed issue type by default instead of creating parallel
  planning issues.
- A spec is accepted intent, not necessarily finalized work.
- When specs live in the repo, the spec issue owns clarification and the spec PR owns the durable
  text under `docs/development/specs/`.
- Use `docs/development/adrs/` for durable architecture or policy choices, `docs/development/spikes/`
  for preserved investigations, `docs/development/workflow/` for process docs, and
  `docs/development/agents/` for agent guidance drafts.
- Ask one clarification question at a time.
- Give options, a recommendation, and the reason.
- Explain in simple operational terms, assuming the human has not looked at the code recently.
- Use a compact diagram, table, or before/after flow when it makes the decision clearer.

## Classification

Choose the smallest useful output:

- **Direct Task:** The work is already clear, bounded, testable, and does not need behavior,
  contract, or architecture clarification.
- **Spec:** Behavior, contracts, records, user-visible semantics, or acceptance criteria need to be
  settled before implementation.
- **ADR:** A decision changes architecture direction, ownership boundaries, storage, public surface,
  or operating policy.
- **Spike:** Evidence is missing and production work would otherwise guess.
- **Defer / Drop:** The work is not ready or not worth moving now.

## Spec Issue Flow

When the current issue needs a spec:

1. Convert the current issue to `Issue Type: Spec` by default.
2. Set `Spec state: Draft`.
3. Keep the board status in `Grooming` while asking clarification questions.
4. Ask one clarification question at a time.
5. Move the board status to `In Progress` once there is enough context to draft the spec.
6. Create or update the spec document under `docs/development/specs/`.
7. Open or update a PR for the spec document.
8. Ask for human review and acceptance on the PR.
9. After acceptance, ensure the spec document says `Spec state: Accepted`.
10. Move to `Breakdown` when implementation issues are needed, or `Done` when the spec itself is
   the final deliverable.

Do not create implementation child issues from a draft spec.

Use `Blocked` only when progress depends on a real unresolved decision, missing access, or external
dependency. Do not mark normal clarification as blocked.

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

## Clarification Question Shape

Ask one question and include a recommendation:

```md
Question:

Options:
1. ...
2. ...
3. ...

Recommendation:

Why:
```
