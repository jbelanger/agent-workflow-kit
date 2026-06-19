# ARCHON-SPIKE-007: GitHub Adapter

Status: complete

## Question

Can a GitHub issue or PR comment safely trigger local read-only work through Archon's GitHub adapter
and report back?

## Setup

Docs/source spike only. No webhooks were configured, no ports exposed, no dependencies installed, and
no network calls made.

## Evidence

GitHub trigger path:

```text
GitHub comment
  -> POST /webhooks/github
  -> signature verification
  -> optional GITHUB_ALLOWED_USERS check
  -> @bot mention detection
  -> repo clone/sync and .archon command load
  -> issue/PR context injection
  -> handleMessage()
  -> GitHub issue comment response
```

Refs:

- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/github.md:87`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/github.md:101`
- `/Users/joel/Dev/Archon/packages/server/src/index.ts:725`
- `/Users/joel/Dev/Archon/packages/adapters/src/forge/github/adapter.ts:436`
- `/Users/joel/Dev/Archon/packages/adapters/src/forge/github/adapter.ts:922`
- `/Users/joel/Dev/Archon/packages/adapters/src/forge/github/adapter.ts:935`
- `/Users/joel/Dev/Archon/packages/adapters/src/forge/github/adapter.ts:1015`
- `/Users/joel/Dev/Archon/packages/adapters/src/forge/github/adapter.ts:1205`

Only comments intentionally trigger the bot; issue/PR descriptions are ignored.

Ref: `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/github.md:118`

Auth modes:

- PAT mode: `GITHUB_TOKEN` plus `WEBHOOK_SECRET`.
- GitHub App mode: `GITHUB_APP_ID`, private key, and `WEBHOOK_SECRET`.
- Archon refuses to start with both modes configured.

Refs:

- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/github.md:14`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/github-app-setup.md:12`
- `/Users/joel/Dev/Archon/packages/server/src/github-auth-bootstrap.ts:25`

Security controls:

- GitHub webhook authenticity uses `WEBHOOK_SECRET` and `X-Hub-Signature-256`.
- `GITHUB_ALLOWED_USERS` is optional; if unset, access is open.
- Repository scope is controlled by App installation or per-repo webhook setup.
- App mode has an internal credential endpoint that must not be public.

Refs:

- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/security.md:81`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/security.md:102`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/github-app-setup.md:168`

Important constraint: with Codex, read-only is a workflow contract, not a hard tool sandbox.
Archon's security docs say tool restrictions are Claude-only for `allowed_tools`, and Codex
capabilities report tool restrictions as unsupported.

Refs:

- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/security.md:34`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/security.md:49`
- `/Users/joel/Dev/Archon/packages/providers/src/codex/capabilities.ts:3`

## Result

Conditional.

GitHub can be a useful remote trigger/report surface, but only under narrow conditions:

- Use explicit `/workflow run <name>` comments, not broad natural-language mentions.
- Prefer GitHub App mode for shared use.
- Configure `WEBHOOK_SECRET`.
- Set `GITHUB_ALLOWED_USERS`.
- Start with deterministic or policy-read-only workflows.
- Keep mutating workflows out of GitHub until approval semantics and permissions are separately
  accepted.

## What This Means For Agent Workflow Kit

First safe dogfood command:

```text
@archon /workflow run awk-validate-process-pack
```

Next candidates, after accepting policy-read-only Codex behavior for trusted users:

```text
@archon /workflow run awk-review-local-changes
@archon /workflow run awk-prepare-implementation <issue-number-or-url>
```

Do not expose yet:

- Natural-language comments like `@archon review this`.
- Project-management commands such as `/init`, `/register-project`, `/update-project`, or
  `/remove-project`.
- `awk-work-issue-local`.

## Follow-Up Work

- ARCHON-SPIKE-008: decide whether GitHub comments can approve/reject paused runs safely.
- ARCHON-SPIKE-011: decide whether Codex permission behavior is acceptable for remote-triggered
  workflows.
- Add an explicit adapter/route allowlist before relying on GitHub comments beyond a trusted dogfood
  run.
