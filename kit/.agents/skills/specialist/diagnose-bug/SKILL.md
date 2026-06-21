---
name: diagnose-bug
description: Build a tight bug feedback loop before fixing a reported failure. Use when behavior is broken, failing, throwing, flaky, slow, or ambiguous enough that implementation would otherwise guess.
---

# Diagnose Bug

Use this skill when a bug needs evidence before implementation. The goal is a red-capable feedback
loop that proves the reported symptom before any fix is attempted.

## Core Stance

- Build the feedback loop first. A plausible theory without a red-capable loop is not enough.
- Reproduce the user's symptom, not a nearby failure.
- Minimize the scenario until every remaining input, setting, or step is load-bearing.
- Test hypotheses one at a time.
- Clean up diagnostic instrumentation before completion.

## Process

### 1. Build The Feedback Loop

Prefer the fastest deterministic loop that reaches the real bug path:

1. Focused test at the right seam.
2. CLI command with fixture input.
3. HTTP or API request against a local server.
4. Browser or UI script when the symptom is visual or interaction-driven.
5. Replay of a captured payload, event log, or trace.
6. Temporary harness when no normal seam exists.

Record:

- Command:
- Expected red symptom:
- Why this reaches the actual bug:
- Runtime and determinism:

If no useful loop can be built, stop and ask for the missing artifact, access, or human decision.

### 2. Reproduce And Minimize

- Run the loop and capture the exact symptom.
- Remove inputs, config, data, callers, or steps one at a time.
- Keep only what is necessary for the loop to fail.

### 3. Hypothesize

List two to five falsifiable hypotheses. For each one, state what observation would confirm or
reject it. Do not test multiple variables at once.

### 4. Instrument

Use targeted inspection, debugger output, or temporary logs at the boundary that distinguishes the
hypotheses. Prefix temporary logs with a unique marker so cleanup is grep-able.

### 5. Fix And Lock Down

- Convert the minimized repro into a regression test when the seam is appropriate.
- Apply the smallest honest fix.
- Re-run the minimized loop and the original loop.
- Remove temporary instrumentation and throwaway harnesses.

## Architecture Signal

If no correct test seam exists, say so. That is an architecture finding, not a reason to add a weak
test. Route the follow-up through `groom-issue`, `breakdown-issue`, or `review-revision-triage`
depending on whether the fix is still in progress or has reached review.

## Output

Report:

- Feedback loop command.
- Reproduction result.
- Minimal scenario.
- Hypothesis that proved true.
- Regression test or reason no correct seam exists.
- Validation run.
- Cleanup performed.
