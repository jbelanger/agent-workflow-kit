# Installing Agent Workflow Kit

Status: active install contract

Agent Workflow Kit is a GitHub-first workflow pack.

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
  docs/development/workflow/github-first-flow.md
  scripts/setup-github-project.mjs
  scripts/validate-workflow.mjs

Optional:
  docs/development/work-items/
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
| `docs/development/workflow/github-first-flow.md` | Yes | The v0 GitHub-first operating loop for mobile answers, resume behavior, and process feedback. |
| `scripts/setup-github-project.mjs` | Yes | Idempotent setup and verification for the GitHub Project fields, labels, and root initiative. |
| GitHub issues/PRs/projects | Yes for the default profile | Active orchestration, human answers, remote planning, audit trail, and review. |
| `docs/development/work-items/` | Optional fallback | Portable planning records only when GitHub is absent. |

## Install

GitHub-first workflow kit:

```bash
node scripts/install-workflow-kit.mjs --target /path/to/project
```

The installer refuses to overwrite existing different files by default. That is intentional: a
project may already have `AGENTS.md` or local skills, and those should be merged deliberately instead
of silently replaced.

## Validation

In an installed project:

```bash
node scripts/validate-workflow.mjs
```

For the GitHub-first Project board, first verify the planned setup contract:

```bash
node scripts/setup-github-project.mjs --dry-run
```

Then verify or apply it against GitHub:

```bash
gh auth refresh -s repo -s project
node scripts/setup-github-project.mjs --repo OWNER/REPO --owner OWNER --verify-only
node scripts/setup-github-project.mjs --repo OWNER/REPO --owner OWNER
```

The setup script creates missing labels, the Project, required single-select fields, and the root
initiative. On an existing Project, mismatched fields are reported instead of silently rewritten.

From the kit repo, prove the install path against a clean temporary repository:

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
  -> Codex records process feedback when the workflow itself shows weakness
```

GitHub:

```text
Issues and PRs hold collaboration and audit trail.
Projects hold lifecycle, next actor, decision-needed, artifact-state, area, and merge-risk fields.
PRs hold proposed durable docs or code and review gates.
Repo docs remain the accepted durable truth after review.
```
