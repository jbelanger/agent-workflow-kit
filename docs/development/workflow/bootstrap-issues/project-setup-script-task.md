## Intent

Create a repeatable script that sets up this workflow's GitHub Project configuration from the commands we have run manually so far.

Parent initiative: #1

## Why this exists

The project board is now part of the workflow. If the setup only exists in chat history and manual terminal commands, it cannot be reliably rebuilt, reviewed, or reused in another repository.

## Scope

- Add a script under `scripts/` that can create or update the GitHub Project for a repository.
- Use `gh` and GitHub GraphQL/API calls, matching the commands captured in `docs/development/workflow/rebuild-trace.md`.
- Reuse GitHub built-in fields where possible, especially `Status`, `Parent issue`, and `Sub-issues progress`.
- Create/update only the custom fields we decided to keep: `Issue Type`, `Area`, `Merge Risk`, and `Spec State`.
- Create/update the labels used by the workflow.
- Add the repository to the project and create or locate the initial dogfooding initiative.
- Print the important resulting IDs and URLs needed for future automation.
- Document usage and required `gh` authentication scopes.

## Non-goals

- Do not replace the workflow docs with generated config.
- Do not introduce a large framework or dependency stack unless a concrete need appears.
- Do not create duplicate Projects, fields, labels, or initiative issues on rerun.
- Do not require Codex Cloud.

## Acceptance criteria

- [ ] The script is idempotent enough to rerun against `jbelanger/agent-workflow-kit` without duplicating labels, fields, field options, or the initial initiative.
- [ ] The script fails with a clear message when `gh` is missing, unauthenticated, or lacks the `project` scope.
- [ ] The script configures built-in `Status` options to match the workflow lifecycle: `Backlog`, `Grooming`, `Breakdown`, `Ready`, `In Progress`, `In Review`, `Revision Needed`, `Blocked`, `Done`.
- [ ] The script configures the custom fields and options recorded in the rebuild trace.
- [ ] The script records or prints the project URL, project ID, field IDs, and option IDs.
- [ ] Documentation shows the exact command to run for this repository.
- [ ] Validation evidence is added to the PR or issue comment, including what was run and what changed.

## Source material

- `docs/development/workflow/rebuild-trace.md`
- GitHub Project #1: https://github.com/users/jbelanger/projects/1
