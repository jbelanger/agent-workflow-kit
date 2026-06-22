# Investor Review Bootstrap Dogfood

Date: 2026-06-22
Target remote: private repo `jbelanger/investor-review`
Target local checkout: `/Users/joel/Dev/investor-review-bootstrap`
Preserved previous failed-run checkout: `/Users/joel/Dev/investor-review`
Supervisor: main Codex thread
Delegated worker: Pauli (`019eefbb-abce-7e13-ae72-8a4207b4c05c`)

## Purpose

Restart the investor-review dogfood run with the stabilized AWK flow:

1. create a fresh pushed repo;
2. install AWK under `.agents/skills/awk/` and `docs/awk/`;
3. preserve project-owned `README.md` and `AGENTS.md`;
4. create labels;
5. create GitHub issues from the detailed plan before any coding;
6. stop before implementation.

The canonical local path `/Users/joel/Dev/investor-review` was already occupied by the earlier
failed run with uncommitted implementation work. The new local checkout used
`/Users/joel/Dev/investor-review-bootstrap` while the GitHub repo used the canonical
`jbelanger/investor-review` name.

## Flow

```mermaid
flowchart TD
  A["Supervisor checks source planning docs"] --> B["Supervisor delegates init-awk restart"]
  B --> C["Worker creates sanitized project baseline"]
  C --> D["Worker creates private GitHub repo jbelanger/investor-review"]
  D --> E["Worker pushes baseline"]
  E --> F["Worker installs AWK"]
  F --> G["Worker pushes AWK install"]
  G --> H["Worker creates/validates labels"]
  H --> I["Worker creates parent + child GitHub issues"]
  I --> J["Supervisor inspects repo, issues, PRs, validation, sanitization"]
  J --> K["Supervisor promotes process feedback into source kit"]
  K --> L["Supervisor pushes small installed-doc correction to target"]
```

## Target Commits

Pushed to `jbelanger/investor-review`:

- `42314ff` Initialize sanitized investor review planning baseline
- `1b52588` Install Agent Workflow Kit
- `ad216ce` Clarify development docs ownership
- `56f4fbc` Apply UX gate and lazy artifact folders

The final commit was a supervisor-applied install-artifact correction after the worker noticed that
the installed `docs/development/README.md` still sounded source-package-specific.
The later `56f4fbc` commit applied the source-kit UX readiness gate and removed unused
`docs/development/*/.gitkeep` placeholders from the target.

## Validation

Target validation:

- `node scripts/validate-workflow.mjs`: passed
- `node scripts/setup-github-labels.mjs --verify-only`: passed
- `git diff --check HEAD`: passed before the supervisor correction commit

Supervisor verification:

- remote repo is private
- branch `main` is pushed
- local target worktree is clean after the correction commit
- no PRs exist
- no coding branches exist
- no source code, app scaffold, fixtures, or implementation files were created
- AWK skills are under `.agents/skills/awk/`
- AWK process docs are under `docs/awk/`
- project-owned durable docs are under `docs/development/`

## Sanitization

The worker created only sanitized planning docs:

- `docs/development/product-brief.md`
- `docs/development/architecture-brief.md`
- `docs/development/domain-language.md`
- `docs/development/walking-skeleton-plan.md`
- `docs/development/sanitization-notes.md`

The supervisor privacy scan found safety/privacy-boundary language and generic domain vocabulary,
but no copied holdings exports, trade files, raw/processed CSVs, account values, position sizes, or
ticker-level holdings lists.

## Issue Bootstrap

The worker created six initial issues before implementation:

| Issue | Type | Next workflow verb | Quality notes |
| --- | --- | --- | --- |
| `#1 Initialize investor review walking skeleton from sanitized plan` | Initiative | `review-artifact` | Parent issue. Explicitly says the plan is detailed enough for artifact review, not implementation. |
| `#2 Review sanitized planning artifacts for first workflow pass` | Spec/artifact review | `review-artifact` | Reviews imported docs as the authoritative starting artifact set. |
| `#3 Review ADR direction for local-first Python contract spine` | ADR | `review-artifact` | Reviews architecture direction before breakdown. |
| `#4 Review spec scope for first contracts and sanitized fixture` | Spec | `review-artifact` | Reviews minimum contract/fixture semantics before breakdown. |
| `#5 Break down the first walking skeleton into prepared task candidates` | Task | `breakdown-issue` | Blocked on artifact/ADR/spec/UX review; does not route to implementation. |
| `#6 Prepare implementation brief for the first approved skeleton task` | Task | `prepare-implementation` | Blocked on breakdown and UX readiness for any UI-bearing work; does not route to implementation. |
| `#7 Define UX direction for the first investor review workflow` | Discovery | `discover-vision` | Added after bootstrap when the user pointed out that a UI-bearing product needs UX direction before coding. |

```mermaid
flowchart LR
  I1["#1 Initiative"] --> I2["#2 Artifact review"]
  I1 --> I3["#3 ADR review"]
  I1 --> I4["#4 Spec review"]
  I2 --> I5["#5 Breakdown"]
  I3 --> I5
  I4 --> I5
  I7["#7 UX direction"] --> I5
  I5 --> I6["#6 Prepare implementation"]
  I2 --> R["review-artifact"]
  I3 --> R
  I4 --> R
  I7 --> D["discover-vision"]
  I5 --> B["breakdown-issue"]
  I6 --> P["prepare-implementation"]
```

## What Went Well

- The worker did not start coding.
- The worker created durable GitHub issues before implementation.
- The issue surface reflects the detailed-plan path rather than vague-idea discovery.
- The first executable task path is intentionally gated: review artifacts, then breakdown, then
  prepare implementation.
- The previous failed local checkout was preserved.
- The remote has the intended canonical name `investor-review`.
- A UX gate was added before breakdown/preparation because the product will have a UI.

## What Was Weak

- Installed `.github/ISSUE_TEMPLATE/config.yml` had an extra trailing blank line that triggered
  `git diff --check` in the target. The worker fixed it locally.
- Installed `docs/development/README.md` still used source-package wording that mentioned
  `kit/AGENTS.md` and `kit/.agents/skills/awk/`, which is confusing inside a target repo.
- The installer created empty `docs/development/{adrs,discovery,specs,spikes}` folders via
  `.gitkeep`, even though those folders should exist only after real project artifacts exist.
- The first issue surface did not initially include a UX-direction gate, even though the product is
  expected to have a UI.

## Lessons Promoted

Promoted back into the source kit during this run:

- Removed the extra blank line from `.github/ISSUE_TEMPLATE/config.yml`.
- Reworded `docs/development/README.md` so it works in both target projects and the AWK source repo.
- Pushed the corrected `docs/development/README.md` to the target repo as commit `ad216ce`.
- Removed empty development artifact folder creation from the installer and validation contract.
- Added a proportional UX readiness gate for UI-bearing work to the workflow docs and implementation
  readiness skills.
- Added issue `#7` and comments on `#1`, `#5`, and `#6` so future agents know UX direction gates
  any UI-bearing implementation.

## Current State

The investor-review repo is ready for the next supervised dogfood step. The next natural route is
`review-artifact` on issue `#2`, followed by `#3` and `#4`, `discover-vision` on `#7`, then
`breakdown-issue` on `#5`.
