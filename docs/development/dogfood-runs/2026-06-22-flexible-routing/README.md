# Flexible Routing Dogfood

Date: 2026-06-22

## Purpose

Test whether the updated AWK guidance stays flexible enough to handle a detailed-plan project with
an open UX artifact PR, without restarting vague discovery or allowing implementation too early.

## Target

- Target repo: `/Users/joel/Dev/investor-review-bootstrap`
- Remote: `jbelanger/investor-review`
- Branch inspected: `codex/ux-discovery-mockups`
- Open target PR: `#9 Draft investor review UX direction`
- Related issue: `#8 Review UX direction and mockups`
- Supervisor action: delegated read-only route inspection to subagent Popper.

The supervisor did not edit the target repo, create GitHub issues, push branches, or implement code
during this check.

## Subagent Result

Popper classified the target as:

> Detailed-plan project with a draft UX artifact for UI-bearing future work.

Recommended next workflow verb:

```text
review-artifact on issue #8, reviewing PR #9 and docs/development/discovery/investor-review-ux/
```

The agent explicitly reported:

- Coding should not start.
- A blank discovery interview should not start.
- The existing UX draft should be reviewed for accept/revise routing.
- After acceptance, route to `draft-artifact` for a UX/report contract spec or to
  `breakdown-issue` on `#5`.
- `prepare-implementation` comes only after breakdown selects one concrete task.

## What Went Well

- The delegated agent followed the detailed-plan route instead of treating the project as a blank
  vague idea.
- The delegated agent respected the issue-first and no-coding-before-readiness gates.
- The UX gate behaved as intended: an agent-produced UX draft and mockups are ready for human review,
  not implementation.
- The target repo already has GitHub issues that preserve enough workflow state to avoid relying on
  chat memory.

## What Went Badly Or Remains Weak

- The target installed AWK files are older than the source kit and do not yet contain the new
  task-shape routing wording.
- The delegated agent found a real ambiguity: source guidance said a linked PR without recorded
  agent review usually routes to `review-local-changes`, while issue `#8` and PR `#9` correctly
  route an artifact PR to `review-artifact`.
- Issue bodies carried workflow state directly, which matches the simplified AWK model. The weak
  spot is making that issue-body state easy for a cold agent to scan.

## Actions Taken In Source Kit

- Added task-shape routing to the installed AWK guidance and the source workflow docs.
- Clarified fast-lane behavior: fewer artifacts are allowed only when issue state records
  `DIRECT_TASK`, one-agent scope, acceptance criteria, validation, and merge risk.
- Clarified that detailed plans skip blank discovery only when issue bootstrap records why the plan
  is authoritative.
- Clarified that UI-bearing work needs proportional UX direction before implementation.
- Clarified artifact PR routing: `review-artifact` is the agent review pass for durable artifact PRs;
  `review-local-changes` remains the route for implementation or general doc/code PRs without agent
  review.

## Recommended Next Target Step

Completed in the follow-up maintenance pass. Delegated worker Sartre ran `maintain-awk` behavior on
`/Users/joel/Dev/investor-review-bootstrap` and refreshed the target install from this source kit.

Changed target files:

- `AGENTS.md` marked AWK block only.
- `.agents/skills/awk/README.md`.
- `.agents/skills/awk/process/continue-work/SKILL.md`.
- `.agents/skills/awk/process/discover-vision/SKILL.md`.
- `.agents/skills/awk/process/draft-artifact/SKILL.md`.
- `.agents/skills/awk/process/review-artifact/SKILL.md`.
- `docs/awk/workflow/ai-dev-workflow.md`.
- `docs/awk/workflow/github-first-flow.md`.
- `scripts/validate-workflow.mjs`.

Target validation:

- `node scripts/validate-workflow.mjs`: passed.
- `node scripts/setup-github-labels.mjs --verify-only`: passed; labels unchanged.
- `git diff --check`: passed.

No target issues, PRs, commits, pushes, merges, README, or product code were changed. The target
next workflow step remains `review-artifact` on issue `#8` / PR `#9`.
