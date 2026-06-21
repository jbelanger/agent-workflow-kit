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
- `pick-next-item`: recommend the next work item.
- `continue-work`: inspect GitHub issues, PRs, and repo docs to choose the next safe workflow step.
- `groom-issue`: turn an unclear work item into a task, spec, ADR, spike, bug, refactor, drop, or defer.
- `discover-vision`: orchestrate high-interaction early discovery for vague product, UX, creative,
  game, platform, or architecture direction before specs.
- `draft-artifact`: draft or update one durable spec, ADR, or spike from groomed direction.
- `review-artifact`: review and accept or reject a durable planning artifact before the next
  workflow stage.
- `breakdown-issue`: decompose accepted direction into independent merge-safe child work items.
- `prepare-implementation`: produce an implementation brief for a ready work item.
- `work-issue-local`: implement one prepared work item locally.
- `review-local-changes`: review the local diff before PR.
- `review-revision-triage`: perform strong architecture-sensitive PR review, revision routing, and
  human-review escalation.
- `improve-workflow`: triage dogfooding feedback and propose concrete process, skill, doc, label, or
  template improvements.

Use other category folders for repeated specialist work when it is not part of the process loop:

- `specialist/`: testing, diagnosis, code-quality, architecture, naming, or refactor skills.
  Product, UX, creative, technical architecture, and validation specialist lenses are advisory and
  should be invoked conditionally by `discover-vision`, not treated as always-on process gates.
- `domain/`: project or business-domain skills with domain-specific vocabulary, records, policies,
  or workflows.

Use `AGENTS.md` for standing rules. Use skills for procedural recipes. Use `docs/development/` for
durable decisions and draft guidance.

## GitHub-First Orchestration

This repository uses GitHub as the active coordination surface:

- GitHub Issues hold work items, discussion, human answers, and current collaboration state.
- GitHub PRs hold proposed durable docs or code changes and their review gates.
- Repo docs under `docs/development/` hold accepted durable truth.

Use `continue-work` when the human asks Codex to infer the next step from visible issue, PR, and
repo-doc state. The orchestrator may recommend issue comments, but it must not silently mutate
scope, accept artifacts, decide architecture, implement code, push, merge, or close work without
an explicit instruction.

## Planning Policy

Use:

- Direct task when the work is clear, bounded, and testable.
- Bug when actual behavior differs from expected behavior.
- Refactor when the change preserves behavior but improves structure.
- Spec when behavior, contracts, records, semantics, or acceptance criteria need agreement.
- Discovery when vague product, UX, creative, game, platform, or architecture direction needs a
  high-level vision before a spec.
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

- Work from one groomed work item at a time.
- Use `draft-artifact` when groomed direction needs a durable spec, ADR, or spike before
  implementation work is shaped.
- Use `breakdown-issue` before implementation when accepted direction must become one or more
  executable child work items.
- Use one branch or worktree per work item.
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

For doc or code changes, `Status = Review` requires a linked GitHub PR that exposes the diff.
Local commits without a PR stay `In Progress`; record the commit and next action in the issue
instead. Issue-only decisions may be reviewed in the issue thread when there is no repo diff to
inspect.

GitHub draft state is not the default workflow holding pen. Open PRs as ready for review when the
branch is pushed, validation has run, and the PR body records issue linkage and current review
state. Use draft only when work is knowingly incomplete, validation is missing, or the PR is exposing
a WIP diff without asking for attention.

A linked PR without a recorded agent review result is not yet a human approval handoff, regardless
of GitHub draft/ready state. Run `review-local-changes`, fix or classify findings, and only then
ask for human merge approval. Review must still escalate architecture ambiguity, ownership drift,
public-surface risk, storage risk, or unclear long-term model concerns before merge.

PR bodies must choose issue linkage intentionally. Use `Closes #issue` only when the PR fully
satisfies the issue acceptance criteria and needs no post-merge reconciliation. Use `Refs #issue`
for initiatives, parent work, partial completion, deferred work, review-triage follow-up,
architecture ambiguity, or uncertainty.

`Review` is a visible handoff, not a demand for heavyweight ceremony on every change. Low-risk
docs, process, or chore PRs may proceed on explicit human approval after validation. Architecture,
ownership, public surface, storage, or unclear model changes still require meaningful human review.
Agents still must not merge.

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

Use `revision-needed` and `needs-human-review` as issue or PR labels. Either agent can force human
review when it detects architecture smell, debt risk, unclear ownership, spec drift, or meaningful
non-trivial disagreement.

## Test-Drive Feedback

This workflow is currently being dogfooded. When a skill or process step is confusing, too heavy,
too loose, unsafe for autonomy, or missing a label/template/state cue, include a brief
`Process feedback` note in the reply, issue comment, or PR summary. Use `improve-workflow` when
asked to turn that feedback into process changes.

## CI Policy

Run deterministic checks before claiming completion:

- Focused tests for touched behavior.
- Affected package build or typecheck.
- Lint and formatting where configured.
- Architecture or import-boundary checks where configured.
- Project-specific validation commands from the issue.

Codex-in-CI is deferred until the local skills loop is stable and the security, prompt-injection,
trigger, and API-key boundaries are explicit.
