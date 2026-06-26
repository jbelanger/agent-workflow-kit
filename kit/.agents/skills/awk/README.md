# Agent Workflow Kit Skills

AWK skills are installed under `.agents/skills/awk/` so they are visible as kit-provided workflow
tools rather than project-owned domain skills. Human-readable AWK process references live under
`docs/awk/`; project-specific artifacts live under `docs/development/`.

## Flow At A Glance

AWK is a lightweight agent-loop contract. Choose the workflow verb by task shape, then apply only
the gates needed to make the next handoff safe:

```text
Intake -> Shape -> Execute -> Review -> Improve
```

Use the process skills as workflow verbs:

| Loop phase or need | Use |
| --- | --- |
| Setup or repair | `process/init-awk`, `process/maintain-awk` |
| Unknown next step | `process/continue-work` |
| Intake | `process/groom-issue` |
| Shape | `process/discover-vision`, `process/draft-artifact`, `process/review-artifact`, `process/breakdown-issue` |
| Execute | `process/work-issue-local`; `process/prepare-implementation` only when a stale or incomplete Ready issue needs a compact re-brief |
| Review | `process/review-local-changes`, `process/review-revision-triage` |
| Findings / Improve | `process/triage-finding`, `process/improve-workflow` |

Do not skip from vague idea or Inbox directly to implementation. A fast lane may skip discovery,
spec, ADR, a separate artifact, or a separate implementation re-brief only when the issue records a
visible `DIRECT_TASK` rationale, one-agent scope, acceptance criteria, validation, and merge risk.
Implementation starts only after GitHub issue state and the smallest honest readiness record make
the task safe for one agent.
Runtime worker loops are ephemeral; GitHub issues, PRs, and repo docs remain the durable AWK state.
`process/continue-work` owns the detailed task-shape routing table; keep this README as an index.

- `process/`: workflow initialization, planning, implementation routing, and review routing skills.
- `specialist/`: procedural specialist skills for TDD and bug diagnosis. Discovery lenses live
  inside `process/discover-vision`.
- `domain/`: placeholder for AWK-compatible domain skill packaging. Project-specific domain skills
  may also exist elsewhere under `.agents/skills/`.
- Advisory experts are optional project-owned expert voices, not AWK workflow verbs. Prefer
  installing reusable experts under `.agents/skills/advisory/<name>/` and listing them in
  `.agents/advisory-experts.md` so `triage-finding`, `discover-vision`, and humans can find the
  right sparring partner without adding another `next:*` route.

Each skill still owns its own folder and `SKILL.md`:

```text
.agents/skills/awk/<category>/<skill-name>/SKILL.md
```

Start with `process/init-awk` before running AWK in a new repository. Use `process/maintain-awk` to
update or migrate an existing install.
