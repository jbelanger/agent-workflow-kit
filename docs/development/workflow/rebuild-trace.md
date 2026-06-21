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

## 2026-06-18: Install Local Codex Surfaces

Moved active agent behavior out of development docs and into Codex discovery locations:

- `docs/development/agents/AGENTS.md` -> `AGENTS.md`
- `docs/development/agents/skills/` -> `.agents/skills/`

Removed `docs/development/agents/`. Development docs now hold workflow, specs, ADRs, and spike
records; active repository guidance belongs in root `AGENTS.md`, and active local skills belong in
`.agents/skills/`.

## 2026-06-19: Categorize Local Skills

Moved the active process skills into `.agents/skills/process/` and documented category folders for
specialist and domain skills.

Current active skill layout:

- `.agents/skills/process/<skill-name>/SKILL.md`: workflow/process skills.
- `.agents/skills/specialist/<skill-name>/SKILL.md`: repeated testing, diagnosis, code-quality,
  architecture, naming, or refactor skills.
- `.agents/skills/domain/`: placeholder for project or business-domain skills.

Category folders are navigation only. Individual skill folders keep the skill name as the final path
segment, and each `SKILL.md` remains the owning instruction file.

## 2026-06-19: Add Feedback Loop Specialist Skills

Adapted the TDD and bug-diagnosis ideas into local specialist skills instead of adding new board
states or a new process phase.

Added:

- `.agents/skills/specialist/tdd/SKILL.md`
- `.agents/skills/specialist/diagnose-bug/SKILL.md`

Wired `Feedback loop / test seam` into breakdown, implementation prep, local work, review, the task
issue template, and the PR template. The implementation rule is to choose the cheapest honest loop:
TDD for behavior work with a useful seam, diagnosis for unreproduced bugs, characterization tests for
risky refactors, or validation-only when tests would be brittle or lower signal.

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

## 2026-06-18: First Dogfooding Tasks

Used the new workflow board to create two concrete child tasks under the dogfooding initiative.

Decision:

- The Codex account setup task is `Ready` and labeled `human-only`, not `Blocked`.
- Rationale: the work is clear and ready for the human/operator, but an agent should not perform or
  automate a personal ChatGPT Pro login flow.
- The project setup script task is agent-executable and should codify the GitHub setup commands in
  this trace.

Task issues created:

- Issue #2: `https://github.com/jbelanger/agent-workflow-kit/issues/2`
  - Title: `[Task] Set up local Codex with ChatGPT Pro`
  - Labels: `task`, `human-only`
  - Project item ID: `PVTI_lAHOACJn-c4BbEGwzgwM808`
  - GitHub issue node ID: `I_kwDOS-yxRc8AAAABF-67tg`
- Issue #3: `https://github.com/jbelanger/agent-workflow-kit/issues/3`
  - Title: `[Task] Create GitHub Project setup script`
  - Labels: `task`
  - Project item ID: `PVTI_lAHOACJn-c4BbEGwzgwM80Q`
  - GitHub issue node ID: `I_kwDOS-yxRc8AAAABF-7Fvw`

Issue creation commands:

```bash
gh issue create \
  --repo jbelanger/agent-workflow-kit \
  --title "[Task] Set up local Codex with ChatGPT Pro" \
  --body-file /private/tmp/agent-workflow-kit-task-codex-auth.md \
  --label task \
  --label human-only

gh issue create \
  --repo jbelanger/agent-workflow-kit \
  --title "[Task] Create GitHub Project setup script" \
  --body-file /private/tmp/agent-workflow-kit-task-project-script.md \
  --label task
```

Add task issues to Project #1:

```bash
gh project item-add 1 \
  --owner jbelanger \
  --url https://github.com/jbelanger/agent-workflow-kit/issues/2 \
  --format json

gh project item-add 1 \
  --owner jbelanger \
  --url https://github.com/jbelanger/agent-workflow-kit/issues/3 \
  --format json
```

Set issue #2 project fields:

- built-in `Status`: `Ready`
- `Issue Type`: `Task`
- `Area`: `Agent Guidance`
- `Merge Risk`: `Parallel-safe`

```bash
gh project item-edit --project-id PVT_kwHOACJn-c4BbEGw \
  --id PVTI_lAHOACJn-c4BbEGwzgwM808 \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3SSg \
  --single-select-option-id b801b3e8

gh project item-edit --project-id PVT_kwHOACJn-c4BbEGw \
  --id PVTI_lAHOACJn-c4BbEGwzgwM808 \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3Sc0 \
  --single-select-option-id fadc5d85

gh project item-edit --project-id PVT_kwHOACJn-c4BbEGw \
  --id PVTI_lAHOACJn-c4BbEGwzgwM808 \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3SbE \
  --single-select-option-id 274257f6

gh project item-edit --project-id PVT_kwHOACJn-c4BbEGw \
  --id PVTI_lAHOACJn-c4BbEGwzgwM808 \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3Sb8 \
  --single-select-option-id 3694faa4
```

Set issue #3 project fields:

- built-in `Status`: `Ready`
- `Issue Type`: `Task`
- `Area`: `GitHub Config`
- `Merge Risk`: `Needs coordination`

```bash
gh project item-edit --project-id PVT_kwHOACJn-c4BbEGw \
  --id PVTI_lAHOACJn-c4BbEGwzgwM80Q \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3SSg \
  --single-select-option-id b801b3e8

gh project item-edit --project-id PVT_kwHOACJn-c4BbEGw \
  --id PVTI_lAHOACJn-c4BbEGwzgwM80Q \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3Sc0 \
  --single-select-option-id fadc5d85

gh project item-edit --project-id PVT_kwHOACJn-c4BbEGw \
  --id PVTI_lAHOACJn-c4BbEGwzgwM80Q \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3SbE \
  --single-select-option-id b12c1a44

gh project item-edit --project-id PVT_kwHOACJn-c4BbEGw \
  --id PVTI_lAHOACJn-c4BbEGwzgwM80Q \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3Sb8 \
  --single-select-option-id 0159a935
```

Add both tasks as built-in GitHub sub-issues of initiative #1:

```bash
gh api graphql \
  -F parent=I_kwDOS-yxRc8AAAABF-0AqA \
  -F sub=I_kwDOS-yxRc8AAAABF-67tg \
  -f query='mutation($parent:ID!, $sub:ID!) { addSubIssue(input: {issueId: $parent, subIssueId: $sub}) { issue { id number } subIssue { id number } } }'

gh api graphql \
  -F parent=I_kwDOS-yxRc8AAAABF-0AqA \
  -F sub=I_kwDOS-yxRc8AAAABF-7Fvw \
  -f query='mutation($parent:ID!, $sub:ID!) { addSubIssue(input: {issueId: $parent, subIssueId: $sub}) { issue { id number } subIssue { id number } } }'
```

Verification commands:

```bash
gh project item-list 1 --owner jbelanger --format json --limit 10

gh api graphql \
  -f query='query($owner:String!, $repo:String!, $number:Int!) { repository(owner:$owner, name:$repo) { issue(number:$number) { number title subIssues(first:10) { nodes { number title url } } } } }' \
  -F owner=jbelanger \
  -F repo=agent-workflow-kit \
  -F number=1
```

Verified project state:

- Issue #2: `Status = Ready`, `Issue Type = Task`, `Area = Agent Guidance`,
  `Merge Risk = Parallel-safe`, labels `task`, `human-only`
- Issue #3: `Status = Ready`, `Issue Type = Task`, `Area = GitHub Config`,
  `Merge Risk = Needs coordination`, label `task`
- Issue #1 sub-issues: #2 and #3

## 2026-06-18: Bootstrap Milestone

Created the first milestone:

- Milestone: `v0 - Project Bootstrap`
- URL: `https://github.com/jbelanger/agent-workflow-kit/milestone/1`
- Number: `1`
- Node ID: `MI_kwDOS-yxRc4A-pOt`
- Description: `Initial setup needed before the workflow can dogfood itself: local Codex account setup plus the already-completed GitHub Project board configuration.`

Decision:

- Use milestones for delivery slices, not workflow status.
- Keep `v0 - Project Bootstrap` focused on the minimum setup required before the workflow can
  manage itself.
- Include local Codex setup and the already-completed GitHub Project board setup.
- Do not include the project setup script task in this milestone; that task belongs to a later
  reproducibility/hardening slice.

Milestone creation command:

```bash
gh api repos/jbelanger/agent-workflow-kit/milestones \
  -f title='v0 - Project Bootstrap' \
  -f state=open \
  -f description='Initial setup needed before the workflow can dogfood itself: local Codex account setup plus the already-completed GitHub Project board configuration.'
```

Added issue #2 to the milestone:

```bash
gh issue edit 2 \
  --repo jbelanger/agent-workflow-kit \
  --milestone 'v0 - Project Bootstrap'
```

Created a historical closed task for the manual GitHub Project setup:

- Issue #4: `https://github.com/jbelanger/agent-workflow-kit/issues/4`
- Title: `[Task] Configure initial GitHub Project board`
- Labels: `task`
- Milestone: `v0 - Project Bootstrap`
- GitHub issue node ID: `I_kwDOS-yxRc8AAAABF-9lig`
- Project item ID: `PVTI_lAHOACJn-c4BbEGwzgwM-OA`

Issue creation command:

```bash
gh issue create \
  --repo jbelanger/agent-workflow-kit \
  --title "[Task] Configure initial GitHub Project board" \
  --body-file /private/tmp/agent-workflow-kit-task-manual-project-setup.md \
  --label task \
  --milestone "v0 - Project Bootstrap"
```

Added issue #4 to Project #1:

```bash
gh project item-add 1 \
  --owner jbelanger \
  --url https://github.com/jbelanger/agent-workflow-kit/issues/4 \
  --format json
```

Set issue #4 project fields:

- built-in `Status`: `Complete`
- `Issue Type`: `Task`
- `Area`: `GitHub Config`
- `Merge Risk`: `Needs coordination`

```bash
gh project item-edit --project-id PVT_kwHOACJn-c4BbEGw \
  --id PVTI_lAHOACJn-c4BbEGwzgwM-OA \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3SSg \
  --single-select-option-id 3fe3f8c2

gh project item-edit --project-id PVT_kwHOACJn-c4BbEGw \
  --id PVTI_lAHOACJn-c4BbEGwzgwM-OA \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3Sc0 \
  --single-select-option-id fadc5d85

gh project item-edit --project-id PVT_kwHOACJn-c4BbEGw \
  --id PVTI_lAHOACJn-c4BbEGwzgwM-OA \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3SbE \
  --single-select-option-id b12c1a44

gh project item-edit --project-id PVT_kwHOACJn-c4BbEGw \
  --id PVTI_lAHOACJn-c4BbEGwzgwM-OA \
  --field-id PVTSSF_lAHOACJn-c4BbEGwzhV3Sb8 \
  --single-select-option-id 0159a935
```

Added issue #4 as a built-in GitHub sub-issue of initiative #1:

```bash
gh api graphql \
  -F parent=I_kwDOS-yxRc8AAAABF-0AqA \
  -F sub=I_kwDOS-yxRc8AAAABF-9lig \
  -f query='mutation($parent:ID!, $sub:ID!) { addSubIssue(input: {issueId: $parent, subIssueId: $sub}) { issue { id number } subIssue { id number } } }'
```

Closed issue #4 as completed historical work:

```bash
gh issue close 4 \
  --repo jbelanger/agent-workflow-kit \
  --comment "Closed as a historical bootstrap record. The GitHub Project setup was completed manually before this task issue existed; the rebuild trace contains the commands and verified IDs."
```

Verification commands:

```bash
gh issue list \
  --repo jbelanger/agent-workflow-kit \
  --state all \
  --milestone "v0 - Project Bootstrap" \
  --json number,title,state,labels,milestone,url

gh project item-list 1 --owner jbelanger --format json --limit 20
```

Verified milestone state:

- Issue #2: open, in milestone `v0 - Project Bootstrap`
- Issue #4: closed, in milestone `v0 - Project Bootstrap`
- Issue #3: not in milestone `v0 - Project Bootstrap`
