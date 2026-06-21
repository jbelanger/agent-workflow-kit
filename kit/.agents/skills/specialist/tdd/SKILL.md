---
name: tdd
description: Use behavior-first test-driven development for implementation tasks where a useful public seam exists. Apply when building behavior, fixing bugs after a repro exists, or hardening refactors with characterization tests; avoid bulk-generated implementation-detail tests.
---

# TDD

Use this skill to create a tight feedback loop before implementation. TDD is not a lifecycle phase and
not mandatory for every task. It is an implementation discipline for work where behavior can be
pinned through a useful public seam.

## Core Stance

- Tests should verify behavior through the highest useful public seam, not implementation details.
- Work one behavior at a time: red, green, then refactor.
- Do not write a large batch of speculative tests before learning from the first slice.
- Do not add seams only for tests unless the seam also improves the production model.
- If the behavior is unclear, return to grooming, spec, or ADR instead of inventing test intent.

## When To Use

Use TDD for:

- Business rules.
- State machines.
- Parsers, importers, exporters, and data transformations.
- Behavior-changing tasks with clear acceptance criteria.
- Bug fixes after the bug has a red-capable repro.
- Refactors where characterization tests can pin existing behavior.

Do not force TDD for:

- Exploratory spikes.
- Architecture direction before the target model is settled.
- UI polish where visual verification is the real feedback loop.
- Trivial wiring with a cheaper deterministic validation command.
- Work where the only available test would lock implementation details.

## Process

1. Identify the feedback loop:
   - Highest useful seam:
   - First behavior to pin:
   - Existing test pattern:
   - Command to run:
2. Write one failing test or characterization test for one behavior.
3. Run it and confirm the failure is meaningful.
4. Implement the smallest honest change that makes the test pass.
5. Refactor only while green.
6. Repeat for the next behavior.
7. Run the focused validation command, then broader checks when warranted.

## Test Quality Check

Before calling the loop complete, ask:

- Does the test describe externally observable behavior?
- Would the test survive an internal refactor that preserves behavior?
- Is the setup telling us the seam is too low or too awkward?
- Did the implementation introduce a public surface, helper, or abstraction only for the test?
- Are important edge cases covered by focused examples, not broad generated noise?

If the test seam is painful because the production model is wrong, stop and surface that as an
architecture or refactor finding instead of testing around it.

## Output

When reporting TDD work, include:

- Feedback loop / test seam.
- Behaviors pinned.
- Focused command run.
- Refactor performed while green.
- Cases intentionally not covered and why.
