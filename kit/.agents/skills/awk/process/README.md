# AWK Process Skills

Use this category for the core AWK loop:

- **Intake:** initialize, maintain, triage, pick the next item, and groom unclear work.
- **Shape:** discover only missing direction, draft or review durable artifacts, and break accepted
  direction into merge-safe work.
- **Execute:** implement one Ready issue in one branch or worktree; re-brief only when the issue is
  stale or incomplete.
- **Review:** inspect local changes, PRs, and revision feedback before human merge approval.
- **Findings / Improve:** route material findings, and record or fix workflow friction discovered
  while running the loop.

Do not put code-quality, domain-modeling, or tool-specific specialist skills here unless they are
part of the process loop.

## Shared State Rules

Every process skill that changes workflow state should return the precise issue/PR comment text
and label changes needed to make the handoff visible. When GitHub labels are available, keep exactly
one `next:*` label on the item and remove stale `next:*` labels. The local workflow cache is
rebuilt from GitHub when needed; do not ask humans to maintain hidden body metadata blocks.

Every process skill should also classify material findings before continuing. A material finding is
evidence that could change product/design direction, architecture, validation targets, scope,
accepted artifacts, or the readiness of the current work. Record the evidence, implication, owner,
and recommended next workflow verb in visible issue/PR prose before routing it. Use `triage-finding`
when the implication or route is not obvious.

## Shared Loop Stop Conditions

After each process skill, stop and hand off instead of silently choosing another workflow verb when:

- human decision needed;
- no ready item exists;
- PR is waiting for human merge;
- validation cannot run;
- architecture fork detected;
- material finding requires product/design, architecture, validation, scope, or artifact judgment;
- next workflow verb changes.

Here, handoff means returning the routing result, exact issue/PR comment text, and label changes for
the next skill. Do not invoke the next skill in the same uninterrupted worker loop. A human answer to
a planning question may choose the next route or slice, but it does not authorize a code-mutating
verb unless it is a separate explicit implementation assignment after visible Ready state exists.
