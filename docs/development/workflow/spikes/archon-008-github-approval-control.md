# ARCHON-SPIKE-008: GitHub Approval Control

Status: complete

## Question

Can GitHub comments approve/reject paused local Archon workflows without broadening permissions too
far?

## Setup

Docs/source spike only. No webhooks were configured, no ports exposed, no dependencies installed, and
no network calls made. The live tree already had unrelated workflow/doc edits; this spike only writes
this file.

## Evidence

Approval nodes are real pause points. The executor sends an approval prompt, stores run status
`paused`, and persists approval metadata including `captureResponse` and optional `onReject`.

Refs:

- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/approval-nodes.md:44`
- `/Users/joel/Dev/Archon/packages/workflows/src/dag-executor.ts:2816`
- `/Users/joel/Dev/Archon/packages/workflows/src/dag-executor.ts:2840`

GitHub comments can reach that paused-run path. The adapter verifies the webhook signature, applies
`GITHUB_ALLOWED_USERS` when configured, requires a bot mention, builds an `owner/repo#number`
conversation, and routes the comment to `handleMessage()`.

Refs:

- `/Users/joel/Dev/Archon/packages/adapters/src/forge/github/adapter.ts:922`
- `/Users/joel/Dev/Archon/packages/adapters/src/forge/github/adapter.ts:935`
- `/Users/joel/Dev/Archon/packages/adapters/src/forge/github/adapter.ts:987`
- `/Users/joel/Dev/Archon/packages/adapters/src/forge/github/adapter.ts:1015`
- `/Users/joel/Dev/Archon/packages/adapters/src/forge/github/adapter.ts:1205`

Natural-language approval is supported from GitHub because any non-slash message in the same
conversation with a paused run is treated as approval, writes approval events, marks the run
resumable, and dispatches the workflow again.

Refs:

- `/Users/joel/Dev/Archon/packages/core/src/orchestrator/orchestrator-agent.ts:899`
- `/Users/joel/Dev/Archon/packages/core/src/orchestrator/orchestrator-agent.ts:936`
- `/Users/joel/Dev/Archon/packages/core/src/orchestrator/orchestrator-agent.ts:960`
- `/Users/joel/Dev/Archon/packages/core/src/orchestrator/orchestrator-agent.ts:991`

Explicit `/workflow approve <id>` and `/workflow reject <id>` comments are parsed as deterministic
commands. They resolve the paused run, record the decision, and reject either cancels or queues
`on_reject`; however the chat command response tells the user to send another message to resume. The
web REST auto-resume helper explicitly skips non-web parent conversations.

Refs:

- `/Users/joel/Dev/Archon/packages/core/src/handlers/command-handler.ts:762`
- `/Users/joel/Dev/Archon/packages/core/src/handlers/command-handler.ts:786`
- `/Users/joel/Dev/Archon/packages/core/src/operations/workflow-operations.ts:132`
- `/Users/joel/Dev/Archon/packages/core/src/operations/workflow-operations.ts:228`
- `/Users/joel/Dev/Archon/packages/server/src/routes/api.ts:2104`
- `/Users/joel/Dev/Archon/packages/server/src/routes/api.ts:2159`

`capture_response` works technically: approval pause metadata keeps `captureResponse`, and approval
writes the comment into `node_output` only when that flag is true. Caveat: GitHub non-slash comments
are enriched with issue/PR context before `handleMessage()`, so natural-language approval may capture
the context-expanded message instead of only the raw approval comment.

Refs:

- `/Users/joel/Dev/Archon/packages/workflows/src/dag-executor.ts:2840`
- `/Users/joel/Dev/Archon/packages/core/src/operations/workflow-operations.ts:183`
- `/Users/joel/Dev/Archon/packages/core/src/orchestrator/orchestrator-agent.ts:936`
- `/Users/joel/Dev/Archon/packages/adapters/src/forge/github/adapter.ts:1155`
- `/Users/joel/Dev/Archon/packages/adapters/src/forge/github/adapter.ts:1180`

Remaining risk is permission scope, not the approval primitive. Archon remote workflows are designed
for unattended execution, the agent can read/write/execute in the worktree, Codex has no hard tool
restriction or sandbox capability, `GITHUB_ALLOWED_USERS` defaults to open access if unset, and App
mode still needs Issues/PR write permission for comments.

Refs:

- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/security.md:14`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/security.md:20`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/security.md:49`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/security.md:81`
- `/Users/joel/Dev/Archon/packages/providers/src/codex/capabilities.ts:3`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/github-app-setup.md:43`

`awk-work-issue-local` is a mutating Codex workflow: it runs a read-only preflight, pauses for human
approval with `capture_response: true`, then runs the implementation command in a worktree.

Refs:

- `.archon/workflows/awk-work-issue-local.yaml:1`
- `.archon/workflows/awk-work-issue-local.yaml:43`
- `.archon/workflows/awk-work-issue-local.yaml:53`
- `docs/development/workflow/spikes/archon-007-github-adapter.md:71`

## Result

Conditional.

GitHub comments can approve paused work in the same issue/PR thread, and explicit comments can reject
paused work. This is not yet a safe control surface for remote mutating workflows because approval is
comment-driven, adapter authorization may be open, Codex restrictions are policy-only, explicit run-id
commands are broad, and GitHub natural-language approval can capture enriched issue/PR context.

## What This Means For Agent Workflow Kit

Do not expose `awk-work-issue-local` through GitHub after this spike.

Keep GitHub exposure limited to deterministic/read-only or policy-read-only dogfood commands until
there is an adapter allowlist, required `GITHUB_ALLOWED_USERS`, run/conversation binding for approval
commands, raw-comment capture for GitHub approval responses, and a documented one-comment approval
and rejection resume path.

## Follow-Up Work

- Add a GitHub route allowlist that names exactly which workflows/commands can run from comments.
- Bind `/workflow approve|reject <run-id>` to the originating conversation or actor before accepting it.
- Special-case paused GitHub approvals before issue/PR context enrichment so `capture_response` is raw.
- Decide whether GitHub explicit approve/reject should auto-resume or require a second comment.
