# Tetris Dogfood Reset - 2026-06-21

Status: observed

## Target

- Repository: `jbelanger/bullet-tetris-lab`
- Local path: `/Users/joel/Dev/bullet-tetris-lab`
- Reset baseline commit: `97d63da` (`Reset dogfood baseline to current workflow kit`)

## What Was Reset

- Closed stale Tetris task issue `#1`.
- Closed stale Tetris implementation PR `#2`.
- Deleted stale remote branches for the prior dogfood run.
- Removed the stale Archon-linked worktree and local experiment branches.
- Rewrote target `main` to a clean baseline containing the current installed Agent Workflow Kit.
- Verified the installed workflow with `node scripts/validate-workflow.mjs`.
- Verified workflow labels with `node scripts/setup-github-labels.mjs --repo jbelanger/bullet-tetris-lab --verify-only`.

## Preserved Lesson From The Prior Run

Fresh target repositories did not have workflow labels such as `task`, so issue templates could
reference labels that did not exist yet. That lesson has already been promoted into the source kit
through:

- `scripts/workflow-labels.mjs`
- `scripts/setup-github-labels.mjs`
- installer coverage for both scripts
- validation checks for installable label setup

## Reset Lesson

Repeat dogfood needs a deliberately clean target baseline. Installing the current kit over an old
target is not enough when the old target contains removed workflow-pack files, app source, build
artifacts, or stale worktrees. For a signal-bearing repeat run, reset the target to a known baseline
first, then install the current kit.

The reset also showed that `install-workflow-kit.mjs` is intentionally additive and conflict-aware;
it is not a pruning or uninstall tool. That remains the right default for real adopters, but dogfood
reset instructions should treat pruning as a separate target-maintenance step.

## Next Diagram Gap To Stress

The next Tetris dogfood run should not merely replay the previous single-agent implementation path.
To move closer to `docs/assets/your-loop-vs-kit-today.png`, it should stress the missing execution
loop:

- prepare one implementation brief from a groomed issue,
- dispatch more than one implementation task into separate worktrees,
- have each worker open or update a linked PR,
- verify a later agent can pick up one linked PR from GitHub state without chat memory.

Useful acceptance signal: the run exposes enough friction to define the first real dispatcher and
pickup contract, or proves that the existing skills already contain enough durable state for a thin
dispatcher wrapper.

## Supervisor-Only Grooming Trial

The next run used the supervisor-only protocol:

- The main thread did not perform the workflow step directly.
- Four advisory subagents handled product strategy, UX direction, technical architecture, and
  validation strategy.
- A separate grooming lead subagent synthesized the advisory outputs.
- The grooming lead created GitHub issue `#3`, `[Discovery] Choose the Bullet Tetris core loop`.

### What Went Well

- The supervisor-only rule worked. The main thread delegated, waited, inspected, and reported
  instead of quietly doing the grooming itself.
- Advisory agents stayed in their lanes. They did not edit files, create branches, create issues, or
  move into implementation.
- Each advisory agent independently concluded that the vague game idea was not implementation-ready.
- The grooming lead created visible GitHub state and stopped before breakdown or implementation.
- The issue captured useful product, UX, architecture, and validation risks instead of collapsing
  the idea into a cheap first code slice.

### What Went Badly

- Grooming and discovery overlapped. `groom-issue` said to enter interview mode and ask the
  highest-leverage question, while `discover-vision` also claimed ownership of concentrated human
  interaction.
- The interview became asynchronous issue text instead of an interactive interview. That preserved
  state, but it did not test whether a discovery agent can conduct a live, one-question-at-a-time
  dialogue and adapt after the human answers.
- The grooming issue became quite large for a first interview handoff. That is useful evidence, but
  it risks turning the first human decision into a document review rather than a conversation.

### Process Change

Clarify the boundary:

- `groom-issue` classifies vague work, records why implementation is unsafe, and routes product, UX,
  creative, game, platform, or architecture interviews to `discover-vision`.
- `discover-vision` owns the interactive interview. It asks one question, then stops unless the
  human answers in the same turn.
- The agent must not treat its own recommendation as the accepted answer.
- In GitHub async mode, the question is recorded in the issue and the next actor is `Human`.
- In live-chat mode, the question should be asked interactively in chat before durable vision text is
  drafted.
