# AI-Oriented Development Workflow

Status: local-skills baseline draft

This repository is the working home for the workflow. Earlier planning notes from other repositories
are source material only; durable decisions for this kit now belong here.

The baseline sentence:

> This project uses local Codex skills to manage planning, grooming, implementation preparation,
> local execution, and pre-PR review. CI remains deterministic. Humans own architecture and merge
> decisions.

The goal is to make AI-assisted work small, reviewable, architecture-safe, and auditable without
making Codex-in-CI, Codex Cloud, automation, or subagents the center of the system.

## Operating Surfaces

Use the smallest surface that matches the job:

- `AGENTS.md`: standing repository rules, quality bar, validation expectations, and boundaries.
- `.agents/skills/`: installed local workflows that Codex can invoke repeatedly.
- `docs/development/`: durable decisions, workflow docs, specs, ADRs, spike writeups, and draft
  workflow guidance.
- GitHub issues and PRs: current planning, discussion, review, and audit trail.
- CI: deterministic checks only, such as tests, typecheck, lint, formatting, build, and architecture
  checks.

In this repository, the local skills live under `.agents/skills/`.

## Non-Goals For Now

Do not make the baseline depend on:

- Codex Cloud.
- Codex-in-CI review, labels, status changes, or merge gates.
- Automatic issue or project-board state transitions.
- Subagents as a default workflow requirement.
- Plugin packaging.
- Large board schemas.

Those may become later capabilities, but only after the local skills loop is reliable.

## Core Rule

```text
Agents may execute prepared work.
Agents may propose architecture.
Agents may not silently decide architecture.
Agents may not expand scope.
Agents may not merge.
Agents may not hide uncertainty.
```

## Local Skill Set

Start with three planning skills:

| Skill | Purpose | May edit code? |
| --- | --- | --- |
| `triage-backlog` | Review open issues and classify what needs attention. | No |
| `pick-next-item` | Recommend the best next issue based on readiness, risk, dependencies, and value. | No |
| `groom-issue` | Turn a vague issue into a direct task, spec, ADR, spike, bug, refactor, drop, or defer. | No |

Add implementation skills after the planning loop feels useful:

| Skill | Purpose | May edit code? |
| --- | --- | --- |
| `prepare-implementation` | Convert a ready issue into an implementation brief. | Docs/issues only when asked |
| `work-issue-local` | Implement one prepared issue in a local branch or worktree. | Yes |
| `review-local-changes` | Review the local diff before pushing or opening a PR. | No, unless explicitly asked to fix |

Do not create one mega-skill for the whole workflow. Skills should match the verbs people actually
say.

## Workflow

### 1. Triage Backlog

Use `triage-backlog` when the human asks to triage, clean up issues, or find what needs attention.

The output should group issues into:

- Ready.
- Needs grooming.
- Needs spec.
- Needs ADR.
- Needs spike.
- Blocked.
- Stale, duplicate, or unclear.
- Human-only decision.

Triage recommends next actions. It does not implement anything.

### 2. Pick Next Item

Use `pick-next-item` when the human asks what to work on next.

Prefer work that is:

- Ready or nearly ready.
- Small enough for one local Codex session.
- Valuable to the current direction.
- Low merge-risk unless foundational work is intentional.
- Not blocked by missing decisions.
- Unlikely to cause architecture drift.

The output names the recommended issue, why it wins, why plausible alternatives are not first, the
risk, and the suggested next mode.

### 3. Groom Issue

Use `groom-issue` when an issue or idea is unclear.

Grooming answers:

- What problem are we solving operationally?
- What is already true?
- What is missing?
- Which source docs or code are authoritative?
- What is explicitly out of scope?
- Which ownership boundary is involved?
- What architecture risks exist?
- Is this parallel-safe, needs coordination, or serial only?

Choose the smallest useful output:

- Direct task when the work is clear, bounded, and testable.
- Bug when actual behavior differs from expected behavior.
- Refactor when the goal is behavior-preserving structure.
- Spec when behavior, contracts, records, user-visible semantics, or acceptance criteria need to be
  settled.
- ADR when architecture direction, ownership, storage, public surface, or operating policy changes.
- Spike when evidence is missing and production work would otherwise guess.
- Drop or defer when the work should not move now.

Ask one clarification question at a time. Include options, a recommendation, and why the answer
matters.

### 4. Prepare Implementation

Use `prepare-implementation` only after the issue is ready enough to execute.

The brief should contain:

- Goal.
- Non-goals.
- Source docs.
- Allowed files or directories.
- Forbidden files or directories.
- Architecture boundary.
- Public surfaces, contracts, storage, or cross-module behavior touched.
- Acceptance criteria.
- Required tests.
- Validation command.
- Required PR summary sections.

If the issue is not ready, return it to grooming instead of guessing.

### 5. Work Issue Locally

Use `work-issue-local` when the human explicitly asks Codex to implement.

Rules:

- One issue.
- One branch or worktree.
- One PR.
- No scope expansion.
- No merge.
- Stop for architecture forks.
- Ask before changing public APIs, ownership boundaries, storage shape, migration policy, or
  long-term abstractions.

Implementation agents may choose local mechanics. Humans decide product direction, architecture
direction, public contracts, and merge approval.

### 6. Review Local Changes

Use `review-local-changes` before pushing or opening a PR.

Review should lead with:

- Blocking issues.
- Architecture concerns.
- Test gaps.
- Naming issues.
- Scope drift.
- Suggested fixes.
- Taste-only notes.

Treat review feedback as evidence, not commands. Accepted fixes can be implemented in a separate
revision pass or by explicitly asking `work-issue-local` to address them.

### 7. PR And Merge

Open a PR when the local branch is ready for review. The PR should summarize:

- What changed.
- Which issue it addresses.
- Scope in and out.
- Contracts or APIs touched.
- Validation run.
- Decisions, smells, and deferred items.
- Review triage, when applicable.

Only the human merges. Squash merge is the default.

## Architecture Direction Gate

Challenge architecture before implementation and again before review when the change touches
foundation, ownership, contracts, storage, public surface, or long-term model clarity.

Ask:

- What is the intended model?
- Which ownership boundary is involved?
- What public surface, contract, or storage shape changes?
- What simpler option was rejected, and why?
- Is there a real architecture fork?

If there is a real fork, stop and ask the human. Explain the options in simple operational terms,
assuming they have not looked at the code recently. Use a compact table or diagram when useful.

Cheap or minimal passes are prohibited when they make the architecture worse.

## Development Docs Policy

Use a single repository by default. Keep durable development artifacts under `docs/development/`:

```text
docs/development/
  specs/
  adrs/
  spikes/
  workflow/
```

Scratch planning belongs in issues, PR discussion, or temporary working notes. Promote it into
`docs/development/` only when it should guide future implementation, review, or agent behavior.

Development docs are separate from user-facing docs. Exclude them from published artifacts when end
users should not see internal development material.

## Ready And Done

An issue is ready for implementation when it has:

1. Goal.
2. Non-goals.
3. Relevant source docs or code.
4. Owned area or module.
5. Acceptance criteria.
6. Expected tests.
7. Validation command.
8. Merge-risk classification.
9. Human decisions resolved, or clearly marked as required.

An implementation is done when:

- The requested behavior exists.
- Focused validation has run, or the blocker is explicit.
- Architecture boundaries still hold.
- Durable docs are updated when behavior, contracts, architecture, or accepted decisions changed.
- Review feedback is triaged rather than blindly applied.
- Deferred debt has an owner, boundary, and removal condition.

## Minimal Board Model

Keep board state light:

- `Backlog`.
- `Grooming`.
- `Ready`.
- `In Progress`.
- `In Review`.
- `Blocked`.
- `Complete`.

Use labels or issue fields for `Spec`, `ADR`, `Spike`, `Task`, `Bug`, `Refactor`, `Human Only`,
`Needs Source Evidence`, and merge risk. Do not add `Revision Needed` as a required baseline state
yet; revision work can live in the PR discussion or move the issue back to `In Progress`.

## CI Policy

CI should stay deterministic:

- Tests.
- Typecheck.
- Lint.
- Formatting.
- Build.
- Architecture or import-boundary checks.
- Issue-link or PR-template checks, when useful.

Codex-in-CI is deferred. It can be revisited later as an advisory review or gate after the local
skills loop has proved useful and the security, prompt-injection, trigger, and API-key boundaries
are explicit.

## Later Capabilities

Revisit these only after the local workflow is stable:

- Hardening the installed skills after dogfooding.
- Packaging skills as a plugin.
- Codex-in-CI advisory review.
- Structured issue or board automation.
- Subagent workflows.
- More detailed spec, ADR, and spike templates.
