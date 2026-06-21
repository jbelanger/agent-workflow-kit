#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { requiredLabels } from '../workflow-labels.mjs';

const defaultProjectTitle = 'Agent Workflow';
const defaultRootTitle = '[Initiative] Establish agent workflow';

const projectFields = [
  ['Status', ['Inbox', 'Grooming', 'Discovery', 'Drafting', 'Breakdown', 'Ready', 'In Progress', 'Review', 'Done', 'Deferred']],
  ['Issue Type', ['Initiative', 'Discovery', 'Spec', 'ADR', 'Spike', 'Task', 'Bug', 'Refactor']],
  ['Next Actor', ['Human', 'Agent', 'Either']],
  ['Decision Needed', ['None', 'Question', 'Approval', 'Research', 'Architecture', 'Access']],
  ['Area', ['Workflow', 'Agent Guidance', 'GitHub Config', 'CI', 'Docs', 'Governance', 'Unclassified']],
  ['Merge Risk', ['Parallel-safe', 'Needs coordination', 'Serial only']],
  ['Artifact State', ['None', 'Draft', 'Accepted', 'Implemented', 'Superseded']],
];

function usage() {
  return `Usage: node scripts/optional/setup-github-project.mjs [options]

Optional helper for repositories that want a GitHub Project board in addition to issues and PRs.
This script is not part of the default installed kit.

Options:
  --repo <owner/name>          Repository for labels and the root initiative.
  --owner <login>              GitHub Project owner. Defaults to the repository owner.
  --project-title <title>      Project title. Default: ${defaultProjectTitle}
  --root-title <title>         Root initiative title. Default: ${defaultRootTitle}
  --dry-run                    Print the contract and planned actions without calling GitHub.
  --verify-only                Read GitHub state and fail if required setup is missing.
  --no-recreate-new-fields     Do not normalize mismatched default fields on newly-created Projects.
  --help, -h                   Show this help.

Auth:
  gh must be authenticated with repo and project scopes:
    gh auth refresh -s repo -s project`;
}

function parseArgs(argv) {
  const options = {
    repo: undefined,
    owner: undefined,
    projectTitle: defaultProjectTitle,
    rootTitle: defaultRootTitle,
    dryRun: false,
    verifyOnly: false,
    recreateNewFields: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--repo') {
      options.repo = argv[i + 1];
      i += 1;
    } else if (arg === '--owner') {
      options.owner = argv[i + 1];
      i += 1;
    } else if (arg === '--project-title') {
      options.projectTitle = argv[i + 1];
      i += 1;
    } else if (arg === '--root-title') {
      options.rootTitle = argv[i + 1];
      i += 1;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--verify-only') {
      options.verifyOnly = true;
    } else if (arg === '--recreate-new-fields') {
      options.recreateNewFields = true;
    } else if (arg === '--no-recreate-new-fields') {
      options.recreateNewFields = false;
    } else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}\n\n${usage()}`);
    }
  }

  if (options.dryRun && options.verifyOnly) {
    throw new Error('--dry-run and --verify-only cannot be used together.');
  }

  return options;
}

function runGh(args, { parseJson = true } = {}) {
  const result = spawnSync('gh', args, { encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) {
    throw new Error(`gh ${args.join(' ')} failed\n\nstdout:\n${result.stdout}\n\nstderr:\n${result.stderr}`);
  }
  if (!parseJson) return result.stdout.trim();
  return JSON.parse(result.stdout);
}

function inferRepo() {
  const repo = runGh(['repo', 'view', '--json', 'nameWithOwner']);
  return repo.nameWithOwner;
}

function normalizeName(value) {
  return value.toLowerCase().replace(/\s+/g, '');
}

function issueBody() {
  return `## Outcome

Set up an optional GitHub Project board, issue labels, and root initiative for agent-assisted work.
Codex should still be able to resume from issues, PRs, and repo docs when no Project board is used.

## Source Docs

- \`docs/development/adrs/github-first-orchestration.md\`
- \`docs/development/workflow/ai-dev-workflow.md\`
- \`docs/development/workflow/github-first-flow.md\`

## Non-goals

- Do not make the Project board the source of durable planning truth.
- Do not auto-merge or silently accept durable artifacts.

## First Useful Next Step

Ask Codex to continue work. It should read GitHub issues, PRs, repo docs, and Project fields when
present before choosing the next workflow verb.`;
}

function printContract(options) {
  console.log('Optional GitHub Project setup contract');
  console.log(`Project owner: ${options.owner ?? '<repo owner>'}`);
  console.log(`Repository: ${options.repo ?? '<inferred from gh repo view>'}`);
  console.log(`Project title: ${options.projectTitle}`);
  console.log(`Root initiative: ${options.rootTitle}`);
  console.log('\nFields:');
  for (const [name, values] of projectFields) {
    console.log(`  ${name}: ${values.join(', ')}`);
  }
  console.log('\nLabels:');
  for (const [name] of requiredLabels) console.log(`  ${name}`);
}

function getProjects(owner) {
  return runGh(['project', 'list', '--owner', owner, '--format', 'json', '--limit', '100']).projects;
}

function findProject(owner, title) {
  return getProjects(owner).find((project) => project.title === title && !project.closed);
}

function ensureProject(options, actions) {
  const existing = findProject(options.owner, options.projectTitle);
  if (existing) {
    actions.unchanged.push(`Project exists: ${existing.url}`);
    return { ...existing, created: false };
  }

  if (options.verifyOnly) {
    actions.missing.push(`Project: ${options.projectTitle}`);
    return undefined;
  }

  runGh(['project', 'create', '--owner', options.owner, '--title', options.projectTitle, '--format', 'json']);
  const created = findProject(options.owner, options.projectTitle);
  if (!created) throw new Error(`Project was created but could not be found: ${options.projectTitle}`);
  actions.created.push(`Project: ${created.url}`);
  return { ...created, created: true };
}

function getFields(owner, projectNumber) {
  return runGh(['project', 'field-list', String(projectNumber), '--owner', owner, '--format', 'json']).fields;
}

function fieldMatches(field, expectedOptions) {
  if (field.type !== 'ProjectV2SingleSelectField') return false;
  const actualOptions = (field.options ?? []).map((option) => option.name);
  return actualOptions.length === expectedOptions.length &&
    actualOptions.every((option, index) => option === expectedOptions[index]);
}

function ensureFields(options, project, actions) {
  let fields = getFields(options.owner, project.number);

  for (const [name, expectedOptions] of projectFields) {
    let field = fields.find((candidate) => candidate.name === name);
    if (field && fieldMatches(field, expectedOptions)) {
      actions.unchanged.push(`Field: ${name}`);
      continue;
    }

    if (field && project.created && options.recreateNewFields && !options.verifyOnly) {
      runGh(['project', 'field-delete', '--id', field.id], { parseJson: false });
      actions.updated.push(`Deleted default mismatched field on new Project: ${name}`);
      fields = getFields(options.owner, project.number);
      field = undefined;
    }

    if (field) {
      actions.mismatched.push(`Field ${name}: expected options ${expectedOptions.join(', ')}`);
      continue;
    }

    if (options.verifyOnly) {
      actions.missing.push(`Field: ${name}`);
      continue;
    }

    runGh([
      'project',
      'field-create',
      String(project.number),
      '--owner',
      options.owner,
      '--name',
      name,
      '--data-type',
      'SINGLE_SELECT',
      '--single-select-options',
      expectedOptions.join(','),
      '--format',
      'json',
    ]);
    actions.created.push(`Field: ${name}`);
    fields = getFields(options.owner, project.number);
  }

  return fields;
}

function hasFieldProblems(actions) {
  return [...actions.missing, ...actions.mismatched].some((entry) => entry.startsWith('Field'));
}

function getLabels(repo) {
  return runGh(['label', 'list', '--repo', repo, '--json', 'name,color,description', '--limit', '200']);
}

function ensureLabels(options, actions) {
  const labels = getLabels(options.repo);
  const byName = new Map(labels.map((label) => [label.name.toLowerCase(), label]));

  for (const [name, color, description] of requiredLabels) {
    const existing = byName.get(name.toLowerCase());
    if (!existing) {
      if (options.verifyOnly) {
        actions.missing.push(`Label: ${name}`);
      } else {
        runGh(['label', 'create', name, '--repo', options.repo, '--color', color, '--description', description], { parseJson: false });
        actions.created.push(`Label: ${name}`);
      }
      continue;
    }

    if (existing.color?.toLowerCase() !== color.toLowerCase() || (existing.description ?? '') !== description) {
      actions.mismatched.push(`Label ${name}: exists with different color or description`);
    } else {
      actions.unchanged.push(`Label: ${name}`);
    }
  }
}

function getIssues(repo) {
  return runGh(['issue', 'list', '--repo', repo, '--state', 'all', '--limit', '200', '--json', 'number,title,state,url']);
}

function ensureRootIssue(options, actions) {
  const issues = getIssues(options.repo);
  let issue = issues.find((candidate) => candidate.title === options.rootTitle && candidate.state === 'OPEN');
  if (issue) {
    actions.unchanged.push(`Root initiative: ${issue.url}`);
    return issue;
  }

  const inactiveIssue = issues.find((candidate) => candidate.title === options.rootTitle);
  if (inactiveIssue) {
    actions.mismatched.push(`Root initiative is ${inactiveIssue.state.toLowerCase()}: ${inactiveIssue.url}`);
    return undefined;
  }

  if (options.verifyOnly) {
    actions.missing.push(`Root initiative: ${options.rootTitle}`);
    return undefined;
  }

  runGh([
    'issue',
    'create',
    '--repo',
    options.repo,
    '--title',
    options.rootTitle,
    '--body',
    issueBody(),
    '--label',
    'initiative',
  ], { parseJson: false });

  issue = getIssues(options.repo).find((candidate) => candidate.title === options.rootTitle && candidate.state === 'OPEN');
  if (!issue) throw new Error(`Root initiative was created but could not be found: ${options.rootTitle}`);
  actions.created.push(`Root initiative: ${issue.url}`);
  return issue;
}

function getItems(owner, projectNumber) {
  return runGh(['project', 'item-list', String(projectNumber), '--owner', owner, '--format', 'json', '--limit', '200']).items;
}

function findItem(items, repo, issue) {
  return items.find((item) =>
    item.content?.number === issue.number &&
    item.content?.repository === repo
  );
}

function ensureRootItem(options, project, issue, actions) {
  let item = findItem(getItems(options.owner, project.number), options.repo, issue);
  if (item) {
    actions.unchanged.push(`Project item for root initiative: ${item.id}`);
    return item;
  }

  if (options.verifyOnly) {
    actions.missing.push('Project item for root initiative');
    return undefined;
  }

  runGh(['project', 'item-add', String(project.number), '--owner', options.owner, '--url', issue.url, '--format', 'json']);
  item = findItem(getItems(options.owner, project.number), options.repo, issue);
  if (!item) throw new Error('Root initiative was added to the Project but the item could not be found.');
  actions.created.push(`Project item for root initiative: ${item.id}`);
  return item;
}

function optionId(fields, fieldName, optionName) {
  const field = fields.find((candidate) => candidate.name === fieldName);
  const option = field?.options?.find((candidate) => candidate.name === optionName);
  if (!field || !option) {
    throw new Error(`Cannot find Project option ${fieldName} = ${optionName}`);
  }
  return { fieldId: field.id, optionId: option.id };
}

function itemFieldValue(item, fieldName) {
  const key = Object.keys(item).find((candidate) => normalizeName(candidate) === normalizeName(fieldName));
  return key ? item[key] : undefined;
}

function ensureRootItemFields(options, project, fields, item, actions) {
  const desired = {
    Status: 'In Progress',
    'Issue Type': 'Initiative',
    'Next Actor': 'Agent',
    'Decision Needed': 'None',
    Area: 'Workflow',
    'Merge Risk': 'Needs coordination',
    'Artifact State': 'None',
  };

  for (const [fieldName, optionName] of Object.entries(desired)) {
    const current = itemFieldValue(item, fieldName);
    if (current === optionName) {
      actions.unchanged.push(`Root item field ${fieldName}: ${optionName}`);
      continue;
    }

    if (options.verifyOnly) {
      actions.mismatched.push(`Root item field ${fieldName}: expected ${optionName}, found ${current ?? '<unset>'}`);
      continue;
    }

    const { fieldId, optionId: singleSelectOptionId } = optionId(fields, fieldName, optionName);
    runGh([
      'project',
      'item-edit',
      '--id',
      item.id,
      '--project-id',
      project.id,
      '--field-id',
      fieldId,
      '--single-select-option-id',
      singleSelectOptionId,
    ], { parseJson: false });
    actions.updated.push(`Root item field ${fieldName}: ${optionName}`);
  }
}

function printActions(actions) {
  for (const [label, values] of Object.entries(actions)) {
    if (values.length === 0) continue;
    console.log(`\n${label}:`);
    for (const value of values) console.log(`  ${value}`);
  }
}

function setup(options) {
  const actions = {
    created: [],
    updated: [],
    unchanged: [],
    missing: [],
    mismatched: [],
  };

  if (options.dryRun) {
    printContract(options);
    console.log('\nDry run: no GitHub state was read or written.');
    return actions;
  }

  options.repo ??= inferRepo();
  options.owner ??= options.repo.split('/')[0];

  const project = ensureProject(options, actions);
  ensureLabels(options, actions);

  if (project) {
    const fields = ensureFields(options, project, actions);
    const rootIssue = ensureRootIssue(options, actions);
    if (rootIssue) {
      const item = ensureRootItem(options, project, rootIssue, actions);
      if (item && !hasFieldProblems(actions)) {
        ensureRootItemFields(options, project, fields, item, actions);
      }
    }

    console.log(`Project URL: ${project.url}`);
    console.log(`Project ID: ${project.id}`);
    console.log(`Project number: ${project.number}`);
  }

  printActions(actions);

  if (actions.missing.length > 0 || actions.mismatched.length > 0) {
    throw new Error('\nGitHub Project setup is incomplete. Review missing/mismatched entries above.');
  }

  return actions;
}

try {
  const options = parseArgs(process.argv.slice(2));
  setup(options);
  if (options.verifyOnly) {
    console.log('\nGitHub Project setup verification passed.');
  } else if (!options.dryRun) {
    console.log('\nGitHub Project setup complete.');
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
