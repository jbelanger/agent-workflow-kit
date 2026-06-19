# ARCHON-SPIKE-013: Artifact Promotion

Status: complete

## Question

Which Archon artifacts should become issue comments, docs, or ledger entries, and which must remain
runtime evidence only?

## Setup

This was a docs/source spike only. I did not run Archon or use the network. I inspected the local
workflow policy, prior Archon route spikes, and Archon's artifact, workflow, database, Web, GitHub,
and approval-node docs.

Key refs:

- `AGENTS.md:61`, `AGENTS.md:78`, `AGENTS.md:112`, `AGENTS.md:129`
- `docs/development/workflow/archon-concept-spikes.md:13`, `docs/development/workflow/archon-concept-spikes.md:18`, `docs/development/workflow/archon-concept-spikes.md:69`
- `docs/development/workflow/archon-route-tracker.md:10`, `docs/development/workflow/archon-route-tracker.md:31`, `docs/development/workflow/archon-route-tracker.md:51`, `docs/development/workflow/archon-route-tracker.md:123`
- `docs/development/workflow/spikes/archon-009-run-store-dashboard.md:72`, `docs/development/workflow/spikes/archon-009-run-store-dashboard.md:82`, `docs/development/workflow/spikes/archon-009-run-store-dashboard.md:90`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/book/how-it-works.md:89`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/authoring-commands.md:59`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/authoring-commands.md:261`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/authoring-workflows.md:686`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/authoring-workflows.md:719`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/database.md:93`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/web.md:116`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/github.md:95`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/approval-nodes.md:12`

## Evidence

The local route already draws the core boundary: Archon may own execution, artifacts, worktrees,
approval gates, logs, and dashboards, but it must not own planning truth, board or ledger taxonomy,
architecture authority, review policy, skill content, or durable "what should exist and why" answers.
Accepted planning state must live in repo docs, skills, GitHub issues/PRs, or a future ledger.

Archon artifacts are intentionally run-local execution handoffs. They are written under
`~/.archon/workspaces/owner/repo/artifacts/runs/{workflow-id}/`, outside git, and are the way fresh
nodes pass context. Typed `output_type` sidecars can help find node outputs later, but their write is
best-effort and typed labels are conventions, not durable taxonomy.

Archon's database and dashboard are operational evidence. Workflow runs track status, working-path
locks, step progress, and conversation linkage. Workflow events record transitions, artifacts, and
errors. The Web UI exposes progress, paused approval controls, result cards, and artifact links.

The GitHub adapter is a collaboration/reporting surface, not a canonical planner. It uses batch mode
because issues and PRs are served by complete comments, and only issue/PR comments trigger the bot.
Approval nodes pause execution for human review; captured approval comments become downstream output
only when `capture_response: true` is set.

## Result

Conditional.

Artifact promotion is viable only as a narrow, explicit bridge from runtime evidence to a canonical
surface. It is not safe to let generic Archon artifacts update docs, decide issue readiness, or mutate
a planning ledger automatically. The missing condition is the canonical planning-state decision:
GitHub issues/project, repo-local ledger, or hybrid.

## What This Means For Agent Workflow Kit

Artifact categories and destinations:

| Artifact Category | Examples | Destination | Auto-Promote? |
| --- | --- | --- | --- |
| Run summary | run id, workflow, status, duration, artifact paths | issue/PR comment or ledger event | Yes, append-only |
| Read-only findings | prepare brief, review findings, validation summary | issue/PR comment | Yes, if work-item anchored |
| Spike result | concept answer and evidence refs | assigned spike doc | Only by assigned write scope |
| Accepted planning state | readiness, status, owner, priority, merge risk | GitHub issue/project or future ledger | No generic auto-promotion |
| Durable policy | AGENTS, skills, specs, ADRs, route docs | repo docs | Human-review-only |
| Raw runtime evidence | logs, full artifacts, transcripts, DB rows | Archon run store/artifact dir | Never auto-promote |

Promotion rules:

- Promote only from an allowlisted workflow/node type with a declared output shape or documented
  artifact path.
- Require a stable work anchor: GitHub issue/PR id or future ledger item id.
- Preserve provenance in the promoted text: workflow name, run id, node id, artifact path, and time.
- Use append-only comments or ledger events unless a human explicitly assigned a doc write path.
- Summarize runtime evidence; do not paste raw logs, full transcripts, secrets, credentials, or
  environment dumps.
- If the artifact changes behavior, contracts, architecture, ownership, storage, review posture, or
  source-of-truth state, stop for human review.
- If the artifact conflicts with the canonical issue, doc, or ledger, report the conflict instead of
  overwriting either side.

Never auto-promote:

- Architecture decisions, ADRs, specs, AGENTS changes, skill changes, route tracker changes, or spike
  index changes.
- Issue readiness, board status, labels, priority, ownership, merge-risk class, or accepted scope.
- Approval/rejection decisions beyond recording that a gate was resolved.
- External user comments or AI plans as accepted truth.
- Worktree diffs, commits, pushes, PR creation, or self-fix actions.
- Raw tool output, prompt text, credentials, env vars, session ids, or private logs.

Human-review-only:

- Promoting a spike result into the route tracker or durable workflow policy.
- Turning review findings into accepted/deferred/rejected classifications.
- Updating docs or a future ledger with durable decisions.
- Any promotion that changes permissions, public surface, storage, ownership, or long-term process.

## Follow-Up Work

- Decide ARCHON-003: GitHub issues/project, repo-local ledger, or hybrid planning state.
- If automatic reporting is implemented, add a small allowlist of promotable node outputs and require
  provenance fields.
- ARCHON-SPIKE-014 should cover how humans recover from and inspect unpromoted runtime evidence.
