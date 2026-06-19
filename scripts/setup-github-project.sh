#!/usr/bin/env bash
set -euo pipefail

PROJECT_TITLE="Agent Workflow Kit"
PROJECT_OWNER=""
REPO=""
SEED_ISSUES=1
RESET_SEED_STATUS=0
DRY_RUN=0

PROJECT_NUMBER=""
PROJECT_ID=""
PROJECT_URL=""
FIELDS_JSON=""
FORCE_NEXT_OPTION_UPDATE=0
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SEED_ISSUE_DIR="$REPO_ROOT/docs/development/workflow/bootstrap-issues"

usage() {
  cat <<'USAGE'
Usage:
  scripts/setup-github-project.sh --repo OWNER/REPO [options]

Options:
  --repo OWNER/REPO           Repository to configure. Required.
  --project-owner OWNER       Owner of the GitHub Project. Defaults to repo owner.
  --project-title TITLE       Project title. Defaults to "Agent Workflow Kit".
  --skip-seed-issues          Configure project, labels, and milestone only.
  --reset-seed-status         Reset seed issue project Status values to initial defaults.
  --dry-run                   Print the setup plan without contacting GitHub.
  -h, --help                  Show this help.

The script is intentionally local-first and uses the GitHub CLI. It creates or
updates the workflow Project, labels, bootstrap milestone, and initial issues.
USAGE
}

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

note() {
  printf '==> %s\n' "$*" >&2
}

ok() {
  printf '    %s\n' "$*" >&2
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --repo)
      [ "$#" -ge 2 ] || die "--repo requires OWNER/REPO"
      REPO="$2"
      shift 2
      ;;
    --project-owner)
      [ "$#" -ge 2 ] || die "--project-owner requires OWNER"
      PROJECT_OWNER="$2"
      shift 2
      ;;
    --project-title)
      [ "$#" -ge 2 ] || die "--project-title requires TITLE"
      PROJECT_TITLE="$2"
      shift 2
      ;;
    --skip-seed-issues)
      SEED_ISSUES=0
      shift
      ;;
    --reset-seed-status)
      RESET_SEED_STATUS=1
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      die "unknown argument: $1"
      ;;
  esac
done

[ -n "$REPO" ] || die "--repo OWNER/REPO is required"
case "$REPO" in
  */*) ;;
  *) die "--repo must be formatted as OWNER/REPO" ;;
esac

REPO_OWNER="${REPO%%/*}"
REPO_NAME="${REPO#*/}"
if [ -z "$PROJECT_OWNER" ]; then
  PROJECT_OWNER="$REPO_OWNER"
fi

if [ "$DRY_RUN" -eq 1 ]; then
  cat <<EOF
Dry run: no GitHub changes will be made.

Repository:      $REPO
Project owner:   $PROJECT_OWNER
Project title:   $PROJECT_TITLE
Seed issues:     $SEED_ISSUES
Reset statuses:  $RESET_SEED_STATUS

Planned setup:
- create or locate the GitHub Project
- link the repository to the Project
- configure built-in Status options
- create or update Issue Type, Area, Merge Risk, and Spec State fields
- create or update workflow labels
- create or locate milestone "v0 - Project Bootstrap"
- create or locate initial issues #1-#4 by title, unless --skip-seed-issues is set
- add seed issues to the Project and built-in sub-issue hierarchy

Required live credentials:
- gh authenticated for github.com
- gh token includes the "project" scope
EOF
  exit 0
fi

command -v gh >/dev/null 2>&1 || die "gh is required. Install GitHub CLI and run gh auth login."
command -v jq >/dev/null 2>&1 || die "jq is required for JSON parsing."

AUTH_OUTPUT="$(gh auth status --hostname github.com 2>&1)" || {
  printf '%s\n' "$AUTH_OUTPUT" >&2
  die "gh is not authenticated. Run: gh auth login"
}
case "$AUTH_OUTPUT" in
  *"Token scopes:"*"project"*) ;;
  *)
    printf '%s\n' "$AUTH_OUTPUT" >&2
    die "gh is authenticated but missing the project scope. Run: gh auth refresh --hostname github.com -s project"
    ;;
esac

gh repo view "$REPO" --json nameWithOwner >/dev/null ||
  die "cannot access repository $REPO with the active gh account"

project_row() {
  gh project list --owner "$PROJECT_OWNER" --format json --limit 100 |
    jq -r --arg title "$PROJECT_TITLE" '
      .projects[]
      | select(.title == $title and .closed == false)
      | [.number, .id, .url]
      | @tsv
    ' |
    head -n 1
}

refresh_fields() {
  FIELDS_JSON="$(gh project field-list "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --format json)"
}

field_id_by_name() {
  jq -r --arg name "$1" '.fields[] | select(.name == $name) | .id' <<<"$FIELDS_JSON" | head -n 1
}

field_type_by_name() {
  jq -r --arg name "$1" '.fields[] | select(.name == $name) | .type' <<<"$FIELDS_JSON" | head -n 1
}

option_id_by_name() {
  local field_name="$1"
  local option_name="$2"
  jq -r --arg field "$field_name" --arg option "$option_name" '
    .fields[]
    | select(.name == $field)
    | .options[]
    | select(.name == $option)
    | .id
  ' <<<"$FIELDS_JSON" | head -n 1
}

ensure_project() {
  note "Ensuring Project \"$PROJECT_TITLE\" for $PROJECT_OWNER"
  local row
  row="$(project_row)"
  if [ -z "$row" ]; then
    local created
    created="$(gh project create --owner "$PROJECT_OWNER" --title "$PROJECT_TITLE" --format json)"
    PROJECT_NUMBER="$(jq -r '.number' <<<"$created")"
    PROJECT_ID="$(jq -r '.id' <<<"$created")"
    PROJECT_URL="$(jq -r '.url' <<<"$created")"
    ok "created Project #$PROJECT_NUMBER: $PROJECT_URL"
  else
    IFS=$'\t' read -r PROJECT_NUMBER PROJECT_ID PROJECT_URL <<<"$row"
    ok "found Project #$PROJECT_NUMBER: $PROJECT_URL"
  fi
}

project_has_repo_link() {
  gh api graphql \
    -F project="$PROJECT_ID" \
    -f query='query($project:ID!) { node(id:$project) { ... on ProjectV2 { repositories(first:100) { nodes { nameWithOwner } } } } }' |
    jq -e --arg repo "$REPO" '.data.node.repositories.nodes[]? | select(.nameWithOwner == $repo)' >/dev/null
}

ensure_project_link() {
  note "Ensuring Project is linked to $REPO"
  if project_has_repo_link; then
    ok "repository already linked"
    return
  fi

  if [ "$PROJECT_OWNER" != "$REPO_OWNER" ]; then
    die "automatic gh project link currently expects project owner and repo owner to match"
  fi

  gh project link "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --repo "$REPO_NAME"
  ok "linked repository"
}

FIELD_UPDATE_MUTATION='mutation($fieldId: ID!, $options: [ProjectV2SingleSelectFieldOptionInput!]) { updateProjectV2Field(input: { fieldId: $fieldId, singleSelectOptions: $options }) { projectV2Field { ... on ProjectV2SingleSelectField { id name options { id name } } } } }'

update_single_select_options() {
  local field_id="$1"
  shift
  local args=(-f "query=$FIELD_UPDATE_MUTATION" -F "fieldId=$field_id")
  local desired_names_file
  local actual_names_file
  desired_names_file="$(mktemp "$tmpdir/desired-option-names.XXXXXX")"
  actual_names_file="$(mktemp "$tmpdir/actual-option-names.XXXXXX")"

  while [ "$#" -gt 0 ]; do
    local option_id
    option_id="$(jq -r --arg id "$field_id" --arg name "$1" '
      .fields[]
      | select(.id == $id)
      | .options[]?
      | select(.name == $name)
      | .id
    ' <<<"$FIELDS_JSON" | head -n 1)"
    if [ -z "$option_id" ] && [ "$field_id" = "$(field_id_by_name "Status")" ] && [ "$1" = "Done" ]; then
      option_id="$(jq -r --arg id "$field_id" '
        .fields[]
        | select(.id == $id)
        | .options[]?
        | select(.name == "Complete")
        | .id
      ' <<<"$FIELDS_JSON" | head -n 1)"
    fi

    printf '%s\n' "$1" >>"$desired_names_file"
    [ -n "$option_id" ] && args+=(-F "options[][id]=$option_id")
    args+=(-F "options[][name]=$1")
    args+=(-F "options[][color]=$2")
    args+=(-F "options[][description]=$3")
    shift 3
  done

  jq -r --arg id "$field_id" '
    .fields[]
    | select(.id == $id)
    | .options[]?
    | .name
  ' <<<"$FIELDS_JSON" >"$actual_names_file"

  if [ "$FORCE_NEXT_OPTION_UPDATE" -eq 0 ] && cmp -s "$desired_names_file" "$actual_names_file"; then
    return
  fi

  gh api graphql "${args[@]}" >/dev/null
  FORCE_NEXT_OPTION_UPDATE=0
  refresh_fields
}

ensure_single_select_field() {
  local name="$1"
  local csv_options="$2"
  local field_id
  local field_type

  refresh_fields
  field_id="$(field_id_by_name "$name")"
  field_type="$(field_type_by_name "$name")"

  if [ -n "$field_id" ]; then
    [ "$field_type" = "ProjectV2SingleSelectField" ] ||
      die "Project field \"$name\" exists but is $field_type, not ProjectV2SingleSelectField"
    FORCE_NEXT_OPTION_UPDATE=0
    ok "found field \"$name\""
    return
  fi

  gh project field-create "$PROJECT_NUMBER" \
    --owner "$PROJECT_OWNER" \
    --name "$name" \
    --data-type SINGLE_SELECT \
    --single-select-options "$csv_options" \
    --format json >/dev/null
  ok "created field \"$name\""
  FORCE_NEXT_OPTION_UPDATE=1
  refresh_fields
}

ensure_project_fields() {
  note "Configuring Project fields"
  refresh_fields

  local status_field_id
  status_field_id="$(field_id_by_name "Status")"
  [ -n "$status_field_id" ] || die "GitHub did not provide a built-in Status field"

  update_single_select_options "$status_field_id" \
    "Backlog" "GRAY" "Captured but not currently moving" \
    "Grooming" "YELLOW" "Clarifying intent and deciding next output" \
    "Breakdown" "PURPLE" "Accepted direction being split into executable issues" \
    "Ready" "BLUE" "Scoped and ready for autonomous work" \
    "In Progress" "ORANGE" "Actively being implemented or drafted" \
    "In Review" "PINK" "PR or artifact is ready for review" \
    "Revision Needed" "RED" "Review found changes needing another implementation pass" \
    "Blocked" "RED" "Progress depends on a real blocker" \
    "Done" "GREEN" "Done and no required work remains"
  ok "configured built-in Status options"

  ensure_single_select_field "Issue Type" "Initiative,Spec,ADR,Spike,Task,Bug,Refactor"
  update_single_select_options "$(field_id_by_name "Issue Type")" \
    "Initiative" "PURPLE" "Large outcome grouping specs, ADRs, tasks, and sequencing" \
    "Spec" "BLUE" "Behavior, contract, or user-visible semantics spec" \
    "ADR" "BLUE" "Architecture decision record" \
    "Spike" "YELLOW" "Time-boxed investigation before production work" \
    "Task" "GREEN" "Concrete executable unit of work" \
    "Bug" "RED" "Defect or regression" \
    "Refactor" "GREEN" "Behavior-preserving structural improvement"

  ensure_single_select_field "Area" "Workflow,Agent Guidance,GitHub Config,CI,Docs,Governance,Unclassified"
  update_single_select_options "$(field_id_by_name "Area")" \
    "Workflow" "PURPLE" "Process, board, review, and delivery-loop documentation" \
    "Agent Guidance" "BLUE" "Agent instructions, skills, prompts, and model behavior" \
    "GitHub Config" "GREEN" "GitHub issue, project, label, branch, and repository setup" \
    "CI" "YELLOW" "Continuous integration, checks, and automated review" \
    "Docs" "GRAY" "Durable development documentation" \
    "Governance" "RED" "Human-only policy, approvals, and merge controls" \
    "Unclassified" "GRAY" "Temporary area until grooming classifies ownership"

  ensure_single_select_field "Merge Risk" "Parallel-safe,Needs coordination,Serial only"
  update_single_select_options "$(field_id_by_name "Merge Risk")" \
    "Parallel-safe" "GREEN" "Can run alongside other work with ordinary review" \
    "Needs coordination" "YELLOW" "May touch shared setup or sequencing; coordinate before merge" \
    "Serial only" "RED" "Should not run concurrently with overlapping work"

  ensure_single_select_field "Spec State" "Draft,Accepted,Implemented,Superseded"
  update_single_select_options "$(field_id_by_name "Spec State")" \
    "Draft" "YELLOW" "Proposed behavior or contract" \
    "Accepted" "BLUE" "Human-approved target for implementation" \
    "Implemented" "GREEN" "Merged code matches the accepted spec" \
    "Superseded" "GRAY" "A newer decision replaced it"

  refresh_fields
}

ensure_labels() {
  note "Configuring workflow labels"
  gh label create initiative --repo "$REPO" --description "Large outcome grouping specs, ADRs, tasks, and sequencing" --color 5319e7 --force >/dev/null
  gh label create spec --repo "$REPO" --description "Behavior, contract, or user-visible semantics spec" --color 1d76db --force >/dev/null
  gh label create adr --repo "$REPO" --description "Architecture decision record" --color 0052cc --force >/dev/null
  gh label create spike --repo "$REPO" --description "Time-boxed investigation before production work" --color fbca04 --force >/dev/null
  gh label create task --repo "$REPO" --description "Concrete executable unit of work" --color 0e8a16 --force >/dev/null
  gh label create refactor --repo "$REPO" --description "Behavior-preserving structural improvement" --color c2e0c6 --force >/dev/null
  gh label create revision-needed --repo "$REPO" --description "Review found items needing another implementation pass" --color d93f0b --force >/dev/null
  gh label create needs-human-decision --repo "$REPO" --description "Progress depends on a human direction choice" --color b60205 --force >/dev/null
  gh label create needs-source-evidence --repo "$REPO" --description "Claims need source, code, log, or docs evidence before moving" --color 5319e7 --force >/dev/null
  gh label create human-only --repo "$REPO" --description "Should not be autonomously executed by an agent" --color bfdadc --force >/dev/null
  gh label create deferred --repo "$REPO" --description "Intentionally retained but not moving now" --color cfd3d7 --force >/dev/null
  ok "labels configured"
}

ensure_milestone() {
  note "Ensuring bootstrap milestone"
  local existing
  existing="$(gh api "repos/$REPO/milestones" --paginate |
    jq -r '.[] | select(.title == "v0 - Project Bootstrap") | .number' |
    head -n 1)"

  if [ -n "$existing" ]; then
    ok "found milestone #$existing: v0 - Project Bootstrap"
    return
  fi

  gh api "repos/$REPO/milestones" \
    -f title='v0 - Project Bootstrap' \
    -f state=open \
    -f description='Initial setup needed before the workflow can dogfood itself: local Codex account setup plus the already-completed GitHub Project board configuration.' >/dev/null
  ok "created milestone: v0 - Project Bootstrap"
}

tmpdir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmpdir"
}
trap cleanup EXIT

seed_issue_body() {
  local filename="$1"
  local path="$SEED_ISSUE_DIR/$filename"
  [ -f "$path" ] || die "missing seed issue body: $path"
  printf '%s\n' "$path"
}

find_issue_by_title() {
  local title="$1"
  gh issue list --repo "$REPO" --state all --search "\"$title\" in:title" --json id,number,title,state,url |
    jq -r --arg title "$title" '
      .[]
      | select(.title == $title)
      | [.number, .id, .state, .url]
      | @tsv
    ' |
    head -n 1
}

ensure_issue() {
  local title="$1"
  local body_file="$2"
  local labels_csv="$3"
  local milestone="$4"
  local row
  local created=0

  row="$(find_issue_by_title "$title")"
  if [ -z "$row" ]; then
    local args=(issue create --repo "$REPO" --title "$title" --body-file "$body_file")
    IFS=',' read -r -a labels <<<"$labels_csv"
    local label
    for label in "${labels[@]}"; do
      [ -n "$label" ] && args+=(--label "$label")
    done
    [ -n "$milestone" ] && args+=(--milestone "$milestone")

    local url
    url="$(gh "${args[@]}")"
    local number="${url##*/}"
    row="$(gh issue view "$number" --repo "$REPO" --json id,number,state,url |
      jq -r '[.number, .id, .state, .url] | @tsv')"
    created=1
    ok "created issue #$number: $title"
  else
    local existing_number
    existing_number="$(cut -f1 <<<"$row")"
    ok "found issue #$existing_number: $title"

    IFS=',' read -r -a labels <<<"$labels_csv"
    local label
    for label in "${labels[@]}"; do
      [ -n "$label" ] && gh issue edit "$existing_number" --repo "$REPO" --add-label "$label" >/dev/null
    done
    [ -n "$milestone" ] && gh issue edit "$existing_number" --repo "$REPO" --milestone "$milestone" >/dev/null
  fi

  printf '%s\t%s\n' "$row" "$created"
}

project_item_for_issue() {
  local issue_number="$1"
  gh project item-list "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --format json --limit 1000 |
    jq -r --arg repo "$REPO" --argjson number "$issue_number" '
      .items[]
      | select(.content.type == "Issue")
      | select(.content.repository == $repo and .content.number == $number)
      | .id
    ' |
    head -n 1
}

ensure_project_item_for_issue() {
  local issue_number="$1"
  local issue_url="$2"
  local item_id
  item_id="$(project_item_for_issue "$issue_number")"
  if [ -n "$item_id" ]; then
    printf '%s\n' "$item_id"
    return
  fi

  gh project item-add "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --url "$issue_url" --format json |
    jq -r '.id'
}

set_item_field() {
  local item_id="$1"
  local field_name="$2"
  local option_name="$3"
  local field_id
  local option_id

  field_id="$(field_id_by_name "$field_name")"
  option_id="$(option_id_by_name "$field_name" "$option_name")"
  [ -n "$field_id" ] || die "missing field \"$field_name\""
  [ -n "$option_id" ] || die "missing option \"$option_name\" on field \"$field_name\""

  gh project item-edit \
    --project-id "$PROJECT_ID" \
    --id "$item_id" \
    --field-id "$field_id" \
    --single-select-option-id "$option_id" >/dev/null
}

item_status() {
  local item_id="$1"
  gh project item-list "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --format json --limit 1000 |
    jq -r --arg id "$item_id" '.items[] | select(.id == $id) | .status // ""' |
    head -n 1
}

set_item_status_when_initializing() {
  local item_id="$1"
  local created="$2"
  local status="$3"
  local current_status
  current_status="$(item_status "$item_id")"
  if [ "$created" = "1" ] || [ "$RESET_SEED_STATUS" -eq 1 ] || [ -z "$current_status" ]; then
    set_item_field "$item_id" "Status" "$status"
  fi
}

subissue_exists() {
  local parent_id="$1"
  local sub_id="$2"
  gh api graphql \
    -F parent="$parent_id" \
    -f query='query($parent:ID!) { node(id:$parent) { ... on Issue { subIssues(first:100) { nodes { id } } } } }' |
    jq -e --arg sub "$sub_id" '.data.node.subIssues.nodes[]? | select(.id == $sub)' >/dev/null
}

ensure_subissue() {
  local parent_id="$1"
  local sub_id="$2"
  local sub_number="$3"
  if subissue_exists "$parent_id" "$sub_id"; then
    ok "issue #$sub_number already linked as sub-issue"
    return
  fi

  gh api graphql \
    -F parent="$parent_id" \
    -F sub="$sub_id" \
    -f query='mutation($parent:ID!, $sub:ID!) { addSubIssue(input: {issueId: $parent, subIssueId: $sub}) { issue { id number } subIssue { id number } } }' >/dev/null
  ok "linked issue #$sub_number as sub-issue"
}

close_issue_if_open() {
  local number="$1"
  local state="$2"
  if [ "$state" = "CLOSED" ]; then
    return
  fi
  gh issue close "$number" \
    --repo "$REPO" \
    --comment "Closed as a historical bootstrap record. The GitHub Project setup was completed by this setup script or an earlier equivalent manual run." >/dev/null
  ok "closed historical issue #$number"
}

ensure_seed_issues() {
  if [ "$SEED_ISSUES" -ne 1 ]; then
    return 0
  fi

  note "Seeding initial issues and tasks"
  ensure_milestone

  local initiative_row codex_row script_row setup_row
  initiative_row="$(ensure_issue "[Initiative] Build the agent workflow kit by dogfooding it" "$(seed_issue_body initiative.md)" "initiative" "")"
  codex_row="$(ensure_issue "[Task] Set up local Codex with ChatGPT Pro" "$(seed_issue_body codex-auth-task.md)" "task,human-only" "v0 - Project Bootstrap")"
  script_row="$(ensure_issue "[Task] Create GitHub Project setup script" "$(seed_issue_body project-setup-script-task.md)" "task" "")"
  setup_row="$(ensure_issue "[Task] Configure initial GitHub Project board" "$(seed_issue_body manual-project-board-setup-task.md)" "task" "v0 - Project Bootstrap")"

  local initiative_number initiative_id initiative_state initiative_url initiative_created
  local codex_number codex_id codex_state codex_url codex_created
  local script_number script_id script_state script_url script_created
  local setup_number setup_id setup_state setup_url setup_created

  IFS=$'\t' read -r initiative_number initiative_id initiative_state initiative_url initiative_created <<<"$initiative_row"
  IFS=$'\t' read -r codex_number codex_id codex_state codex_url codex_created <<<"$codex_row"
  IFS=$'\t' read -r script_number script_id script_state script_url script_created <<<"$script_row"
  IFS=$'\t' read -r setup_number setup_id setup_state setup_url setup_created <<<"$setup_row"

  local initiative_item codex_item script_item setup_item
  initiative_item="$(ensure_project_item_for_issue "$initiative_number" "$initiative_url")"
  codex_item="$(ensure_project_item_for_issue "$codex_number" "$codex_url")"
  script_item="$(ensure_project_item_for_issue "$script_number" "$script_url")"
  setup_item="$(ensure_project_item_for_issue "$setup_number" "$setup_url")"

  set_item_field "$initiative_item" "Issue Type" "Initiative"
  set_item_field "$initiative_item" "Area" "Workflow"
  set_item_field "$initiative_item" "Merge Risk" "Needs coordination"
  set_item_status_when_initializing "$initiative_item" "$initiative_created" "Grooming"

  set_item_field "$codex_item" "Issue Type" "Task"
  set_item_field "$codex_item" "Area" "Agent Guidance"
  set_item_field "$codex_item" "Merge Risk" "Parallel-safe"
  set_item_status_when_initializing "$codex_item" "$codex_created" "Ready"

  set_item_field "$script_item" "Issue Type" "Task"
  set_item_field "$script_item" "Area" "GitHub Config"
  set_item_field "$script_item" "Merge Risk" "Needs coordination"
  set_item_status_when_initializing "$script_item" "$script_created" "Ready"

  set_item_field "$setup_item" "Issue Type" "Task"
  set_item_field "$setup_item" "Area" "GitHub Config"
  set_item_field "$setup_item" "Merge Risk" "Needs coordination"
  set_item_field "$setup_item" "Status" "Done"
  close_issue_if_open "$setup_number" "$setup_state"

  ensure_subissue "$initiative_id" "$codex_id" "$codex_number"
  ensure_subissue "$initiative_id" "$script_id" "$script_number"
  ensure_subissue "$initiative_id" "$setup_id" "$setup_number"
}

print_summary() {
  refresh_fields
  cat <<EOF

Setup complete.

Project:
- title: $PROJECT_TITLE
- url: $PROJECT_URL
- number: $PROJECT_NUMBER
- id: $PROJECT_ID

Fields:
- Status: $(field_id_by_name "Status")
- Issue Type: $(field_id_by_name "Issue Type")
- Area: $(field_id_by_name "Area")
- Merge Risk: $(field_id_by_name "Merge Risk")
- Spec State: $(field_id_by_name "Spec State")

Key option IDs:
- Status / Ready: $(option_id_by_name "Status" "Ready")
- Status / In Progress: $(option_id_by_name "Status" "In Progress")
- Status / Done: $(option_id_by_name "Status" "Done")
- Issue Type / Initiative: $(option_id_by_name "Issue Type" "Initiative")
- Issue Type / Task: $(option_id_by_name "Issue Type" "Task")
- Area / GitHub Config: $(option_id_by_name "Area" "GitHub Config")
- Merge Risk / Needs coordination: $(option_id_by_name "Merge Risk" "Needs coordination")
EOF
}

ensure_project
ensure_project_link
ensure_project_fields
ensure_labels
ensure_milestone
ensure_seed_issues
print_summary
