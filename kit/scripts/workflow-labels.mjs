export const issueTypeLabels = [
  ['initiative', '5319e7', 'Large outcome grouping specs, ADRs, tasks, and sequencing'],
  ['discovery', '5319e7', 'Vision, product, UX, creative, platform, or architecture discovery before specs'],
  ['spec', '1d76db', 'Behavior, contract, or user-visible semantics spec'],
  ['adr', '0052cc', 'Architecture decision record'],
  ['spike', 'fbca04', 'Time-boxed investigation before production work'],
  ['task', '0e8a16', 'Concrete executable unit of work'],
  ['bug', 'd73a4a', "Something isn't working"],
  ['refactor', 'c2e0c6', 'Behavior-preserving structural improvement'],
];

export const reviewSignalLabels = [
  ['revision-needed', 'd93f0b', 'Review found items needing another implementation pass'],
  ['needs-human-review', 'b60205', 'Human architecture or product judgment is needed before proceeding'],
];

export const nextWorkflowVerbs = [
  'init-awk',
  'triage-backlog',
  'pick-next-item',
  'groom-issue',
  'triage-finding',
  'discover-vision',
  'draft-artifact',
  'review-artifact',
  'breakdown-issue',
  'prepare-implementation',
  'work-issue-local',
  'review-local-changes',
  'review-revision-triage',
  'improve-workflow',
  'human-decision',
  'human-merge',
  'none',
];

const nextWorkflowLabelDescriptions = new Map([
  ['init-awk', 'Next AWK action: initialize or repair the installed workflow surface'],
  ['triage-backlog', 'Next AWK action: classify backlog state before choosing work'],
  ['pick-next-item', 'Next AWK action: choose the best ready or near-ready item'],
  ['groom-issue', 'Next AWK action: clarify work shape before routing'],
  ['triage-finding', 'Next AWK action: classify and route a material finding'],
  ['discover-vision', 'Next AWK action: resolve product, UX, creative, platform, or architecture direction'],
  ['draft-artifact', 'Next AWK action: draft or update a durable planning artifact'],
  ['review-artifact', 'Next AWK action: review and accept or revise a planning artifact'],
  ['breakdown-issue', 'Next AWK action: decompose accepted direction into executable tasks'],
  ['prepare-implementation', 'Next AWK action: re-brief a stale or incomplete ready task'],
  ['work-issue-local', 'Next AWK action: implement one ready issue after current-turn authorization'],
  ['review-local-changes', 'Next AWK action: review local changes before PR or handoff'],
  ['review-revision-triage', 'Next AWK action: triage non-trivial PR feedback or risk'],
  ['improve-workflow', 'Next AWK action: improve AWK process from observed friction'],
  ['human-decision', 'Next action is a human product, architecture, access, or scope decision'],
  ['human-merge', 'Next action is human-owned merge approval'],
  ['none', 'No further AWK action is currently selected'],
]);

export const nextWorkflowLabels = nextWorkflowVerbs.map((verb) => [
  `next:${verb}`,
  verb.startsWith('human-') ? 'b60205' : 'ededed',
  nextWorkflowLabelDescriptions.get(verb),
]);

export const requiredLabels = [
  ...issueTypeLabels,
  ...reviewSignalLabels,
  ...nextWorkflowLabels,
];
