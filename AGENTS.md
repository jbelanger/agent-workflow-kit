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

Local skills live under `.agents/skills/<category>/<skill-name>/SKILL.md`. Category folders group
skills by purpose; invoke skills by their frontmatter `name`, not by path.

Use `process/` skills for repeated workflow work:

- `triage-backlog`: classify backlog health and next actions.
- `pick-next-item`: recommend the next issue.
- `groom-issue`: turn an unclear issue into a task, spec, ADR, spike, bug, refactor, drop, or defer.
- `breakdown-issue`: decompose accepted direction into independent merge-safe tasks.
- `prepare-implementation`: produce an implementation brief for a ready issue.
- `work-issue-local`: implement one prepared issue locally.
- `review-local-changes`: review the local diff before PR.
- `review-revision-triage`: perform strong architecture-sensitive PR review, revision routing, and
  human-review escalation.
- `improve-workflow`: triage dogfooding feedback and propose concrete process, skill, doc, label, or
  board improvements.

Use other category folders for repeated specialist work when it is not part of the process loop:

- `specialist/`: code-quality, architecture, naming, or refactor skills.
- `domain/`: project or business-domain skills with domain-specific vocabulary, records, policies,
  or workflows.

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
- Use `breakdown-issue` before implementation when accepted direction must become one or more
  executable tasks.
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

Use `revision-needed` and `needs-human-review` as labels or field signals, not required board
statuses. Either agent can force human review when it detects architecture smell, debt risk, unclear
ownership, spec drift, or meaningful non-trivial disagreement.

## Test-Drive Feedback

This workflow is currently being dogfooded. When a skill or process step is confusing, too heavy,
too loose, unsafe for autonomy, or missing a field/status/label, include a brief `Process feedback`
note in the reply, issue comment, or PR summary. Use `improve-workflow` when asked to turn that
feedback into process changes.

## CI Policy

Run deterministic checks before claiming completion:

- Focused tests for touched behavior.
- Affected package build or typecheck.
- Lint and formatting where configured.
- Architecture or import-boundary checks where configured.
- Project-specific validation commands from the issue.

Codex-in-CI is deferred until the local skills loop is stable and the security, prompt-injection,
trigger, and API-key boundaries are explicit.
