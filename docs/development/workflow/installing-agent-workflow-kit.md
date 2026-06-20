# Installing Agent Workflow Kit

Status: active install contract

Agent Workflow Kit is a workflow pack, not an Archon requirement.

The adoption contract is:

```text
Required:
  AGENTS.md
  .agents/skills/
  docs/development/workflow/ai-dev-workflow.md
  scripts/validate-workflow.mjs

Optional:
  .archon/
  docs/development/workflow/archon-recovery-runbook.md
  scripts/validate-archon-pack.mjs
  .gitignore entries for .archon/artifacts/ and .archon/logs/
```

## What The Parts Do

| Part | Required? | Purpose |
| --- | --- | --- |
| `AGENTS.md` | Yes | Standing repository rules for local Codex work. |
| `.agents/skills/` | Yes | Portable workflow verbs such as grooming, breakdown, preparation, local work, and review. |
| `docs/development/workflow/ai-dev-workflow.md` | Yes | Durable explanation of the AWK process and operating surfaces. |
| GitHub issues/PRs | Optional but expected for team work | Collaboration, audit trail, and remote planning anchors. |
| `.archon/` | Optional | Runtime/dashboard adapters around the same portable skills. |
| Archon CLI/server | Optional | Workflow runs, artifacts, worktrees, approval gates, and dashboard state. |

## Install Profiles

Portable skills only:

```bash
node scripts/install-workflow-kit.mjs --target /path/to/project
```

Portable skills plus Archon adapters:

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
  -> user asks "groom this issue"
  -> Codex uses .agents/skills/process/groom-issue/SKILL.md
```

Archon:

```text
Archon dashboard or CLI in the project
  -> run awk-continue-work or awk-groom-issue
  -> .archon command points Codex at the same .agents/skills procedure
  -> Archon stores run state and artifacts
```

When the explicit goal is to test-drive Archon, project work after installation should happen through
installed `awk-*` workflows. If a needed step cannot be expressed by the installed workflows, improve
Agent Workflow Kit first, reinstall it, then continue in Archon.

GitHub:

```text
Issues and PRs hold collaboration and audit trail.
Project boards may be a progress dashboard.
Neither replaces the repo-local skills or durable docs.
```
