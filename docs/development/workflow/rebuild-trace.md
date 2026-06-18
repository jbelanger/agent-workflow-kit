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

GitHub created a default `Status` field with `Todo`, `In Progress`, and `Done`. Reuse that built-in
field for the workflow lifecycle instead of creating a parallel lifecycle field.

Update built-in `Status` options through GraphQL. In this run, the built-in `Status` field ID was
`PVTSSF_lAHOACJn-c4BbEGwzhV3SSg`.

```bash
gh api graphql \
  -f query='mutation($fieldId: ID!, $options: [ProjectV2SingleSelectFieldOptionInput!]) { updateProjectV2Field(input: { fieldId: $fieldId, singleSelectOptions: $options }) { projectV2Field { ... on ProjectV2SingleSelectField { id name options { id name } } } } }' \
  -F fieldId=PVTSSF_lAHOACJn-c4BbEGwzhV3SSg \
  -F 'options[][name]=Backlog' \
  -F 'options[][color]=GRAY' \
  -F 'options[][description]=Captured but not currently moving' \
  -F 'options[][name]=Grooming' \
  -F 'options[][color]=YELLOW' \
  -F 'options[][description]=Clarifying intent and deciding next output' \
  -F 'options[][name]=Breakdown' \
  -F 'options[][color]=PURPLE' \
  -F 'options[][description]=Accepted direction being split into executable issues' \
  -F 'options[][name]=Ready' \
  -F 'options[][color]=BLUE' \
  -F 'options[][description]=Scoped and ready for autonomous work' \
  -F 'options[][name]=In Progress' \
  -F 'options[][color]=ORANGE' \
  -F 'options[][description]=Actively being implemented or drafted' \
  -F 'options[][name]=In Review' \
  -F 'options[][color]=PINK' \
  -F 'options[][description]=PR or artifact is ready for review' \
  -F 'options[][name]=Revision Needed' \
  -F 'options[][color]=RED' \
  -F 'options[][description]=Review found changes needing another implementation pass' \
  -F 'options[][name]=Blocked' \
  -F 'options[][color]=RED' \
  -F 'options[][description]=Progress depends on a real blocker' \
  -F 'options[][name]=Complete' \
  -F 'options[][color]=GREEN' \
  -F 'options[][description]=Done and no required work remains'
```

Custom project fields:

```bash
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

- built-in `Status`: `Backlog`, `Grooming`, `Breakdown`, `Ready`, `In Progress`, `In Review`,
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

- built-in `Status`: `Grooming`
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
- built-in `Status`: `Grooming`
- `Issue Type`: `Initiative`
- `Area`: `Workflow`
- `Merge Risk`: `Needs coordination`

Posted a status comment on issue #1:

- `https://github.com/jbelanger/agent-workflow-kit/issues/1#issuecomment-4746672891`

Correction note:

- A temporary custom `Workflow Status` field was initially created.
- The UI made it clear this duplicated GitHub's built-in `Status`.
- The built-in `Status` field was updated to use the full lifecycle.
- Issue #1 was moved to built-in `Status = Grooming`.
- The custom `Workflow Status` field was deleted.

Actual migration commands from the temporary duplicate field to built-in `Status`:

```bash
gh project item-edit \
  --id PVTI_lAHOACJn-c4BbEGwzgwM5ls \
  --project-id PVT_kwHOACJn-c4BbEGw \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3SSg \
  --single-select-option-id 55cd59d8

gh project field-delete \
  --id PVTSSF_lAHOACJn-c4BbEGwzhV3Sc4 \
  --format json
```

Posted a status comment on issue #1:

- `https://github.com/jbelanger/agent-workflow-kit/issues/1#issuecomment-4746713802`
