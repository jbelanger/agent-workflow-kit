# GitHub Project Setup Script

Status: draft implementation guide for issue #3

The setup script codifies the manual GitHub Project work captured in
`docs/development/workflow/rebuild-trace.md`.

## Direction

The script should stay a thin, inspectable wrapper around `gh`, not a new workflow framework.

It owns:

- locating or creating the `Agent Workflow Kit` Project
- linking the repository to the Project
- configuring the built-in `Status` field
- creating or updating the custom fields `Issue Type`, `Area`, `Merge Risk`, and `Spec State`
- creating or updating workflow labels
- creating or locating the bootstrap milestone
- creating or locating the initial initiative and task issues by exact title
- adding those seed issues to the Project and GitHub sub-issue hierarchy

The seed issue bodies live in `docs/development/workflow/bootstrap-issues/` so they can be reviewed
and edited without changing script logic.

It does not own:

- Codex Cloud setup
- personal Codex authentication
- branch protection
- saved Project view layout, filtering, or visible-field configuration
- enabling or configuring GitHub Project built-in workflows
- autonomous merge
- long-term synchronization of issue bodies after humans edit them

## Usage

Run from the repository root:

```bash
scripts/setup-github-project.sh --repo jbelanger/agent-workflow-kit
```

Preview without contacting GitHub:

```bash
scripts/setup-github-project.sh --repo jbelanger/agent-workflow-kit --dry-run
```

Configure the board without seeding the initial issues:

```bash
scripts/setup-github-project.sh --repo jbelanger/agent-workflow-kit --skip-seed-issues
```

Force seed issues back to their initial workflow statuses:

```bash
scripts/setup-github-project.sh --repo jbelanger/agent-workflow-kit --reset-seed-status
```

## Authentication

The script requires:

- `gh`
- `jq`
- `gh auth login`
- the GitHub CLI `project` OAuth scope

If the `project` scope is missing, run:

```bash
gh auth refresh --hostname github.com -s project
```

## Idempotency Rules

The script locates the Project by title and seed issues by exact issue title. Rerunning it should not
duplicate Projects, fields, field options, labels, milestones, or seed issues.

For existing single-select fields, the script compares option names and order before calling
GitHub's field update mutation. It intentionally avoids rewriting option details when names already
match, because GitHub may regenerate option IDs when a field is rewritten. Option ID stability
matters for later automation.

When the script does need to update a single-select field, it preserves existing option IDs where
the option can be matched by name. For the `Status` field, it also treats the old `Complete` option
as the predecessor of `Done` so adopting GitHub's built-in automation vocabulary does not clear
existing item statuses.

For existing seed issues, the script ensures labels, milestone membership, Project membership,
classification fields, and sub-issue links. It does not overwrite existing issue bodies because
issue bodies may become human-edited planning records after creation.

For existing seed issues, the script does not reset the mutable Project `Status` field unless the
status is missing or `--reset-seed-status` is passed. This avoids moving real work backward when the
setup script is rerun during active dogfooding while still repairing empty setup state after an
initial field migration.

## Initial Issues

When seeding is enabled, the script creates or locates:

- `[Initiative] Build the agent workflow kit by dogfooding it`
- `[Task] Set up local Codex with ChatGPT Pro`
- `[Task] Create GitHub Project setup script`
- `[Task] Configure initial GitHub Project board`

The historical Project board setup task is closed after creation because the setup script itself
performs that work.

## Manual Project View Settings

GitHub's public Project GraphQL schema exposes saved views and built-in workflows for reading, but
does not currently expose supported mutations for creating/updating views or enabling workflows.
Configure these in the GitHub UI after running the script:

- Rename the main table/board views to meaningful names if desired.
- Keep `Spec State` hidden from normal work views.
- Add a `Specs` view filtered to `Issue Type: Spec` and show `Spec State` there.
- Enable the built-in `Item closed` and `Pull request merged` workflows so GitHub moves closed or
  merged items to `Done`.
