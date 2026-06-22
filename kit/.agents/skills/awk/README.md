# Agent Workflow Kit Skills

AWK skills are installed under `.agents/skills/awk/` so they are visible as kit-provided workflow
tools rather than project-owned domain skills.

## Flow At A Glance

AWK is a Kanban-like GitHub issue flow:

```text
Inbox -> Grooming -> Discovery/Vision or Drafting -> Breakdown -> Ready -> In Progress -> Review -> Done
```

Use the process skills as workflow verbs:

| State or need | Use |
| --- | --- |
| New repo setup | `process/init-awk` |
| Existing install update or migration | `process/maintain-awk` |
| Unknown next step | `process/continue-work` |
| Vague or unclear work | `process/groom-issue` |
| Missing high-level product, UX, creative, platform, or architecture direction | `process/discover-vision` |
| Durable spec, ADR, vision brief, or spike needed | `process/draft-artifact` then `process/review-artifact` |
| Accepted direction needs task boundaries | `process/breakdown-issue` |
| One child issue needs an executable brief | `process/prepare-implementation` |
| Prepared implementation work | `process/work-issue-local` |
| Local diff or PR lacks agent review | `process/review-local-changes` |
| Non-trivial PR feedback or architecture-sensitive review | `process/review-revision-triage` |
| Process weakness found during dogfood or delivery | `process/improve-workflow` |

Do not skip from vague idea or Inbox directly to implementation. Implementation starts only after
GitHub issue state, visible grooming, breakdown, and implementation preparation make the task safe
for one agent.

- `process/`: workflow initialization, planning, implementation routing, and review routing skills.
- `specialist/`: advisory lenses used by AWK process skills when product, UX, architecture,
  validation, diagnosis, or TDD expertise is useful.
- `domain/`: placeholder for AWK-compatible domain skill packaging. Project-specific domain skills
  may also exist elsewhere under `.agents/skills/`.

Each skill still owns its own folder and `SKILL.md`:

```text
.agents/skills/awk/<category>/<skill-name>/SKILL.md
```

Start with `process/init-awk` before running AWK in a new repository. Use `process/maintain-awk` to
update or migrate an existing install.
