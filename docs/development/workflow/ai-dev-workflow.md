# AI-Oriented Development Workflow

Status: draft for discussion

This document defines a generic AI-assisted development workflow. It is intentionally project-neutral.
Specific projects can later add their own overlay for domain language, architecture rules, release
constraints, and validation commands.

The goal is to make AI-assisted work small, reviewable, architecture-safe, and auditable before any
agent writes production code.

## Current Decisions

The review drafts for the adapted skills and future agent instructions live in
`docs/development/agents/`. They are not installed behavior yet; they are the current review surface
for the v2 workflow.

- Use a local-first Codex workflow by default. Codex Cloud is not part of the baseline loop.
- Use model-controlled local agents, with GPT-5.5 as the expected primary model when available.
- CI should run deterministic checks first: tests, lint, typecheck, build, formatting, architecture
  checks, PR-template checks, and issue-link checks.
- Codex-in-CI may run a detailed review with a custom prompt. It should report actionable findings
  across correctness, architecture direction, consistency, test gaps, cleanup, and naming. It should
  not be limited to P0/P1 findings.
- Codex-in-CI may auto-label or auto-state a PR as `revision-needed` when it finds actionable
  review items, but it does not decide which items are accepted.
- Add a `Revision Needed` state between `In Review` and `In Progress` for PRs that need another
  implementation pass.
- Revision agents use review triage: verify review claims against the code, challenge weak feedback,
  implement what is good, reject what is not justified, and defer only with an explicit owner,
  boundary, and removal condition.
- Detailed review triage belongs on the PR. The linked issue gets a short operational status update.
- Deferred review items require human confirmation before the PR returns to `In Review`, unless a
  linked follow-up issue records the owner, boundary, and removal condition.
- Challenge architecture direction twice: before implementation and again during PR review.
- When the agent finds a real architecture fork, the human decides. The agent must explain the fork
  in simple terms, with a visual or structured comparison when useful, assuming the human has not
  looked at the code recently.
- When grooming shows that a vague issue needs a spec, convert the current issue into a `Spec`
  issue rather than creating a parallel issue by default. Set the spec state to `Draft` and start
  clarification there.
- A converted spec issue stays in `Grooming` while the agent is asking clarification questions. Move
  it to `In Progress` only once the agent has enough answers to draft the spec. Use `Blocked` only
  for a real unresolved dependency or decision, not for normal clarification.
- Spec state is separate from board status. Use `Draft`, `Accepted`, `Implemented`, or `Superseded`
  to show whether the spec is proposed intent, approved implementation target, merged reality, or
  replaced by a newer decision.
- Use a single repository by default. Keep durable development artifacts under `docs/development/`
  with clear subfolders for specs, ADRs, spikes, workflow, and agent guidance.
- Standardize `docs/development/specs/`, `docs/development/adrs/`, `docs/development/spikes/`,
  `docs/development/workflow/`, and `docs/development/agents/`.
- When a draft spec is ready for acceptance, open or update a PR against the spec document under
  `docs/development/`. Human review of that PR is the acceptance mechanism.
- Cheap or minimal passes are prohibited when they affect architecture, ownership, contracts,
  storage, public surface, or long-term model clarity.
- Parallel work should avoid two agents changing exactly the same owned module at the same time.
  Shared utilities are allowed when necessary, but shared utility changes that become architectural
  must be promoted to explicit coordination or human decision.
- Scratch planning belongs in issues and PR discussion. Durable specs, ADRs, architecture rules,
  workflow rules, and agent-facing validation guidance belong in `docs/development/`.

## Core Model

Use a GitHub-native planning and delivery loop:

```text
Groom
  -> spec / ADR / spike
  -> Initiative issue
  -> decomposed sub-issues
  -> one agent, one issue, one branch/worktree, one PR
  -> agent review
  -> human architecture review
  -> optional refactor pass
  -> squash merge
```

The core rule:

```text
Agents may execute prepared work.
Agents may propose architecture.
Agents may not silently decide architecture.
Agents may not expand scope.
Agents may not merge.
Agents may not hide uncertainty.
```

## Repository And Docs

Use a single repository by default. A separate planning repository is only needed when there is a
strong reason, such as sensitive product planning, non-code stakeholders who should not have repo
access, or planning material that should not be cloned with the implementation.

### Development Docs

The repository may contain a clearly identified development-docs area:

```text
docs/development/
  specs/
  adrs/
  spikes/
  workflow/
  agents/
```

This is not ugly from an end-user perspective when it is clearly named. It is a normal engineering
area, separate from user-facing docs, and it keeps implementation, specs, review rules, and agent
context in one auditable history.

`docs/development/` owns durable development context:

- Roadmaps.
- Product plans.
- Architecture notes.
- Specs.
- ADRs.
- Spike writeups.
- Issue drafts.
- Review summaries.
- Cross-issue decisions.
- Workflow documentation.
- Agent guidance drafts.

Scratch planning should stay in GitHub issues, PR comments, or temporary working notes. Once a
decision stabilizes and should guide future implementation or agents, promote it into
`docs/development/`.

Accepted specs and ADRs are durable planning records. They may be superseded or replaced, but they
are not disposable scratch artifacts. Spike notes are disposable evidence unless their findings are
promoted into a spec, ADR, issue, or project overlay.

### Shipped Product Surface

The rest of the repository owns shipped work:

- Product code.
- Tests.
- CI and quality gates.
- User-facing docs.
- Released technical docs.

Development docs must be clearly separated from user-facing docs. If packaging, publishing, or a
documentation site would expose `docs/development/` to end users, exclude that folder from the
published artifact instead of splitting repositories by default.

## Roles

### Human Owner

Owns product intent, architecture standards, merge approval, and final judgment on tradeoffs.

The human should focus on:

- Choosing product direction.
- Approving contract shapes and public surfaces.
- Deciding when an issue is ready for autonomous work.
- Reviewing architecture, naming, and scope control.
- Deciding whether a refactor pass is needed before merge.

### Primary Model

Default role: planning partner, spec writer, task decomposer, implementation agent, and architecture
review assistant.

The primary model should:

- Explain concepts clearly enough that the human can approve direction without reading every linked
  document.
- Separate facts, assumptions, decisions, and open questions.
- Make tradeoffs concrete.
- Avoid treating its first design as settled architecture.

### Secondary Model

Default role: adversarial reviewer or isolated secondary implementer.

Good uses:

- PR review.
- Edge-case search.
- Test-gap review.
- Naming/readability critique.
- Architecture pressure test.
- Second-opinion implementation only when the issue is isolated.

Review agents should comment first. They should only push commits when the PR is explicitly assigned
for agent fixes.

## Lifecycle

### 1. Groom

Grooming is done by the human plus the primary model. The goal is to turn a vague desire into a
small, verifiable work item.

Grooming must answer:

- What problem are we solving operationally?
- Which source docs are authoritative?
- What is already true today?
- What is missing?
- Which ownership boundary is involved?
- What is explicitly out of scope?
- Does this need a spec, ADR, spike, or direct task?
- Is the task parallel-safe or serial?

Grooming ends by choosing one next output:

- Direct breakdown.
- Spec needed.
- ADR needed.
- Spike needed.
- Drop.
- Defer to backlog.

If the model cannot explain the work simply, grooming is not complete.

When grooming determines that the current issue needs a spec, ADR, spike, or direct task, update the
current issue instead of creating a parallel planning issue by default. For a spec:

- Change `Issue Type` to `Spec`.
- Set spec state to `Draft`.
- Keep the issue in `Grooming` while asking clarification questions.
- Move it to `In Progress` once the agent has enough answers to draft the spec.
- Use `Blocked` only when progress depends on a real unresolved decision, missing access, or external
  dependency.
- Ask one clarification question at a time, with options, a recommendation, and the reason.
- Explain concepts in simple operational terms, assuming the human has not looked at the code
  recently.
- Use a compact diagram, table, or before/after flow when it makes a decision easier.
- Do not create implementation child issues until the spec is accepted.

### 2. Prepare Spec, ADR, Spike, Or Direct Task

Use a spec when behavior, contracts, or user-visible semantics need to be implemented.

Use an ADR when a decision changes direction, public boundaries, storage shape, or operating policy.

Use a spike when evidence is missing and production work would otherwise guess.

Use a direct task only when the desired change is already clear, bounded, and testable.

Specs describe accepted intent, not only finalized work. A spec may be:

- `Draft`: proposed behavior or contract; not authoritative for autonomous implementation.
- `Accepted`: human-approved target for implementation.
- `Implemented`: merged code matches the accepted spec.
- `Superseded`: a newer spec or ADR replaced this one.

Accepted specs and ADRs become source documents for task breakdown and review. If implementation
changes the behavior, contract, or decision they describe, updating those documents is part of the
work, not a separate cleanup.

While a spec, ADR, or spike is being written, its issue can use `In Progress`. Once accepted, mark it
`Complete` if the artifact is the final output, or move it to `Breakdown` if it must produce
implementation issues.

When specs live in the repo, acceptance happens through a PR:

1. The converted `Spec` issue owns clarification and discussion.
2. The agent creates or updates a spec document under `docs/development/specs/`.
3. The spec PR records the draft behavior, source evidence, non-goals, architecture implications,
   and acceptance criteria.
4. Human review accepts the spec by approving the PR and ensuring the spec state is `Accepted`.
5. After merge, the issue moves to `Breakdown` when implementation tasks are needed, or `Complete`
   when the spec was the final deliverable.

### 3. Breakdown

Breakdown turns accepted specs, ADRs, spikes, or direct grooming decisions into executable issues.
Create an `Initiative` issue for the outcome when useful, then split it into independent child
issues.

Each sub-issue should be small enough for one agent in one branch/worktree. If it is not, groom it
again.

Good sub-issues have:

- One owned area or module.
- Clear allowed files.
- Clear forbidden files.
- Concrete tests.
- Acceptance criteria.
- Merge-risk classification.

### 4. Assign Agent Work

Each implementation agent gets:

- One issue.
- One branch or worktree.
- One PR.

The issue must be ready before assignment. Implementation agents should not rediscover the
architecture from scratch unless the task is explicitly an investigation.

### 5. Review

Review has three layers:

- CI and automated checks.
- Agent review for bugs, gaps, naming drift, and scope drift.
- Human architecture review.

Move work to review when the author believes it is ready. If a PR exists but CI is red or the branch
is unfinished, it is still in progress. PR review states such as changes requested or approved should
remain on the PR instead of becoming duplicate board statuses. Treat external and model review
feedback as evidence, not commands. Every meaningful review item is classified as accepted,
conditional, deferred, rejected, or taste-only.

Review must also challenge the implementation direction before normal findings:

- Did the implementation preserve the intended ownership boundary?
- Did it add public surface, compatibility shims, bridge APIs, duplicated truths, or migration debt to
  avoid a harder design choice?
- Did it choose a cheap/minimal pass that makes the architecture worse even if tests pass?
- Is there a cleaner model that should have been used before this PR can merge?

If the answer reveals a real architecture fork, move the work to `Blocked` or keep it in
`Revision Needed` until the human chooses the direction.

### 6. Refactor Pass

If the implementation works but the structure is not good enough, open or continue a refactor pass
before merge.

The refactor pass should have an explicit goal:

- Clarify ownership.
- Reduce public surface.
- Improve names.
- Align sibling patterns.
- Remove transitional debt.
- Tighten tests or architecture boundaries.

Do not hide refactor needs behind "follow-up later" when they affect foundation, contracts, or public
surface.

### 7. Merge

Only merge when:

- The issue acceptance criteria are met.
- Required checks pass.
- Review conversations are resolved.
- The PR summary records validation and decisions.
- Any transitional debt has an owner, boundary, and removal condition.
- The human approves.

Use squash merge by default so main keeps a readable history.

## Board

Core fields:

| Field | Description | When to use |
| --- | --- | --- |
| `Status` | The coarse workflow state for the issue. | Always. This drives the board columns or grouping. |
| `Issue Type` | The kind of work or artifact represented by the issue. | Always. This separates durable planning artifacts, executable work, defects, refactors, and grouping issues. |
| `Area` | The affected product, architecture, or code area. | Use for filtering, ownership boundaries, and avoiding parallel work in the same area. |
| `Merge Risk` | Coordination risk if the issue is implemented in parallel. | Use before assigning work to agents or running multiple branches at once. |

Optional fields or labels:

| Field / Label | Description | When to use |
| --- | --- | --- |
| `Needs Human Decision` | Progress depends on a human choice. | Use when the model can frame options but should not choose the direction. |
| `Needs Source Evidence` | Progress depends on reading docs, code, logs, or external evidence. | Use when claims need verification before planning or implementation. |
| `Human Only` | The issue should not be autonomously executed by an agent. | Use for sensitive decisions, subjective product calls, credentials, finance/legal/privacy judgment, or merge approval. |
| `Deferred` | The item is intentionally not now. | Use on backlog items that should be retained but not actively moved through the board. |
| `Target Phase` | The milestone, release, or project phase the issue belongs to. | Add only when multiple phases are active and phase filtering is useful. |
| `Estimate / Budget` | A rough size, cost, or time budget. | Add only when planning or agent-cost control needs it; keep it coarse until better data exists. |

Recommended statuses:

| Status | Description | When to use |
| --- | --- | --- |
| `Backlog` | Captured but not currently moving. | Use for ideas, future work, deferred items, and work not yet selected for grooming. |
| `Grooming` | The issue is being clarified and classified. | Use while deciding whether it needs a spec, ADR, spike, direct breakdown, drop, or deferral. |
| `Breakdown` | An accepted direction is being turned into executable issues. | Use after grooming, spec, ADR, or spike output is accepted but before implementation-ready issues exist. |
| `Ready` | The issue is scoped and can be picked up. | Use when the issue has enough context, acceptance criteria, validation, and merge-risk classification. |
| `In Progress` | Someone or an agent is actively implementing or preparing the PR. | Use from branch/worktree start until the author believes the PR is reviewable. |
| `In Review` | The author believes the work is ready for review. | Use when the PR is open, CI is expected to pass, and reviewers should evaluate it. |
| `Revision Needed` | Review found accepted or pending changes that must be addressed on the existing PR. | Use after PR review or Codex CI review finds actionable items; return to `In Progress` for the revision pass, then back to `In Review`. |
| `Blocked` | Active work cannot move until a blocker clears. | Use for work that should resume once a dependency, decision, access issue, or failed prerequisite is resolved. |
| `Complete` | The issue is done and no required work remains. | Use after merge, closure, or accepted completion for non-code artifacts. |

Use `Deferred` as a label or planning field on backlog items, not as a status. Use `Blocked` when
active work cannot move until a blocker clears.

Recommended issue types:

| Issue Type | Description | When to use |
| --- | --- | --- |
| `Initiative` | A large outcome or theme that groups multiple issues. | Use when the work is too large for one PR and needs child issues, sequencing, or progress tracking. |
| `Spec` | Durable behavior definition for something to build. | Use when behavior, contracts, user-visible semantics, edge cases, or acceptance criteria need to be settled before implementation. |
| `ADR` | Durable record of an architecture or operating decision. | Use when choosing between meaningful options that affect direction, boundaries, storage, APIs, or workflow policy. |
| `Spike` | Time-boxed investigation to answer an evidence gap. | Use when production work would otherwise guess; output findings and a recommendation, not production code. |
| `Task` | Concrete executable unit of work. | Use when one branch/PR can complete the work with clear acceptance criteria. |
| `Bug` | Defect against intended behavior. | Use when actual behavior differs from expected behavior and there is reproduction evidence or a failing check. |
| `Refactor` | Behavior-preserving structural improvement. | Use when the goal is clearer ownership, better boundaries, names, abstractions, or duplication reduction without product behavior change. |

Recommended merge-risk values:

| Merge Risk | Description | When to use |
| --- | --- | --- |
| `Parallel-safe` | Low coordination risk with other branches. | Use for isolated tests, small adapters, local bugs, report formatting, or work in unrelated areas. |
| `Needs coordination` | Can proceed, but related issues may need sequencing or explicit communication. | Use when the work touches shared contracts, migrations, public APIs, architecture rules, or commonly edited files. |
| `Serial only` | Should not run in parallel with related work. | Use for foundational changes, contested design work, or anything likely to cause merge conflicts or invalid downstream work. |

If the specific reason matters, record it in the issue body or with additional labels such as
`touches-contracts`, `touches-migration`, `touches-public-api`, or `touches-architecture`.

## Definition Of Ready

An issue is ready for autonomous implementation only when it contains:

1. Goal.
2. Non-goals.
3. Relevant source docs.
4. Owned area or module.
5. Allowed files or directories.
6. Forbidden files or directories.
7. Contracts, records, APIs, or user surfaces touched.
8. Expected tests.
9. Validation command.
10. Acceptance criteria.
11. Merge-risk classification.
12. Required PR summary sections.
13. Architecture direction check: intended model, ownership boundary, public surfaces touched, and
    known design forks that require human decision.

## Definition Of Done

An implementation issue is done only when:

- The requested behavior exists.
- Behavior is covered by focused tests.
- Architecture boundaries still hold.
- The PR review challenged the chosen architecture direction and did not find a cheap/minimal
  shortcut affecting architecture, contracts, storage, ownership, public surface, or model clarity.
- Relevant validation commands were run or the blocker is explicitly recorded.
- Durable source docs are updated when behavior, contracts, architecture, or accepted decisions changed.
- The PR summary names decisions and known smells.
- Naming issues are either fixed or recorded.
- Review feedback is triaged rather than blindly applied.

## Agent Task Template

Use this shape for implementation issues:

```md
# Goal

# Non-goals

# Source docs

# Owned area or module

# Allowed files/directories

# Forbidden files/directories

# Contracts/APIs touched

# Architecture direction
- Intended model:
- Ownership boundary:
- Public surfaces touched:
- Alternatives considered:
- Cheap/minimal shortcuts rejected:
- Human decision needed:

# Acceptance criteria

# Required tests

# Validation command

# Merge risk

# Required PR summary
- Summary
- Validation
- Decisions & Smells
- Naming Issues
- Review Triage, if applicable
```

## Spec Issue Template

Use this shape when a vague issue is converted into a spec issue:

```md
# Problem

# Current understanding

# Clarification questions

# Spec state
Draft

# Proposed behavior / contract

# Non-goals

# Source evidence

# Architecture / ownership implications

# Acceptance criteria for the spec

# Breakdown notes, after accepted
```

## PR Template

Use this shape for agent-authored PRs:

```md
## Summary

## Issue
Closes #

## Scope
- In:
- Out:

## Contracts / APIs Touched

## Architecture Boundaries
- Owned area:
- Public surface changed:

## Architecture Direction Challenge
- Intended direction:
- Direction still sound:
- Cheap/minimal shortcut introduced:
- Human architecture decision needed:
- Recommended correction:

## Validation
- [ ] Focused tests:
- [ ] Full check:
- [ ] Other project-specific checks:

## Review Triage
Accepted:
Conditional:
Deferred:
Rejected:

## Decisions & Smells
- Decision:
- Smell:
- Owner:
- Removal condition:

## Naming Issues
- Current:
- Suggested:
- Reason:
```

## Generic Quality Rules

These rules travel across projects:

- Optimize for the best long-term design when the project is pre-ship and has no external compatibility obligations.
- Do not preserve legacy APIs, compatibility bridges, aliases, retired paths, or migration shims by default.
- Allow temporary bridges only when they are explicitly necessary, named, bounded, and have a removal condition.
- Prohibit cheap or minimal passes when they affect architecture, ownership, contracts, storage,
  public surface, or long-term model clarity.
- Treat review feedback as evidence, not commands.
- Surface decisions, smells, workarounds, and possible technical debt at the end of each task.
- Track unclear names and propose better names when they matter.
- Stop and restate the roadmap when work spans multiple migration axes or the model becomes fuzzy.
- Prefer correctness over speed.
- Never silently hide errors.
- Do not create untracked technical debt.
- Keep slices narrow and reviewable.
- Validate each meaningful slice.

## Scope Limiters

These rules prevent quality practices from becoming uncontrolled scope growth:

- A consistency fix applies immediately to sibling code in the same capability and abstraction level.
- If a consistency fix crosses capability boundaries, create a follow-up issue unless correctness is affected.
- Foundational correctness issues stop the line.
- Local cleanup outside the current slice is recorded with owner, boundary, and removal condition.
- Speculative improvement does not derail the PR.
- Do not expand public exports just to make code DRY.
- Do not introduce framework abstractions before repeated need is real.

## Project Overlays

Project-specific rules belong in a project overlay, not in this generic workflow.

Examples of overlay content:

- Domain glossary and naming rules.
- Architecture import rules.
- Required validation commands.
- Release and compatibility policy.
- Data-retention and privacy rules.
- Migration policy.
- Error-handling policy.
- Test strategy.
- Model policy.

## Open Questions

- What is the smallest useful spec template?
- What is the smallest useful ADR template?
- What is the smallest useful spike template?
- When should a spec issue be marked `Complete` versus moved to `Breakdown`?
- Which board fields are worth automating first?
- Which exact CI checks should be required on every project versus configured per project?
- Should Codex CI review eventually block on structured blocker findings, or remain required
  advisory evidence?
- What checks are mandatory before merge for each project type?
- What filename/status conventions should specs and ADRs use?
