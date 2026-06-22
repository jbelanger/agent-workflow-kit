---
name: init-awk
description: Initialize Agent Workflow Kit in a target repository before workflow execution by preserving project-owned guidance, installing AWK under namespaced paths, requiring a pushed GitHub repo, creating labels, and ensuring initial persisted issues exist.
---

# Init AWK

Initialize Agent Workflow Kit before any AWK workflow step starts. This skill is a hard gate for new
target repositories.

## Core Stance

- AWK must be visibly encapsulated inside the project.
- The project owns root `AGENTS.md`, root `README.md`, product code, and durable product artifacts.
- AWK owns `.agents/skills/awk/`, `docs/awk/`, issue templates, PR template, and lightweight setup
  scripts.
- GitHub issues are the default persisted workflow state. Do not let local Markdown work items
  replace issues when a GitHub remote is available.
- Do not begin grooming, breakdown, implementation prep, or implementation until initialization is
  complete.

## Required Checks

Before marking initialization complete, verify:

- The repository has a Git remote for GitHub.
- The current baseline branch is pushed.
- AWK skills exist under `.agents/skills/awk/`.
- AWK process docs exist under `docs/awk/`.
- Project artifacts, if any, live under `docs/development/`.
- Root `AGENTS.md` contains project guidance plus the small marked AWK usage block.
- Root `README.md` remains project-owned.
- Workflow labels exist on GitHub through `scripts/setup-github-labels.mjs`.
- Initial work is represented by GitHub issues before execution starts.

## Initialization Flow

1. Inspect the project identity, existing `AGENTS.md`, existing `README.md`, and current git state.
2. Install or repair AWK with `scripts/install-workflow-kit.mjs`.
3. Confirm the install did not replace project-owned root guidance.
4. Create or verify a GitHub remote and push the baseline branch.
5. Run `node scripts/setup-github-labels.mjs --verify-only`; if labels are missing, run the setup
   command with explicit human approval or as part of the requested initialization.
6. Convert imported plans, local work items, or requested starting work into GitHub issues.
7. Record parent/child links, labels, source docs, readiness state, and next workflow verb in those
   issues.
8. Stop with a clear initialization report.

## Initial Issue Bootstrap

Initialization is not complete until active work is persisted in GitHub issues.

Do not create coding branches, implementation commits, or local-only work queues during
initialization.

If the repo starts from a detailed plan, imported README, local work item, or human request, convert
that source into GitHub state before any downstream AWK skill runs:

- Create one parent initiative issue for the outcome.
- Create child task, spec, ADR, discovery, or spike issues for the first executable slices or
  unresolved decisions.
- Link every child back to the parent issue.
- Link every issue back to source docs, imported plans, prompts, or local files that define the work.
- Label each issue with the matching AWK issue type label.
- Record current status/readiness in the issue body or a setup comment.
- Record `Next workflow verb` for each issue: usually `groom-issue`, `review-artifact`,
  `breakdown-issue`, or `prepare-implementation` during initialization.

Create the parent issue first. Then create children one at a time so each child can link to the
parent. After child issue numbers exist, update the parent issue body or add a setup comment that
lists the child issue numbers. If a child must reference a sibling that does not exist yet, update
the link after GitHub assigns the number.

Use the smallest issue set that makes the next handoff resumable. A detailed plan usually starts
with one parent initiative plus enough child issues to represent the first meaningful batch of work.
Do not explode the whole roadmap into speculative tasks before grooming or accepted direction proves
the boundaries.

### Parent Initiative Minimum Shape

```md
## Outcome

## Source docs / imported plan

## Non-goals

## Initial child issues

## Current workflow state

- Status:
- Next Actor:
- Decision Needed:
- Next workflow verb:
```

### Child Issue Minimum Shape

```md
## Goal

## Source docs

## Grooming / direction state

## Acceptance criteria or decision needed

## Current workflow state

- Parent:
- Status:
- Next Actor:
- Decision Needed:
- Next workflow verb:
```

### Detailed Plan Import Rule

When a source plan is already detailed enough to build from, initialization still creates issues
first. It may route directly to `breakdown-issue` or `prepare-implementation` only when the issue
records why the plan is accepted enough, what source doc is authoritative, and what ambiguity remains.

Accepted enough for artifact review or breakdown is not accepted enough for implementation. An
implementation issue is not ready for `work-issue-local` until it has a visible grooming result,
accepted direction, task boundaries, and an implementation brief or equivalent issue body that passes
the `work-issue-local` readiness gate.

When a source plan is not accepted enough, route the parent or first child to `groom-issue`,
`discover-vision`, `draft-artifact`, or `review-artifact`. Do not let the presence of a long plan
substitute for accepted direction.

## Hard Stops

Stop before workflow execution when:

- there is no GitHub remote;
- the baseline branch is not pushed;
- GitHub labels cannot be verified or created;
- initial work exists only as local Markdown when GitHub is available;
- root `AGENTS.md` would be overwritten instead of merged;
- the target contains private data that would be pushed without an explicit privacy decision.

## Output

Return:

```md
## Init AWK

Repository:
Remote:
Pushed baseline:
AWK skills path:
AWK docs path:
Root AGENTS status:
Root README status:
Labels status:
Initial issues:
Issue bootstrap complete:
Blocked:

## Next workflow step

## Process feedback
```

## Test-Drive Feedback

If initialization feels too manual, too broad, or missing a concrete check, record process feedback.
The goal is for this skill to become the reliable front door before dogfood runs and real projects
start AWK execution.
