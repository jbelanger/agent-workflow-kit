# Installing Agent Workflow Kit

Status: active install contract

Agent Workflow Kit is a GitHub-first workflow pack.

The adoption contract is:

```text
Required:
  AGENTS.md AWK usage block
  .github/ISSUE_TEMPLATE/
  .github/PULL_REQUEST_TEMPLATE.md
  .agents/skills/awk/
  docs/awk/README.md
  docs/awk/adrs/github-first-orchestration.md
  docs/awk/workflow/ai-dev-workflow.md
  docs/awk/workflow/github-first-flow.md
  docs/awk/workflow/installing-agent-workflow-kit.md
  docs/development/README.md
  scripts/workflow-labels.mjs
  scripts/setup-github-labels.mjs
  scripts/validate-workflow.mjs
  scripts/refresh-workflow-cache.mjs
  pushed GitHub repository
  initial GitHub issues before workflow execution

Optional:
  docs/development/discovery/      # create only when used
  docs/development/specs/          # create only when used
  docs/development/adrs/           # create only when used
  docs/development/spikes/         # create only when used
  docs/development/**/mockups/     # create only when visual review assets exist
  docs/development/work-items/     # fallback only when GitHub is unavailable
```

## What The Parts Do

| Part | Required? | Purpose |
| --- | --- | --- |
| `AGENTS.md` AWK block | Yes | Minimal instruction that points agents to the namespaced AWK install while preserving project-owned guidance. |
| `.github/ISSUE_TEMPLATE/` | Yes | GitHub-first intake contracts for initiatives, specs, ADRs, and tasks. |
| `.github/PULL_REQUEST_TEMPLATE.md` | Yes | Review gate and validation summary for proposed docs or code. |
| `.agents/skills/awk/` | Yes | Namespaced AWK workflow verbs and procedural specialists such as initialization, grooming, discovery, artifact drafting, breakdown, conditional re-briefing, local work, review, TDD, and bug diagnosis. |
| `docs/awk/` | Yes | Visible AWK documentation root for process references and workflow decisions. |
| `docs/awk/adrs/github-first-orchestration.md` | Yes | Accepted source-of-truth decision for the GitHub-first operating model. |
| `docs/awk/workflow/` | Yes | AWK flow and install docs. |
| `docs/development/README.md` | Yes | Project artifact folder contract for durable project-specific docs. |
| `docs/development/discovery/` | Lazy | Portable discovery bundles for accepted or in-progress product, UX, creative, platform, or architecture vision work. Create only when a discovery artifact exists. |
| `docs/development/specs/`, `docs/development/adrs/`, `docs/development/spikes/` | Lazy | Durable planning artifacts reviewed through PRs. Create only when that artifact type exists. |
| `docs/development/**/mockups/` or `docs/development/specs/*-assets/` | Lazy | Generated wireframes, sample assets, screenshots, or mockups used to review UX direction. Mark as non-production until accepted. |
| `scripts/workflow-labels.mjs` | Yes | Shared workflow label contract used by setup and validation. |
| `scripts/setup-github-labels.mjs` | Yes | Minimal GitHub setup for labels used by issue templates. |
| `scripts/validate-workflow.mjs` | Yes | Local validation for the installed AWK payload and workflow contract. |
| `scripts/refresh-workflow-cache.mjs` | Yes | Rebuilds the disposable local workflow cache from GitHub when agents need structured state. |
| GitHub issues/PRs | Yes for workflow execution | Active orchestration, human answers, remote planning, audit trail, and review. |
| GitHub labels | Recommended setup | Lightweight issue type and review signals created by `scripts/setup-github-labels.mjs`. |
| `docs/development/work-items/` | Optional fallback | Portable planning records only when GitHub is absent. |

## Install

GitHub-first workflow kit:

```bash
node scripts/install-workflow-kit.mjs --target /path/to/project
```

The installer refuses to overwrite existing different files by default. That is intentional: a
project may already have local skills or docs, and those should be merged deliberately instead of
silently replaced. `AGENTS.md` is special: the installer appends or replaces only the marked AWK
usage block, so the project remains the owner of root guidance.

Before running AWK workflow steps, initialize the repository:

```text
Use .agents/skills/awk/process/init-awk/SKILL.md
```

Initialization must verify that the repository is pushed to GitHub, labels are available, and the
initial work is represented by GitHub issues. Do not start implementation from local Markdown files
when a GitHub remote is available.

### Initial Issue Bootstrap

Before any AWK workflow step after initialization, create the initial GitHub issue surface:

- one parent initiative issue for the outcome;
- child task, spec, ADR, discovery, or spike issues for the first executable slices or unresolved
  decisions;
- links from children to parent and from every issue to source docs or imported plans;
- issue type labels from the installed templates;
- exactly one `next:*` label per active issue;
- visible issue prose or comments that explain any non-obvious blocker, accepted direction, or
  handoff.

Create the parent issue first, create child issues one at a time, then update the parent or add a
setup comment with the assigned child issue numbers. Do the same for sibling links that could not be
known before GitHub assigned issue numbers.

For a detailed existing plan, initialize from the plan but do not implement from the plan directly.
Convert it into issue state first, then route to `review-artifact` or `breakdown-issue` when
direction or task boundaries still need review. Use `prepare-implementation` only when accepted
issue state is stale or scattered and needs a compact re-brief. If the resulting issue already
contains a complete Ready task contract and the human authorizes implementation, route directly to
`work-issue-local`.
Accepted enough for artifact review or breakdown is not accepted enough for implementation; a future
implementation issue still needs visible grooming, accepted direction, task boundaries, and an
self-contained Ready issue body or equivalent readiness record.

After installing into a GitHub repo, create the lightweight labels used by issue templates:

```bash
cd /path/to/project
node scripts/setup-github-labels.mjs
```

This creates labels only.

Agents can rebuild the local workflow snapshot when they need a structured view:

```bash
node scripts/refresh-workflow-cache.mjs --repo owner/name
```

The generated `.awk/cache/state.json` is disposable and ignored by git.

## Validation

In an installed project:

```bash
node scripts/validate-workflow.mjs
node scripts/setup-github-labels.mjs --verify-only
```

From the kit repo, prove the install path against a clean temporary repository:

```bash
node scripts/prove-portable-install.mjs
```

## Expected Use In A Project

Plain worker loop:

```text
Agent chat or headless worker in the project
  -> user asks "continue work"
  -> the worker reads GitHub issues, PRs, repo docs, and labels
  -> the worker uses .agents/skills/awk/process/continue-work/SKILL.md to choose the next workflow verb
  -> the worker records process feedback when the workflow itself shows weakness
```

GitHub:

```text
Issues and PRs hold collaboration and audit trail.
Labels provide lightweight issue type and review signals.
PRs hold proposed durable docs or code and review gates.
Repo docs remain the accepted durable truth after review.
```
