# Rebuild Trace

This log records operational steps that should be reproducible later. Keep entries concise,
command-oriented, and explicit about decisions made outside the repository.

## 2026-06-18: Seed Repository

Created initial repository contents and pushed them to GitHub.

Repository:

- `jbelanger/agent-workflow-kit`
- Local path: `/Users/joel/Dev/perso/agent-workflow-kit`
- Initial commit: `801011a seed agent workflow kit`

Seed contents:

- `README.md`
- `.github/ISSUE_TEMPLATE/`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `docs/development/README.md`
- `docs/development/workflow/ai-dev-workflow.md`
- `docs/development/workflow/ai-dev-workflow-buy-vs-build.md`
- `docs/development/agents/AGENTS.md`
- `docs/development/agents/skills/`

Created first dogfooding initiative:

- Issue: `https://github.com/jbelanger/agent-workflow-kit/issues/1`
- Title: `[Initiative] Build the agent workflow kit by dogfooding it`

## 2026-06-18: GitHub Project Setup

Created GitHub Project:

- Title: `Agent Workflow Kit`
- Owner: `jbelanger`
- Number: `1`
- URL: `https://github.com/users/jbelanger/projects/1`
- Project ID: `PVT_kwHOACJn-c4BbEGw`
- Linked repository: `jbelanger/agent-workflow-kit`

Authentication note:

- `gh project` required the `project` OAuth scope.
- Refreshed auth with:

```bash
gh auth refresh --hostname github.com -s project
```

Project creation commands:

```bash
gh project create --owner jbelanger --title "Agent Workflow Kit" --format json
gh project link 1 --owner jbelanger --repo agent-workflow-kit
```

GitHub created a default `Status` field with `Todo`, `In Progress`, and `Done`. The workflow needs
more states, so a separate `Workflow Status` field was created instead of relying on the default.

Custom project fields:

```bash
gh project field-create 1 --owner jbelanger \
  --name "Workflow Status" \
  --data-type SINGLE_SELECT \
  --single-select-options "Backlog,Grooming,Breakdown,Ready,In Progress,In Review,Revision Needed,Blocked,Complete" \
  --format json

gh project field-create 1 --owner jbelanger \
  --name "Issue Type" \
  --data-type SINGLE_SELECT \
  --single-select-options "Initiative,Spec,ADR,Spike,Task,Bug,Refactor" \
  --format json

gh project field-create 1 --owner jbelanger \
  --name "Area" \
  --data-type SINGLE_SELECT \
  --single-select-options "Workflow,Agent Guidance,GitHub Config,CI,Docs,Governance,Unclassified" \
  --format json

gh project field-create 1 --owner jbelanger \
  --name "Merge Risk" \
  --data-type SINGLE_SELECT \
  --single-select-options "Parallel-safe,Needs coordination,Serial only" \
  --format json

gh project field-create 1 --owner jbelanger \
  --name "Spec State" \
  --data-type SINGLE_SELECT \
  --single-select-options "Draft,Accepted,Implemented,Superseded" \
  --format json
```

Project field values created:

- `Workflow Status`: `Backlog`, `Grooming`, `Breakdown`, `Ready`, `In Progress`, `In Review`,
  `Revision Needed`, `Blocked`, `Complete`
- `Issue Type`: `Initiative`, `Spec`, `ADR`, `Spike`, `Task`, `Bug`, `Refactor`
- `Area`: `Workflow`, `Agent Guidance`, `GitHub Config`, `CI`, `Docs`, `Governance`, `Unclassified`
- `Merge Risk`: `Parallel-safe`, `Needs coordination`, `Serial only`
- `Spec State`: `Draft`, `Accepted`, `Implemented`, `Superseded`

Labels created:

```bash
gh label create initiative --repo jbelanger/agent-workflow-kit --description "Large outcome grouping specs, ADRs, tasks, and sequencing" --color 5319e7
gh label create spec --repo jbelanger/agent-workflow-kit --description "Behavior, contract, or user-visible semantics spec" --color 1d76db
gh label create adr --repo jbelanger/agent-workflow-kit --description "Architecture decision record" --color 0052cc
gh label create spike --repo jbelanger/agent-workflow-kit --description "Time-boxed investigation before production work" --color fbca04
gh label create task --repo jbelanger/agent-workflow-kit --description "Concrete executable unit of work" --color 0e8a16
gh label create refactor --repo jbelanger/agent-workflow-kit --description "Behavior-preserving structural improvement" --color c2e0c6
gh label create revision-needed --repo jbelanger/agent-workflow-kit --description "Review found items needing another implementation pass" --color d93f0b
gh label create needs-human-decision --repo jbelanger/agent-workflow-kit --description "Progress depends on a human direction choice" --color b60205
gh label create needs-source-evidence --repo jbelanger/agent-workflow-kit --description "Claims need source, code, log, or docs evidence before moving" --color 5319e7
gh label create human-only --repo jbelanger/agent-workflow-kit --description "Should not be autonomously executed by an agent" --color bfdadc
gh label create deferred --repo jbelanger/agent-workflow-kit --description "Intentionally retained but not moving now" --color cfd3d7
```

Added issue #1 to the project:

```bash
gh project item-add 1 --owner jbelanger \
  --url https://github.com/jbelanger/agent-workflow-kit/issues/1 \
  --format json
```

Set issue #1 project fields:

- `Workflow Status`: `Grooming`
- `Issue Type`: `Initiative`
- `Area`: `Workflow`
- `Merge Risk`: `Needs coordination`

Verification commands:

```bash
gh project field-list 1 --owner jbelanger --format json
gh project item-list 1 --owner jbelanger --format json
gh label list --repo jbelanger/agent-workflow-kit --limit 100
```

Verified item #1:

- Issue: `https://github.com/jbelanger/agent-workflow-kit/issues/1`
- `Workflow Status`: `Grooming`
- `Issue Type`: `Initiative`
- `Area`: `Workflow`
- `Merge Risk`: `Needs coordination`

