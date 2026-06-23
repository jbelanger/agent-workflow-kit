# AGENTS.md

This file is guidance for working inside the Agent Workflow Kit source repository.

This repository is not an installed target of Agent Workflow Kit. It is the source package where we
improve the kit itself: installable instructions, skills, issue templates, workflow docs, validation
scripts, and optional setup helpers.

## Core Rule

Do not use the kit workflow on this repository as if this repository were a normal target project.

That means:

- Do not create GitHub issues, PRs, or workflow status updates just to manage ordinary
  self-improvement work in this repo.
- Do not force this repo through `continue-work`, `groom-issue`, `breakdown-issue`,
  `prepare-implementation`, or `work-issue-local` as mandatory gates.
- Do not treat local source changes here as needing the installed target-repo handoff loop.
- Do not recursively dogfood the kit on itself unless the human explicitly asks for that experiment.

Use direct repository work instead: inspect the source, discuss the change with the human, edit the
source files, run validation, and commit or push only when asked.

## Source vs Installed Guidance

- Root `AGENTS.md` is for this source repository only.
- `kit/AGENTS.md` is the minimal AWK usage block merged into target repository guidance.
- `kit/.agents/skills/awk/` contains installable skills for target repositories.
- `.github/ISSUE_TEMPLATE/` and `.github/PULL_REQUEST_TEMPLATE.md` are package assets for target
  repositories, not process requirements for this source repository.
- `docs/awk/` contains installable AWK process docs.
- `docs/development/` records durable source-repo design notes, dogfood results, and project
  artifact templates.

When changing installed behavior, update the installable files under `kit/`, `.github/`,
`docs/awk/`, relevant project-artifact templates under `docs/development/`, and `scripts/`
deliberately. Keep root-only guidance out of the installed package unless the human explicitly wants
it installed into target repos.

## Self-Improvement Policy

Self-improvement work in this repo should stay lightweight and explicit:

- Prefer small source edits over new process machinery.
- Record important lessons in README or durable docs when they should shape future kit behavior.
- Validate with `node scripts/validate-workflow.mjs` and `node scripts/prove-portable-install.mjs`
  when installed files or installer behavior change.
- Use the separate dogfood target repo for realistic workflow trials.
- Promote only useful lessons from dogfood runs back into this source repo.

If a request is vague, ask a normal clarification question. Do not start the kit workflow to discover
what the human meant.

## Dogfood Run Protocol

When the human asks to dogfood or improve the flow through a realistic run, use a separate target
repository such as the Tetris dogfood repo. Do not run this source repo through its own installed
workflow.

For the time being, every meaningful dogfood run should start at the front door for the matching
task lane and move sequentially through the required handoffs. The point is to learn from each
handoff, not to skip directly to code or force every task through the longest possible path:

1. Reset or confirm a clean target baseline.
2. Create or select the initial work item. Use a deliberately vague item only when testing the
   vague-idea lane.
3. Run the first required lane step: plan inspection for detailed plans, grooming for unclear work,
   bug diagnosis for unclear bugs, maintenance inspection for AWK updates, or PR review for existing
   changes.
4. Use discovery, spec, ADR, or spike only when grooming shows that direction is missing.
5. Break accepted direction into one-agent, one-worktree, one-PR child tasks.
6. Prepare an implementation brief for each ready task.
7. Hand each task to a separate worker agent or worktree.
8. Review each worker's output before human merge review.
9. Promote only useful lessons back into this source repo.

Use subagents to simulate the future multi-agent handoff model. The main thread is the supervisor
only: it orchestrates, delegates, monitors quality, records handoff state, and captures process
lessons. It should not personally perform the workflow step being tested. In a dogfood run, delegate
grooming, discovery, breakdown, implementation preparation, implementation, and review to separate
agents whenever possible.

The purpose is to test whether each individual agent can follow the installed protocol from the
state it receives. The supervisor may read context to create a bounded assignment, inspect each
result for protocol compliance, ask the human for a decision when a delegated agent surfaces one, and
stop or redirect the run when quality is poor. The supervisor should not silently repair a delegated
agent's work in place, skip the handoff by doing the work itself, or let a subagent skip ahead to
later phases.

Grooming is the expected heavy step for vague ideas. It may use advisory subagents for product, UX,
technical architecture, validation, or creative direction, but their output is advisory. The
orchestrator must synthesize their findings into one visible grooming record and ask the human one
high-leverage question when product or architecture judgment is still needed.

The future vision is an autonomous fan-out loop:

- GitHub issues and docs expose enough state for an agent to pick up work without chat memory.
- A human or thin local runner can turn accepted direction into independent task worktrees.
- Worker agents can implement or revise one prepared task and open linked PRs.
- A reviewer agent can monitor PR quality, classify feedback, and route revisions.
- The human keeps architecture, product, approval, and merge authority.

Until that exists, simulate it deliberately: sequential handoffs first, parallel execution only after
task boundaries are explicit, and process feedback recorded at every weak spot.

Current dogfood focus: detailed-plan runs. When the human points at an existing detailed plan, do
not treat it like a blank vague idea and do not start with an interactive discovery interview. The
first delegated step should inspect the plan as an artifact: determine whether it is accepted enough
to build from, identify missing decisions, and route to `review-artifact`, `breakdown-issue`, or
`prepare-implementation`. Vague-idea grooming and live discovery interviews are still valid
workflow modes, but they are not the main experiment right now.

## GitHub

Agents must not merge. For this source repository, do not open PRs or create issue workflow state
unless the human explicitly asks. If the human says to commit or push, commit or push directly on the
current branch after validation.
