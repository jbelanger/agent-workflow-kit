# AI-Oriented Development Workflow

Status: local-skills baseline draft

This repository is the working home for the workflow. Earlier planning notes from other repositories
are source material only; durable decisions for this kit now belong here.

The baseline:

> Humans own product and architecture judgment. Agents execute prepared work, propose architecture,
> review evidence, and create small PRs. CI remains deterministic. Agents do not merge.

The goal is to shift important thinking left so implementation agents can work independently without
creating architecture debt, hidden scope, or unnecessary merge conflicts.

## Operating Surfaces

Use the smallest durable surface that matches the job:

- `AGENTS.md`: installed repository rules, quality bar, validation expectations, and boundaries.
- `.agents/skills/`: installed local Codex skills organized by category.
- `docs/development/`: durable work items, specs, ADRs, spike writeups, workflow docs, and planning
  records.
- GitHub issues and PRs: optional collaboration, review, and remote audit mirrors.
- `.archon/`: optional execution profile for repos that want workflow runs, artifacts, worktrees,
  approval gates, and recovery state around the same portable workflow verbs.
- CI: deterministic checks such as tests, typecheck, lint, formatting, build, and architecture
  checks.

Development docs live in the single repo, but they must remain separate from user-facing docs and
excluded from any published product surface when needed. Active agent instructions stay in
`AGENTS.md` and `.agents/skills/`, not under `docs/development/`.

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

Active skills use this shape:

```text
.agents/skills/<category>/<skill-name>/SKILL.md
```

The final folder must remain the skill name, and the frontmatter `name` is still the invocation
name. Category folders are for navigation and install organization. Category READMEs may explain
what belongs there, but they must not duplicate procedural instructions from individual skills.

Current categories:

| Category | Use for |
| --- | --- |
| `process/` | Planning, orchestration, implementation routing, review routing, and workflow improvement. |
| `specialist/` | Repeatable expert passes such as product strategy, UX direction, creative direction, technical architecture, validation strategy, testing, diagnosis, simplification, naming review, or refactor support. |
| `domain/` | Project or business-domain skills with domain vocabulary, records, policies, reports, or workflows. |

Process: planning and orchestration:

| Skill | Purpose | May edit code? |
| --- | --- | --- |
| `triage-backlog` | Review open work items and classify what needs attention. | No |
| `pick-next-item` | Recommend the best next work item based on readiness, risk, dependencies, and value. | No |
| `groom-issue` | Turn an unclear work item into a task, spec, ADR, spike, bug, refactor, drop, or defer. | No |
| `discover-vision` | Orchestrate early high-interaction product, UX, creative, platform, or architecture discovery before specs. | Docs only |
| `draft-artifact` | Draft or update one durable spec, ADR, or spike from groomed direction. | Docs only |
| `breakdown-issue` | Decompose accepted direction into independent merge-safe child work items. | No |
| `prepare-implementation` | Convert one Ready work item into an implementation brief. | Docs/issues only when asked |
| `improve-workflow` | Triage dogfooding feedback and propose process improvements. | Docs/issues only when asked |

Process: execution and review:

| Skill | Purpose | May edit code? |
| --- | --- | --- |
| `work-issue-local` | Implement one prepared work item, bug, refactor, PR revision, or superseding child item. | Yes |
| `review-local-changes` | Lightweight local diff review before PR. | No, unless explicitly asked to fix |
| `review-revision-triage` | Strong architecture-sensitive PR review, revision routing, and human-review escalation. | Docs/specs only when safe |

Specialist skills:

| Skill | Purpose |
| --- | --- |
| `product-strategy` | Advisory product, audience, value, market, and differentiation lens for discovery. |
| `technical-architecture` | Advisory platform, ownership, build/runtime, storage, public-surface, and architecture lens. |
| `validation-strategy` | Advisory acceptance evidence, feedback-loop, test, playtest, and quality strategy lens. |
| `ux-direction` | Conditional UX, interaction, information architecture, accessibility, and usability lens. |
| `creative-direction` | Conditional creative, brand, content, game-design, tone, and game-feel lens. |
| `tdd` | Behavior-first red/green/refactor through the highest useful public seam. |
| `diagnose-bug` | Build a tight red-capable bug feedback loop before implementation. |

Do not create one mega-skill for the whole workflow. Skills should match the verbs people actually
say. Add specialist or domain skills when repeated work needs durable procedural knowledge that is
not part of the process loop.

## Optional Archon Execution Profile

Archon is an optional runtime profile, not the workflow source of truth.

Use this model:

```text
portable source:
  AGENTS.md + .agents/skills + docs/development + optional GitHub issues/PRs

optional runtime:
  .archon/commands/awk-* + .archon/workflows/awk-*
```

`.archon/commands/awk-*` files are adapters. They should point Codex at the owning skill or rule
document, define the artifact path Archon needs, and include only the output shape required for
workflow routing. They should not become parallel skills.

`.archon/workflows/awk-*` files own execution mechanics: node order, fresh context, worktree
isolation, approval gates, deterministic routing, and recovery state.

Use `docs/development/workflow/adr-archon-portable-skills.md` as the accepted boundary for the
Archon profile.

During dogfooding, installed skills ask agents to report process friction in a `Process feedback`
note. Treat those notes as evidence for `improve-workflow`, not as automatic process changes.

## Work Items

A work item is the workflow's unit of planning. It can be a repo-local Markdown record under
`docs/development/work-items/`, a GitHub issue, or another tracker item. Prefer repo-local work
items when the project needs portability without depending on GitHub.

Use this authority model:

```text
repo-local work item / accepted spec / accepted ADR
  -> canonical planning state

Archon artifact
  -> execution evidence until promoted

GitHub issue or project board
  -> optional collaboration and progress mirror
```

Grooming classifies unclear work. Drafting creates proposed specs, ADRs, or spikes. Breakdown
creates child work items only after direction is accepted. Preparation turns one breakdown-shaped
child work item into an implementation brief.

## Workflow

```text
Backlog
  -> Grooming
  -> Discovery / Vision, when vague product direction needs it
  -> Draft Spec / ADR / Spike / Direct Direction
  -> Breakdown
  -> Ready
  -> In Progress
  -> In Review
  -> Complete
```

`Blocked` is not a normal phase. Use it only when progress truly cannot continue because of a
decision, dependency, access problem, failed prerequisite, or unresolved architecture fork.

### 1. Triage Backlog

Use `triage-backlog` when the human asks to triage, clean up work items, or find what needs
attention.

Triage groups work items into:

- Ready.
- Needs grooming.
- Needs spec.
- Needs ADR.
- Needs spike.
- Needs breakdown.
- Blocked.
- Stale, duplicate, or unclear.
- Human-only decision.

Triage recommends next actions. It does not implement anything.

### 2. Pick Next Item

Use `pick-next-item` when the human asks what to work on next.

Prefer work that is:

- Valuable to the current direction.
- Ready or close to Ready.
- Small enough for one agent session after breakdown.
- Low merge-risk unless foundational work is intentional.
- Not blocked by missing decisions.
- Unlikely to cause architecture drift.

The output names the recommended work item, why it wins, why plausible alternatives are not first,
the risk, and the suggested next mode.

### 3. Groom Issue

Use `groom-issue` when a work item, issue, or idea is unclear.

Grooming answers:

- What problem are we solving operationally?
- What is already true?
- What is missing?
- Which source docs or code are authoritative?
- What is explicitly out of scope?
- Which ownership boundary is involved?
- What architecture risks exist?
- Is this parallel-safe, needs coordination, or serial only?

For product, design, game, interaction, or other user-facing creative work, grooming also owns the
vision interview before specification. The agent should not turn a vague product prompt into a
minimal implementation slice by guessing the product. It should identify audience, experience
goals, core loop or workflow, comparable products or genre expectations, design risks, and platform
options. When current market, competitor, genre, library, or platform evidence would materially
change the recommendation, gather evidence or route to a spike before drafting.

Choose the smallest useful output:

- Direct direction when the work is clear enough to decompose into implementation work items.
- Bug when actual behavior differs from expected behavior.
- Refactor when the goal is behavior-preserving structure.
- Spec when behavior, contracts, records, user-visible semantics, or acceptance criteria need to be
  settled.
- ADR when architecture direction, ownership, storage, public surface, or operating policy changes.
- Spike when evidence is missing and production work would otherwise guess.
- Drop or defer when the work should not move now.

Ask one clarification question at a time. Include options, a recommendation, and why the answer
matters. Explain concepts in operational terms, assuming the human has not looked at the codebase
recently. Use compact visuals or tables when they make the decision easier.

Grooming status values:

| Grooming Status | Meaning |
| --- | --- |
| `READY_FOR_DRAFT` | The next durable spec, ADR, or spike can be drafted without inventing meaningful decisions. |
| `NEEDS_INTERVIEW` | One human answer is needed before useful durable text can exist. |
| `NEEDS_RESEARCH` | Evidence must be gathered before the next decision or draft. |
| `NEEDS_DECISION` | A known architecture, product, ownership, storage, public surface, or policy decision blocks progress. |
| `DIRECT_TASK` | The work is clear enough to send to breakdown without a spec or ADR. |
| `DROP` | The work should not be done. |
| `DEFER` | The work may be valid but should not move now. |

`draft-artifact` should consume grooming only when the status is `READY_FOR_DRAFT` or the current
human response resolves the blocking question. Otherwise the workflow should keep the item in
grooming, ask the next interview question, run `discover-vision`, or run the named research spike.

### 4. Discover Vision

Use `discover-vision` when grooming reports unresolved product, UX, creative, game, platform, or
architecture direction that should be settled before a useful spec can exist.

Discovery is the workflow's high-human-interaction stage. Its job is to decide the high-level
vision: who the work is for, what experience or operational outcome matters, which direction is
distinctive or useful, which technical shape is credible, and what evidence will prove the direction
is good enough to specify.

`discover-vision` acts as the orchestrator. It chooses specialist lenses conditionally:

- Default for vague product or platform work: `product-strategy`, `technical-architecture`, and
  `validation-strategy`.
- Add `ux-direction` only when journey, interaction, information architecture, usability, or
  accessibility materially affects the direction.
- Add `creative-direction` only when brand, tone, content, game design, emotional target, visual or
  audio language, or memorability materially affects the direction.

Specialists are advisory. They produce observations, options, recommendations, risks, questions,
evidence needs, and readiness impact. They do not create accepted truth or ask the human directly.
The orchestrator reconciles conflicts, deduplicates findings, and asks exactly one highest-leverage
human question.

Discovery artifacts live under:

```text
docs/development/discovery/<slug>/
  00-intake.md
  vision-brief.md
  decision-log.md
  research-notes.md   # only when research exists
```

Avoid permanent specialist transcript files by default. Later workflow stages should read the
accepted `vision-brief.md` and `decision-log.md`, not raw brainstorming.

Vision state is separate from board status:

| Vision State | Meaning |
| --- | --- |
| `Draft` | Proposed direction; not authoritative for autonomous specification. |
| `Accepted` | Human-approved direction for spec drafting and breakdown. |
| `Superseded` | A newer vision, spec, or ADR replaced it. |

After the vision is accepted, route to `draft-artifact` for a spec, ADR, or spike. Later stages
should interrupt the human only for real forks: choices that would materially change the accepted
vision, platform, ownership, storage, public surface, non-goals, or validation strategy.

### 5. Spec, ADR, Spike, Or Direct Direction

Use a spec when behavior, contracts, or user-visible semantics need agreement.

Use an ADR when the decision changes architecture direction, ownership, storage, public surface, or
operating policy.

Use a spike when evidence is missing and production work would otherwise guess.

Use direct direction only when the desired change is already clear, bounded, and testable.

Specs and ADRs are durable planning records. They may be superseded, but they are not disposable
scratch artifacts. Spike notes are evidence unless their findings are promoted into a spec, ADR, or
task.

Use `draft-artifact` to create or update one durable artifact from groomed direction:

- Draft specs go under `docs/development/specs/` with `Spec state: Draft`.
- Draft ADRs go under `docs/development/adrs/` with `Status: Proposed`.
- Spike plans or results go under `docs/development/spikes/`.

Draft artifacts are reviewable proposals. They are not accepted truth until the human accepts them
through review or an explicit decision. Do not create implementation child work items from a draft
spec or proposed ADR.

For product or design specs, the draft must include a real product/design vision before detailed
rules: intended audience, experience pillars, core loop or workflow, comparable references or
research evidence, differentiators, and design risks. If the source grooming record does not support
that depth, do not draft a thin rules-only spec; return to interview or research.

Spec state is separate from board status:

| Spec State | Meaning |
| --- | --- |
| `Draft` | Proposed behavior or contract; not authoritative for autonomous implementation. |
| `Accepted` | Human-approved target for implementation. |
| `Implemented` | Merged code matches the accepted spec. |
| `Superseded` | A newer spec or ADR replaced this one. |

When a spec lives in the repo, acceptance happens through PR review of the spec document or an
explicit human decision. After the direction is accepted, send it to `breakdown-issue` or the Archon
`awk-breakdown-work-item` adapter.

### 6. Breakdown

Use `breakdown-issue` after accepted direction and before implementation readiness.

Breakdown is the orchestration phase. Its job is to decompose accepted direction into independent,
merge-safe child work items. This can be quick and can happen in the same planning session, but it
is still a distinct step. No implementation work item is `Ready` until breakdown has produced or
confirmed task boundaries.

Breakdown must produce child work items that are:

- Linked to the parent work item.
- Small enough for one agent, one branch or worktree, and one PR.
- Clear about goal, non-goals, source docs, owned area, allowed files, and forbidden files.
- Clear about contracts, APIs, storage, migrations, user surfaces, and architecture boundaries
  touched.
- Covered by acceptance criteria, feedback loop or test seam, required tests, and validation
  commands.
- Classified for merge risk.

Merge-risk values:

| Merge Risk | Description | When to use |
| --- | --- | --- |
| `Parallel-safe` | Low coordination risk with other branches. | Isolated tests, local bugs, report formatting, or unrelated areas. |
| `Needs coordination` | Can proceed with sequencing or communication. | Shared contracts, common files, public APIs, migrations, or architecture rules. |
| `Serial only` | Should not run in parallel with related work. | Foundational changes, contested design, or likely merge-conflict paths. |

If a child work item is still unclear, keep it in `Grooming`. If decomposition exposes a real design
fork, route back to grooming, spec, ADR, or spike. Do not hide architecture decisions inside task
splitting.

### 7. Prepare Implementation

Use `prepare-implementation` after breakdown has produced a Ready child work item.

The implementation brief contains:

- Goal.
- Non-goals.
- Source docs.
- Allowed files or directories.
- Forbidden files or directories.
- Architecture boundary.
- Contracts, APIs, storage, or user surfaces touched.
- Parent/child context and resolution expectations.
- Acceptance criteria.
- Feedback loop or test seam.
- Required tests.
- Validation command.
- Merge risk.
- Required PR summary sections.

If the work item is clear but not decomposed into merge-safe implementation work, return it to
`breakdown-issue`. If the work item is unclear, return it to `groom-issue`.

### 8. Work Issue Locally

Use `work-issue-local` when a Ready work item is assigned for implementation, refactor, accepted
revision work, or a superseding child item.

Rules:

- One work item.
- One branch or worktree.
- One PR.
- No scope expansion.
- No merge.
- Preserve behavior unless the work item explicitly changes it.
- Stop for architecture forks.
- Ask before changing public APIs, ownership boundaries, storage shape, migration policy, or
  long-term abstractions.

The implementation agent decides whether the full Architecture Direction Check is needed. Use the
full check when the task touches architecture, ownership, contracts, storage, public surface,
migrations, refactors, PR revisions, superseding work, accepted specs or ADRs, or detected smells.
For trivial tasks, a short "no architecture surface touched" note is enough.

For PR revisions, the implementation agent starts from the reviewer's classification but verifies
each item against the work item, diff, code, specs or ADRs, tests, and intended architecture before
coding. Review feedback is evidence, not a command.

Before coding, the implementation agent chooses the cheapest honest feedback loop: TDD for
behavior-changing work with a useful public seam, bug diagnosis for unreproduced failures,
characterization tests for risky refactors, or validation-only for trivial work where tests would be
brittle or lower signal.

When completing a child item, superseding refactor, or replacement PR, the implementation agent
reads the parent work item and decides whether the parent is now resolved, partly resolved, or
should return to grooming or breakdown.

### 9. Review

There are two review paths.

Use `review-local-changes` for lightweight pre-PR local diff review. It checks blockers,
architecture concerns, feedback-loop quality, test gaps, naming issues, scope drift, suggested
fixes, and taste-only notes.
If the change touches architecture-sensitive surfaces or reveals a smell, switch to
`review-revision-triage`.

Use `review-revision-triage` for risk-triggered PR review and non-trivial revision routing. Trigger
it when the PR touches architecture, ownership, contracts, storage, public surface, core domain
model, accepted specs or ADRs, or when either agent detects a smell, debt risk, unclear model,
boundary drift, or meaningful non-trivial disagreement.

Strong review must:

- Challenge architecture direction before ordinary findings.
- Verify review claims against code and source docs.
- Classify meaningful feedback as accepted, rejected, deferred, taste-only, or human decision
  needed.
- Add or recommend `revision-needed` when actionable work must be addressed before merge.
- Add or recommend `needs-human-review` when human architecture judgment or product direction is
  required.
- Explain non-trivial issues for a human who has not read the codebase recently.

Either agent can force human review. Both agents must agree before skipping human review. A revision
is agent-pickable only when both agents agree no human-review-worthy smell exists.

Review details stay on the PR. Use `revision-needed` and `needs-human-review` as labels or fields,
not required board statuses.

### 10. Refactor And Superseding PRs

Do not add a dedicated refactor skill yet. Refactor is a work item type and an implementation path
handled by `work-issue-local`, usually routed by `review-revision-triage`.

If a refactor is required before merge:

- Keep it on the same PR when the current PR cannot be accepted without it.
- Create a linked `Refactor` child item and replacement PR when the cleanup is broader than the
  current PR or makes the original PR obsolete.
- Close the original PR as superseded when the replacement path makes it obsolete.
- Do not rewrite the original work item. Link the replacement child item or PR and preserve the audit
  trail.
- Keep the parent work item active while the replacement path is active unless a real blocker exists.

The agent completing the replacement work owns reading the parent work item and deciding whether the
parent is resolved.

### 11. Merge

Only the human merges.

Merge only when:

- The work item acceptance criteria are met.
- Required checks pass.
- Review conversations are resolved or explicitly deferred with owner, boundary, and removal
  condition.
- Architecture boundaries still hold.
- Relevant specs, ADRs, or development docs are updated when behavior, contracts, architecture, or
  accepted decisions changed.
- The PR summary records validation, decisions, smells, naming issues, and review triage when
  applicable.
- The human approves.

Use squash merge by default so `main` keeps a readable history.

## Board Model

Recommended statuses:

| Status | Description | When to use |
| --- | --- | --- |
| `Backlog` | Captured but not currently moving. | Ideas, future work, deferred items, and work not yet selected. |
| `Grooming` | Clarifying intent and classifying next output. | Use while deciding spec, ADR, spike, direct direction, drop, or defer. |
| `Breakdown` | Accepted direction is being decomposed into executable child work items. | Use before child work items are merge-safe and Ready. |
| `Ready` | Scoped and safe for one agent to pick up. | Use after breakdown and implementation prep are sufficient. |
| `In Progress` | An agent or human is actively working. | Branch/worktree work, spec drafting, active replacement path, or revision pass. |
| `In Review` | The author believes the PR or artifact is reviewable. | Use when review should evaluate the work. |
| `Blocked` | Progress cannot continue. | Use only for real decisions, access, dependencies, failed prerequisites, or architecture forks. |
| `Complete` | Done and no required work remains. | Use after merge, closure, or accepted completion for non-code artifacts. |

Recommended work item types:

| Work Item Type | Description | When to use |
| --- | --- | --- |
| `Initiative` | A large outcome grouping multiple work items. | Use for parent tracking, sequencing, and progress visibility. |
| `Spec` | Durable behavior or contract definition. | Use when behavior or acceptance criteria need agreement. |
| `ADR` | Durable architecture or operating decision. | Use when direction, ownership, storage, public surface, or policy changes. |
| `Spike` | Time-boxed evidence gathering. | Use when production work would otherwise guess. |
| `Task` | Concrete executable work. | Use when one branch or PR can complete the work. |
| `Bug` | Actual behavior differs from expected behavior. | Use with reproduction evidence or a failing check. |
| `Refactor` | Behavior-preserving structural improvement. | Use for ownership, boundary, naming, abstraction, or debt cleanup. |

Core fields:

| Field | Description | When to use |
| --- | --- | --- |
| `Status` | Coarse lifecycle state. | Always. |
| `Work Item Type` | Work or artifact type. | Always. |
| `Area` | Product, architecture, or code area. | Use for filtering and avoiding parallel work in the same area. |
| `Merge Risk` | Parallel coordination risk. | Required before Ready. |
| `Vision State` | Draft, Accepted, or Superseded. | Use for discovery/vision work. |
| `Spec State` | Draft, Accepted, Implemented, or Superseded. | Use for spec work items. |

Useful labels or secondary fields:

| Label / Field | Description | When to use |
| --- | --- | --- |
| `revision-needed` | Actionable review work must be addressed before merge. | Use as a queue signal, not a board status. |
| `needs-human-review` | Human architecture or product judgment is needed. | Use when either agent escalates. |
| `needs-source-evidence` | Claims need code, docs, logs, or external evidence. | Use before planning or implementation can proceed. |
| `human-only` | Should not be autonomously executed by an agent. | Credentials, subjective product decisions, finance/legal/privacy judgment, or merge approval. |
| `deferred` | Intentionally retained but not moving now. | Use on backlog items, not as status. |
| `target-phase` | Phase, milestone, or release. | Add only when planning across phases is useful. |
| `estimate/budget` | Rough size, time, or cost. | Add only when timeline or agent-cost planning needs it. |

Do not add `Revision Needed` as a required board status. Revision state belongs on the PR and in
labels or fields.

## Definition Of Ready

An implementation work item is Ready only when it has:

1. Parent work item link when applicable.
2. Goal.
3. Non-goals.
4. Relevant source docs or code.
5. Owned area or module.
6. Allowed files or directories.
7. Forbidden files or directories.
8. Contracts, records, APIs, storage, or user surfaces touched.
9. Acceptance criteria.
10. Feedback loop or test seam.
11. Required tests.
12. Validation command.
13. Merge-risk classification.
14. Parent resolution expectations for child items or superseding work.
15. Human decisions resolved, or clearly marked as required.

## Definition Of Done

An implementation work item is done only when:

- The requested behavior exists.
- The chosen feedback loop was run, or the reason for validation-only work is explicit.
- Focused validation has run, or the blocker is explicit.
- Architecture boundaries still hold.
- Durable docs are updated when behavior, contracts, architecture, or accepted decisions changed.
- Review feedback is triaged rather than blindly applied.
- Deferred debt has an owner, boundary, and removal condition.
- Parent work item resolution has been checked when the work is a child item or replacement path.

## CI Policy

CI should stay deterministic:

- Tests.
- Typecheck.
- Lint.
- Formatting.
- Build.
- Architecture or import-boundary checks.
- Issue-link or PR-template checks, when useful.

Codex-in-CI is deferred. It can be revisited later as advisory review or gating after the local
skills loop has proved useful and the security, prompt-injection, trigger, and API-key boundaries are
explicit.

## Later Capabilities

Revisit these after the local workflow is stable:

- Packaging skills as a plugin.
- Codex-in-CI advisory review.
- Structured issue or board automation.
- Dedicated refactor skill if refactor passes become frequent enough.
- More detailed spec, ADR, and spike templates.

## Temporary Dogfooding Feedback

This workflow is still being test-driven. Agents should include a brief `Process feedback` note in
replies, issue comments, or PR summaries when they encounter confusing instructions, missing fields,
excess ceremony, unsafe autonomy, merge-safety gaps, or ideas that would make the workflow easier to
use.

Use `improve-workflow` to triage those notes before changing the process. Remove this section and the
matching skill footers when the workflow is stable enough for real project rollout.
