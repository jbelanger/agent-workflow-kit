# GitHub-First Workflow Flow

Status: draft

This is the v0 operating flow for Agent Workflow Kit after the Archon experiment. The goal is not
to build an agent platform first. The goal is to make work resumable from GitHub state so a human
can answer from GitHub Mobile and a local agent can later continue without chat memory.

## Product Promise

```text
Human leaves the keyboard
  -> answers a question or approves direction in GitHub
  -> later asks Codex to continue work
  -> Codex reads GitHub issues, Project fields, PRs, and repo docs
  -> Codex knows the next safe workflow step
```

The setup script is supporting machinery. It should encode and reproduce this flow, but it is not
the source of truth for the workflow.

## Surfaces

| Surface | Owns | Does not own |
| --- | --- | --- |
| GitHub Issue | Work item, discussion, human answers, process feedback, source links. | Accepted durable specs or architecture truth by itself. |
| GitHub Project | Operating state: status, next actor, decision needed, area, merge risk, artifact state. | Full work description or evidence trail. |
| GitHub PR | Proposed repo doc or code change, review discussion, validation summary. | Autonomous merge or hidden acceptance. |
| `docs/development/` | Accepted durable truth after review: vision, specs, ADRs, spikes, workflow docs. | Raw scratch planning. |
| `.agents/skills/` | Procedural rules for agents. | Project-specific accepted direction. |

## Project Fields

The active Project must make the next move legible:

| Field | Meaning |
| --- | --- |
| `Status` | Coarse lifecycle: `Inbox`, `Grooming`, `Discovery`, `Drafting`, `Breakdown`, `Ready`, `In Progress`, `Review`, `Done`, or `Deferred`. |
| `Issue Type` | The work shape: `Initiative`, `Discovery`, `Spec`, `ADR`, `Spike`, `Task`, `Bug`, or `Refactor`. |
| `Next Actor` | Who should move next: `Human`, `Agent`, or `Either`. |
| `Decision Needed` | Why work cannot continue automatically: `None`, `Question`, `Approval`, `Research`, `Architecture`, or `Access`. |
| `Area` | The affected workflow, docs, CI, guidance, GitHub config, governance, or project area. |
| `Merge Risk` | Coordination risk: `Parallel-safe`, `Needs coordination`, or `Serial only`. |
| `Artifact State` | State of a linked durable artifact: `None`, `Draft`, `Accepted`, `Implemented`, or `Superseded`. |

Avoid `Blocked` as a status. A blocker should be expressed as `Next Actor`, `Decision Needed`, and
a clear issue comment.

## Review Handoff Rule

For doc or code changes, `Status = Review` requires a linked GitHub PR that exposes the diff. Local
commits without a PR stay `In Progress`; the issue comment should record the commit and make opening
a draft PR the next action.

`Review` is a visible acceptance handoff, not mandatory heavyweight ceremony. For low-risk docs,
process, or chore changes, clean validation plus explicit human approval is enough to move to the
human-owned merge step. Use deeper review when the change affects architecture, ownership, public
surface, storage, or an unclear long-term model.

Issue-only decisions may be reviewed in the issue thread when there is no repo diff to inspect. In
that case, the issue comment must name the exact question, artifact, or decision being reviewed.

## Continue-Work Loop

When the human says "continue work," the agent should:

1. Read open PRs first.
2. Read the active Project.
3. Prefer `Ready` items where `Next Actor` is `Agent` or `Either`.
4. Read the selected issue, comments, linked PRs, and named repo docs.
5. Choose one workflow verb.
6. Either ask one question, update or draft docs, review an artifact, break down accepted direction,
   prepare implementation, or implement only when the user has clearly authorized implementation.
7. Keep doc/code work `In Progress` until a linked PR exists; do not mark local-only commits as
   `Review`.
8. End with current state, next actor, decision needed, next step, and process feedback.

The expected reply shape is:

```md
## Continue Work

Selected item:
Reason:
Next workflow verb:

## Current state

Status:
Issue Type:
Next Actor:
Decision Needed:
Artifact State:
Merge Risk:

## Next action

## Recommended GitHub updates

## Process feedback
```

## Human Mobile Loop

When an agent needs human input:

1. The agent asks exactly one question in an issue comment.
2. The issue remains in the relevant planning state.
3. `Next Actor` becomes `Human`.
4. `Decision Needed` becomes `Question`, `Approval`, `Architecture`, `Research`, or `Access`.
5. The human answers in GitHub Mobile or GitHub web.
6. The next `continue-work` run reads that answer and moves the item forward.

The answer should live in the issue thread. Chat-only answers are useful for the current session but
are weak resume state. When a chat answer changes direction, record it in the issue before relying
on it later.

## Durable Artifact Loop

Use durable repo docs when direction should survive beyond an issue thread:

```text
groom issue
  -> discover vision when product/design/platform direction is vague
  -> draft artifact in docs/development/
  -> review through PR or explicit recorded human decision
  -> mark Artifact State = Accepted only after acceptance
  -> break down accepted direction into executable issues
```

Draft artifacts are proposals. Implementation should not proceed from a draft vision brief, spec,
or ADR unless the human explicitly says to ignore that gate for the current work.

When a draft artifact changes repo docs, review should happen through a PR. Direct issue-thread
approval is reserved for decisions or artifact text that is already fully visible in the issue.

## Implementation Loop

Full agent execution is a later proof after the mobile-resumable loop is working.

For v0, implementation should happen only when:

- the issue is `Ready`,
- `Next Actor` is `Agent` or `Either`,
- `Decision Needed` is `None`,
- acceptance criteria and validation are clear,
- merge risk is classified,
- the user has asked the agent to implement in the current turn.

The current Project fields do not by themselves prove implementation permission. That permission
still comes from the user instruction and should be visible in the issue or current thread.

## Process Feedback Loop

Every meaningful dogfood pass must identify workflow weakness when it sees one. Keep this lightweight
and close to the work:

- missing or confusing Project fields,
- unclear next actor or decision-needed state,
- issue comments that are insufficient for resume,
- too much ceremony before useful work,
- unsafe autonomy or unclear approval boundaries,
- gaps between GitHub Mobile usage and local Codex resume,
- places where setup scripts, docs, templates, or skills fail to explain the real workflow.

Record the weakness in the issue comment or PR summary where it was observed. Route durable changes
through `improve-workflow` when the feedback is actionable.

## Known V0 Weaknesses

These weaknesses appeared during the first GitHub-first dogfood pass:

- Review handoff was initially too loose: #11 moved to `Review` with only a local commit, so GitHub
  Mobile could not inspect the diff. Accepted rule: doc/code work requires a linked PR before
  `Status = Review`.
- Review handoff then became too ceremonious for low-risk chore/process work. Adjusted rule:
  `Review` means visible acceptance handoff; deeper review is reserved for meaningful risk.
- Implementation permission is not fully represented in Project fields. A `Ready` issue with
  `Next Actor = Agent` still does not prove that the human authorized implementation in the current
  turn. Until the workflow has a better signal, the agent must rely on the current user request or a
  clear issue comment before mutating code.
- Ordering dependencies are not first-class. The board showed both the flow documentation task and
  the mobile-resume dogfood task as actionable, but the "dogfood depends on documentation first"
  relationship lived in issue body text. `continue-work` must read issue bodies and comments, not
  only Project fields, until dependency representation is improved.

## First Dogfood Path

Use this order for the first GitHub-first learning run:

1. Document this flow.
2. Dogfood `continue-work` against Project #2 using issue #8.
3. Adjust Project fields, templates, or skills based on process feedback.
4. Only then build the setup script that reproduces the proven board shape.

This keeps the setup script honest: it documents and automates a flow that has already been used.
