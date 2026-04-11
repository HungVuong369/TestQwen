# AI Task Execution Template

## 📋 Repository Context
- **Remote Origin:** `{REMOTE_URL}`
- **Repository Name:** `{REPO_NAME}`
- **Current Branch:** `{CURRENT_BRANCH}`
- **Target Branch (if applicable):** `{TARGET_BRANCH}`

---

## 🎯 Task Overview
- **Task Type:** `{TASK_TYPE}` *(create_file | delete_branch | feature_development | bug_fix | refactor | test | documentation | other)*
- **Priority:** `{PRIORITY}` *(low | medium | high | critical)*
- **Description:** 
```
{DETAILED_TASK_DESCRIPTION}
```

---

## ✅ Acceptance Criteria
- [ ] Criterion 1: {SPECIFIC_OUTCOME_1}
- [ ] Criterion 2: {SPECIFIC_OUTCOME_2}
- [ ] Criterion 3: {SPECIFIC_OUTCOME_3}

---

## 🛠️ Execution Steps

### Phase 1: Pre-Execution Verification
- [ ] Verify remote origin is accessible
- [ ] Confirm current branch state
- [ ] Check for conflicting changes
- [ ] Backup important data if needed

### Phase 2: Implementation
```bash
# Step-by-step commands will be generated based on task type
{IMPLEMENTATION_COMMANDS}
```

### Phase 3: Post-Execution Validation
- [ ] Verify changes match acceptance criteria
- [ ] Run tests (if applicable)
- [ ] Confirm no breaking changes
- [ ] Document any side effects

---

## ⚠️ Safety Constraints
- **NEVER** modify default branches (`main`, `master`, `develop`) without explicit confirmation
- **ALWAYS** verify remote operations before execution
- **MUST** provide rollback plan for destructive operations
- **REQUIRED** confirmation prompt for:
  - Branch deletion
  - File deletion
  - Force push operations
  - Database/schema changes

---

## 📤 Expected Output Format

### Command Execution Log
```bash
{COMMAND_LOG}
```

### Result Summary
- **Status:** `{SUCCESS | FAILED | PARTIAL}`
- **Changes Made:** 
  - {CHANGE_1}
  - {CHANGE_2}
- **Files Affected:** `{FILE_LIST}`
- **Branches Modified:** `{BRANCH_LIST}`

### Evidence/Proof
```
{VERIFICATION_OUTPUT}
```

---

## 🔄 Rollback Plan (if applicable)
```bash
{ROLLBACK_COMMANDS}
```

---

## 📝 Additional Notes
{ANY_OTHER_RELEVANT_INFORMATION}

---

## ✨ Usage Instructions

1. Replace all `{PLACEHOLDER}` values with actual task-specific information
2. Fill in task type from the supported list
3. Define clear, measurable acceptance criteria
4. Review safety constraints before execution
5. Execute commands step-by-step with verification after each phase
6. Document all outputs in the expected format section

**Supported Task Types:**
- `create_file` - Create new files/directories
- `delete_branch` - Remove remote/local branches
- `feature_development` - Implement new features
- `bug_fix` - Fix identified issues
- `refactor` - Code restructuring
- `test` - Add/modify tests
- `documentation` - Update docs
- `other` - Custom tasks
