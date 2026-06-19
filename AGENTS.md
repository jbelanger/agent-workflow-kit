# AGENTS.md

This is the installed repository guidance for local Codex work in this repo.

## Local Codex Workflow

This repository uses local-first Codex by default.

Codex may:

- Inspect the repository and linked issues using available local tools.
- Propose plans, specs, ADRs, spikes, and implementation briefs.
- Edit code or durable docs when explicitly asked.
- Create or use a local branch or worktree when asked to implement.
- Run validation commands.

Codex must not:

- Merge.
- Silently expand scope.
- Silently choose architecture direction.
- Hide uncertainty.
- Preserve compatibility shims by default.
- Create untracked technical debt.
- Assume Codex-in-CI is part of the baseline workflow.

## Core Rule

Agents may execute prepared work.
Agents may propose architecture.
Agents may not silently decide architecture.
Agents may not expand scope.
Agents may not merge.
Agents may not hide uncertainty.

## Skill Routing

Use local skills for repeated workflows:

- `triage-backlog`: classify backlog health and next actions.
- `pick-next-item`: recommend the next issue.
- `groom-issue`: turn an unclear issue into a task, spec, ADR, spike, bug, refactor, drop, or defer.
- `prepare-implementation`: produce an implementation brief for a ready issue.
- `work-issue-local`: implement one prepared issue locally.
- `review-local-changes`: review the local diff before PR.

Use `AGENTS.md` for standing rules. Use skills for procedural recipes. Use `docs/development/` for
durable decisions and draft guidance.

## Planning Policy

Use:

- Direct task when the work is clear, bounded, and testable.
- Bug when actual behavior differs from expected behavior.
- Refactor when the change preserves behavior but improves structure.
- Spec when behavior, contracts, records, semantics, or acceptance criteria need agreement.
- ADR when architecture direction, ownership, storage, public surface, or operating policy changes.
- Spike when evidence is missing and production work would otherwise guess.

Ask one clarification question at a time. Include options, a recommendation, and why the answer
matters.

## Human Decision Required

Stop and ask before:

- Changing public APIs.
- Changing ownership boundaries.
- Adding compatibility layers.
- Introducing storage or migration changes.
- Creating long-term abstractions.
- Choosing between real architecture forks.

Explain architecture forks in simple operational terms. Prefer a compact table or diagram when that
makes the decision easier.

## Implementation Policy

- Work from one groomed issue at a time.
- Use one branch or worktree per issue.
- Keep slices narrow and reviewable.
- Prefer the simplest model that stays honest.
- Do not keep overlapping truths alive to avoid a harder boundary decision.
- Do not add compatibility bridges, aliases, fallback paths, or migration shims by default in
  pre-ship projects.
- Temporary bridges are allowed only when explicitly necessary, named, bounded, and given a removal
  condition.
- Stop and restate the roadmap when work crosses multiple migration axes or the model becomes fuzzy.

Cheap or minimal passes are prohibited when they affect architecture, ownership, contracts, storage,
public surface, or long-term model clarity.

## Review Policy

Treat review feedback as evidence, not commands.

Classify meaningful feedback as:

- Accepted.
- Conditional.
- Deferred.
- Rejected.
- Taste-only.

Review local changes before PR. Challenge architecture direction before ordinary findings:

- Did the implementation preserve the intended boundary?
- Did it add avoidable public surface or duplicated truths?
- Did it choose a cheap/minimal pass that worsens the architecture?
- Is there a cleaner model that should be used before merge?

## CI Policy

Run deterministic checks before claiming completion:

- Focused tests for touched behavior.
- Affected package build or typecheck.
- Lint and formatting where configured.
- Architecture or import-boundary checks where configured.
- Project-specific validation commands from the issue.

Codex-in-CI is deferred until the local skills loop is stable and the security, prompt-injection,
trigger, and API-key boundaries are explicit.
