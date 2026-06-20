# Installing Agent Workflow Kit

Status: active install contract

Agent Workflow Kit is a GitHub-first workflow pack, not an Archon requirement.

The adoption contract is:

```text
Required:
  AGENTS.md
  .github/ISSUE_TEMPLATE/
  .github/PULL_REQUEST_TEMPLATE.md
  .agents/skills/
  docs/development/adrs/github-first-orchestration.md
  docs/development/discovery/
  docs/development/specs/
  docs/development/adrs/
  docs/development/spikes/
  docs/development/workflow/ai-dev-workflow.md
  scripts/validate-workflow.mjs

Optional:
  .archon/
  docs/development/work-items/
  docs/development/workflow/adr-archon-portable-skills.md
  docs/development/workflow/archon-recovery-runbook.md
  scripts/validate-archon-pack.mjs
  .gitignore entries for .archon/artifacts/ and .archon/logs/
```

## What The Parts Do

| Part | Required? | Purpose |
| --- | --- | --- |
| `AGENTS.md` | Yes | Standing repository rules for local Codex work. |
| `.github/ISSUE_TEMPLATE/` | Yes | GitHub-first intake contracts for initiatives, specs, ADRs, and tasks. |
| `.github/PULL_REQUEST_TEMPLATE.md` | Yes | Review gate and validation summary for proposed docs or code. |
| `.agents/skills/` | Yes | Portable workflow verbs and specialist lenses such as grooming, discovery, artifact drafting, breakdown, preparation, local work, and review. |
| `docs/development/adrs/github-first-orchestration.md` | Yes | Accepted source-of-truth decision for the GitHub-first operating model. |
| `docs/development/discovery/` | Yes | Portable discovery bundles for accepted or in-progress product, UX, creative, platform, or architecture vision work. |
| `docs/development/specs/`, `docs/development/adrs/`, `docs/development/spikes/` | Yes | Durable planning artifacts reviewed through PRs. |
| `docs/development/workflow/ai-dev-workflow.md` | Yes | Durable explanation of the AWK process and operating surfaces. |
| GitHub issues/PRs/projects | Yes for the default profile | Active orchestration, human answers, remote planning, audit trail, and review. |
| `docs/development/work-items/` | Optional fallback | Portable planning records only when GitHub is absent. |
| `.archon/` | Optional | Runtime/dashboard adapters around the same portable skills. |
| Archon CLI/server | Optional | Workflow runs, artifacts, worktrees, approval gates, and dashboard state. |

## Install Profiles

GitHub-first workflow kit:

```bash
node scripts/install-workflow-kit.mjs --target /path/to/project
```

GitHub-first workflow kit plus optional Archon adapters:

```bash
node scripts/install-workflow-kit.mjs --target /path/to/project --with-archon
```

The installer refuses to overwrite existing different files by default. That is intentional: a
project may already have `AGENTS.md` or local skills, and those should be merged deliberately instead
of silently replaced.

When `--with-archon` is used, the installer also ensures `.gitignore` ignores Archon runtime
artifacts and logs. These are execution evidence, not source files.

## Validation

In an installed project:

```bash
node scripts/validate-workflow.mjs
```

If the Archon profile is installed:

```bash
node scripts/validate-archon-pack.mjs
archon validate workflows --cwd /path/to/project --json
archon validate commands --cwd /path/to/project --json
```

From the kit repo, prove both install profiles against clean temporary repositories:

```bash
node scripts/prove-portable-install.mjs
```

## Expected Use In A Project

Plain Codex:

```text
Codex chat in the project
  -> user asks "continue work"
  -> Codex reads GitHub issues, project fields, PRs, and repo docs
  -> Codex uses .agents/skills/process/continue-work/SKILL.md to choose the next workflow verb
```

Archon:

```text
Archon dashboard or CLI in the project
  -> run awk-continue-work, awk-groom-issue, awk-discover-vision, awk-draft-spec, or awk-breakdown-work-item
  -> .archon command points Codex at the same .agents/skills procedure
  -> Archon stores run state and artifacts
```

When the explicit goal is to test-drive Archon, project work after installation should happen through
installed `awk-*` workflows. If a needed step cannot be expressed by the installed workflows, improve
Agent Workflow Kit first, reinstall it, then continue in Archon.

Current limitation: for local-only repositories without a valid `origin/main`, the Archon dashboard
may fail early while preparing a background worker even when an AWK planning workflow declares
`worktree.enabled: false`. Use the Archon CLI as the canonical path for those planning runs until the
dashboard path is verified:

```bash
archon workflow run awk-groom-issue --cwd /path/to/project "<work item>"
```

GitHub:

```text
Issues and PRs hold collaboration and audit trail.
Projects hold lifecycle, next actor, decision-needed, artifact-state, area, and merge-risk fields.
PRs hold proposed durable docs or code and review gates.
Repo docs remain the accepted durable truth after review.
```
