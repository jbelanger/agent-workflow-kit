# Development Docs

This folder is the single-repo home for durable development artifacts that should guide future
implementation, review, and agent behavior.

Use this area for discovery bundles, specs, ADRs, spike writeups worth preserving, workflow rules,
and repo-local work items only when GitHub is unavailable. GitHub issues and PRs hold active
collaboration state; promote accepted durable truth into this folder.

This folder is intentionally separate from user-facing docs. Exclude it from published documentation
or packaged artifacts when end users should not see internal development material.

## Standard Folders

- `work-items/`: optional portable planning records when GitHub issues are absent.
- `discovery/`: early product, UX, creative, platform, or architecture vision bundles.
- `specs/`: accepted or draft behavior, contract, and user-visible semantics specs.
- `adrs/`: durable architecture, storage, public-surface, boundary, or workflow-policy decisions.
- `spikes/`: preserved investigation outputs whose evidence is still useful.
- `workflow/`: process, issue/PR coordination, CI, review, and delivery-loop documentation.

Installable `AGENTS.md` guidance lives at `kit/AGENTS.md`. Installable local Codex skills live under
`kit/.agents/skills/`. Keeping them under `kit/` prevents this source repo from accidentally using
the workflow it is packaging as its own active operating loop.

Skill category folders are navigation only; each skill still owns its own `SKILL.md` instructions.
