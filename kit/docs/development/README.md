# Development Docs

This folder is the single-repo home for durable development artifacts that should guide future
implementation, review, and agent behavior.

Use this area for discovery bundles, specs, ADRs, spike writeups worth preserving, project-specific
workflow notes, and repo-local work items only when GitHub is unavailable. GitHub issues and PRs
hold active collaboration state; promote accepted durable truth into this folder.

This folder is intentionally separate from user-facing docs. Exclude it from published documentation
or packaged artifacts when end users should not see internal development material.

## Standard Folders

- `work-items/`: optional portable planning records when GitHub issues are absent.
- `discovery/`: early product, UX, creative, platform, or architecture vision bundles.
- `specs/`: accepted or draft behavior, contract, and user-visible semantics specs.
- `adrs/`: durable architecture, storage, public-surface, boundary, or workflow-policy decisions.
- `spikes/`: preserved investigation outputs whose evidence is still useful.
- `workflow/`: project-specific process notes when they are not part of the installable AWK docs.
- `dogfood-runs/`: recorded workflow trials, outcomes, visuals, and lessons.

Create these folders only when they contain real project artifacts. Do not keep empty artifact
folders just to advertise the workflow shape.

Visual discovery aids, sample assets, screenshots, wireframes, or mockups may live inside the
artifact bundle they support, for example `discovery/<slug>/mockups/` or a sibling
`specs/<slug>-assets/` folder. Mark generated visuals as review aids, not production assets, until
the human accepts them.

AWK process docs live under `docs/awk/` and AWK skills live under `.agents/skills/awk/`. Keeping AWK
process assets outside this folder leaves `docs/development/` focused on project-owned durable
truth.

Skill category folders are navigation only; each skill still owns its own `SKILL.md` instructions.
