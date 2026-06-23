# AWK Process Skills

Use this category for the core AWK loop:

- **Intake:** initialize, maintain, triage, pick the next item, and groom unclear work.
- **Shape:** discover only missing direction, draft or review durable artifacts, and break accepted
  direction into merge-safe work.
- **Execute:** implement one Ready issue in one branch or worktree; re-brief only when the issue is
  stale or incomplete.
- **Review:** inspect local changes, PRs, and revision feedback before human merge approval.
- **Improve:** record and fix workflow friction discovered while running the loop.

Do not put code-quality, domain-modeling, or tool-specific specialist skills here unless they are
part of the process loop.

## Shared State Rules

Every process skill that changes workflow state should return the exact replacement `AWK State`
block or a precise issue/PR comment that contains it. When GitHub labels are available, mirror
`Next workflow verb` with exactly one `next:*` label and remove stale `next:*` labels from that
item.

## Shared Loop Stop Conditions

After each process skill, stop and hand off instead of silently choosing another workflow verb when:

- human decision needed;
- no ready item exists;
- PR is waiting for human merge;
- validation cannot run;
- architecture fork detected;
- next workflow verb changes.
