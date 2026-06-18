---
name: rigorous-implementation-v2
description: Use when implementing non-trivial code, migration, architecture-sensitive changes, or PR revisions where Codex must challenge the high-level direction before writing code, explain forks to the human, avoid cheap architecture debt, validate each slice, and preserve decisions, smells, and deferred debt.
---

# Rigorous Implementation V2

## Core Stance

- Challenge the high-level direction before implementation.
- Prefer the simplest model that stays honest.
- Do not keep overlapping truths alive to avoid a harder boundary decision.
- Do not choose a cheap or minimal pass when it affects architecture, ownership, contracts, storage,
  public surface, or long-term model clarity.
- Agents may decide local implementation mechanics. Humans decide boundaries, contracts, public
  surfaces, storage shape, cross-module direction, and architecture policy.
- Treat greenfield/pre-ship work as an opportunity to remove legacy surfaces rather than preserve
  compatibility by default.

## Workflow

### 1. Orient

Before changing code, read the issue, linked docs, nearby implementation, tests, and relevant
project instructions. Identify:

- the operational problem
- the current surfaces and ownership boundaries
- what is already true today
- what is missing
- allowed and forbidden files or modules
- likely validation commands

### 2. Challenge Direction Before Coding

Write a short architecture direction check:

```md
## Architecture Direction Check

Problem:

Current model:

Intended model:

Ownership boundary:

Public surfaces / contracts / storage touched:

Alternatives:

Cheap/minimal shortcuts rejected:

Human decision needed:
```

If there is a real architecture fork, stop before coding. Explain the fork to the human in simple
terms, assuming they have not looked at the code recently. Use a compact diagram, table, or
before/after flow when it makes the decision easier to understand. Include a recommendation and the
reasoning.

### 3. Implement In Narrow Slices

- Work one step at a time.
- Keep each slice intentional and reviewable.
- Preserve behavior unless the issue explicitly changes it.
- Avoid broad rewrites for isolated edge cases.
- If a slice raises the quality bar, apply the same applicable fix to comparable sibling code or
  explain why it does not apply.
- Stop and restate the roadmap when the model becomes fuzzy or work crosses multiple migration axes.

### 4. Validate

Run focused tests first, then broader checks when the touched surface warrants it. Do not claim
completion without relevant verification. If validation is blocked, state the exact blocker.

### 5. Prepare Review Evidence

Before review, summarize:

- what changed
- validation run
- architecture direction and whether it still holds
- decisions and smells
- naming issues worth revisiting
- deferred items with owner, boundary, and removal condition

## Guardrails

- No silent error hiding.
- No fake simplicity achieved by lying in the model.
- No generic framework or abstraction just in case.
- No untracked technical debt.
- No compatibility bridge, alias, fallback import, or migration shim unless explicitly approved,
  bounded, named, and given a removal condition.
- No PR can be considered clean only because tests pass if the architecture direction is wrong.
