---
name: maintain-awk
description: Update, repair, or migrate an existing Agent Workflow Kit install while preserving project-owned AGENTS.md, README.md, docs, code, GitHub issues, and local workflow state.
---

# Maintain AWK

Use this skill when a target repository already has AWK installed and needs an update, repair, or
migration.

## Core Stance

- Preserve project-owned files and project identity.
- AWK updates should be namespaced under `.agents/skills/awk/` and `docs/awk/`.
- Root `AGENTS.md` should contain only the marked AWK usage block plus project-owned guidance.
- Root `README.md` is project-owned and should not be overwritten by AWK.
- Existing GitHub issues, PRs, labels, and project state are workflow state; do not rewrite them
  casually.
- Migrations from older root-level installs should be explicit and reviewable.

## Maintenance Flow

1. Inspect current AWK layout and git status.
2. Identify whether the repo is:
   - current namespaced install;
   - older root-level install;
   - partial/broken install;
   - project without AWK.
3. For older root-level installs, plan a migration:
   - move AWK skills from `.agents/skills/process`, `.agents/skills/specialist`, and
     `.agents/skills/domain` to `.agents/skills/awk/`;
   - move AWK process docs from `docs/development/workflow` and process ADRs to `docs/awk/`;
   - preserve project artifacts in `docs/development/`;
   - reduce root `AGENTS.md` to project-owned guidance plus the marked AWK block.
4. Run the installer or apply a targeted repair.
5. Remove legacy AWK-owned files after replacement:
   - old AWK process skill files under `.agents/skills/process/`;
   - old AWK specialist skill files under `.agents/skills/specialist/`;
   - old AWK workflow docs under `docs/development/workflow/`;
   - old AWK GitHub-first ADR at `docs/development/adrs/github-first-orchestration.md`.
6. Do not delete arbitrary project-owned skills or docs just because they live outside `.agents/skills/awk/`.
7. If the maintenance changes AWK workflow behavior, keep the Agent Workflow Kit source package in sync.
   Promote the same change by cherry-pick or PR when the source package is available, or explicitly
   tell the human that the target repo now differs from the package and needs a source-package sync.
8. Run `node scripts/validate-workflow.mjs`.
9. Verify GitHub label setup when GitHub is available.
10. Report changed files and any required follow-up issues.

## Hard Stops

Stop and ask before:

- deleting project-owned guidance or docs;
- pushing private data;
- rewriting GitHub issues or PRs;
- removing user-authored local changes;
- force-pushing a target repository;
- migrating an ambiguous `AGENTS.md` where AWK-owned and project-owned guidance cannot be separated.

## Loop Stop Conditions

After this step, stop and hand off instead of silently choosing another workflow verb when:

- human decision needed;
- no ready item exists;
- PR is waiting for human merge;
- validation cannot run;
- architecture fork detected;
- next workflow verb changes.

## Output

Return:

```md
## Maintain AWK

Current layout:
Target layout:
Files changed:
Validation:
GitHub labels:
Issues/PRs affected:
Workflow state/template migration:
Blocked:

## Recommended follow-up

## Process feedback
```
