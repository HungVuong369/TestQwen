---
# AI Task Execution Template
# Version: 2.0 | Agent-Ready Format

---
# Metadata (YAML Frontmatter for Automation)
---
template_version: "2.0"
agent_ready: true
automation_support:
  parsing_format: "yaml_frontmatter + markdown"
  execution_mode: "step_by_step_with_validation"
  remote_first: true

repository:
  remote_origin: "{REMOTE_URL}"
  repo_name: "{REPO_NAME}"
  current_branch: "{CURRENT_BRANCH}"
  target_branch: "{TARGET_BRANCH}"
  default_branches: ["main", "master", "develop"]

task:
  id: "{TASK_ID}"
  type: "{TASK_TYPE}"
  priority: "{PRIORITY}"
  title: "{TASK_TITLE}"
  description: |
    {DETAILED_TASK_DESCRIPTION}
  dependencies: []
  blocking_tasks: []
  estimated_duration: "{ESTIMATED_DURATION}"

acceptance_criteria:
  - id: "AC1"
    description: "{SPECIFIC_OUTCOME_1}"
    measurable: true
    verified: false
  - id: "AC2"
    description: "{SPECIFIC_OUTCOME_2}"
    measurable: true
    verified: false
  - id: "AC3"
    description: "{SPECIFIC_OUTCOME_3}"
    measurable: true
    verified: false

environment:
  variables: {}
  required_tools: []
  timeout_seconds: 300
  retry_count: 3

execution:
  phase_1_pre_check:
    - action: "verify_remote_origin"
      required: true
      command: "git remote -v"
      expected_output_contains: "origin"
    - action: "fetch_latest"
      required: true
      command: "git fetch origin"
    - action: "check_branch_state"
      required: true
      command: "git branch -a"
    - action: "check_uncommitted_changes"
      required: true
      command: "git status --porcelain"
      fail_if_not_empty: false

  phase_2_implementation:
    auto_generate: true
    commands: |
      {IMPLEMENTATION_COMMANDS}
    stop_on_error: true
    require_confirmation_for:
      - "branch_deletion"
      - "file_deletion"
      - "force_push"
      - "database_changes"
      - "production_deploy"

  phase_3_validation:
    - action: "verify_acceptance_criteria"
      required: true
    - action: "run_tests"
      required: false
      command: "{TEST_COMMAND}"
    - action: "verify_no_breaking_changes"
      required: true
    - action: "push_to_remote"
      required: true
      command: "git push origin {CURRENT_BRANCH}"

safety_constraints:
  protected_branches:
    - "main"
    - "master"
    - "develop"
  require_confirmation:
    destructive_operations: true
    remote_operations: true
    production_changes: true
  rollback_required_for:
    - "branch_deletion"
    - "schema_changes"
    - "data_migration"

error_handling:
  strategy: "fail_fast_with_rollback"
  on_error:
    - action: "log_error"
    - action: "execute_rollback"
      if_available: true
    - action: "notify_user"
  retry_policy:
    max_retries: 3
    delay_seconds: 5
    exponential_backoff: true

rollback_plan:
  available: true
  commands: |
    {ROLLBACK_COMMANDS}
  auto_execute_on_failure: false

output_format:
  status: "{SUCCESS | FAILED | PARTIAL}"
  execution_log: |
    {COMMAND_LOG}
  changes_made:
    - "{CHANGE_1}"
    - "{CHANGE_2}"
  files_affected: "{FILE_LIST}"
  branches_modified: "{BRANCH_LIST}"
  verification_output: |
    {VERIFICATION_OUTPUT}
  timing:
    started_at: "{START_TIME}"
    completed_at: "{END_TIME}"
    duration_seconds: "{DURATION}"

additional_notes: |
  {ANY_OTHER_RELEVANT_INFORMATION}

---
