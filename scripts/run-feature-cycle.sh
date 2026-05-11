#!/usr/bin/env bash
set -euo pipefail

MAX_TASKS="${MAX_TASKS:-10}"

mkdir -p docs/management docs/results

is_current_feature_done() {
  local current_feature
  current_feature="$(awk '
    $0 ~ /^## Feature$/ { getline; getline; print; exit }
  ' docs/management/current-task.md | tr -d "\r")"

  if [ -z "${current_feature}" ] || [ "${current_feature}" = "-" ]; then
    return 1
  fi

  awk -F'|' -v feature="${current_feature}" '
    function trim(s) {
      gsub(/^[ \t`]+|[ \t`]+$/, "", s)
      return s
    }
    BEGIN {
      has_target = 0
      all_done = 1
    }
    /^\|/ {
      task = trim($2)
      row_feature = trim($3)
      state = trim($4)
      if (task == "Task" || task == "---" || row_feature == "") {
        next
      }
      if (row_feature == feature) {
        has_target = 1
        if (state != "done") {
          all_done = 0
        }
      }
    }
    END {
      if (has_target == 1 && all_done == 1) {
        exit 0
      }
      exit 1
    }
  ' docs/management/task-status.md
}

for i in $(seq 1 "$MAX_TASKS"); do
  echo "=================================="
  echo " Task cycle $i / $MAX_TASKS"
  echo "=================================="

  if [ -f docs/management/STOP_REQUIRED.md ]; then
    echo "STOP_REQUIRED.md exists. Stop."
    cat docs/management/STOP_REQUIRED.md
    exit 0
  fi

  if is_current_feature_done; then
    echo "Current feature is already done. Stop."
    exit 0
  fi

  ./scripts/run-one-task.sh

  if [ -f docs/management/STOP_REQUIRED.md ]; then
    echo "STOP_REQUIRED.md created. Stop."
    cat docs/management/STOP_REQUIRED.md
    exit 0
  fi

  if is_current_feature_done; then
    echo "Current feature is done. Stop."
    exit 0
  fi

  echo "Task cycle $i finished."
done

echo "Reached MAX_TASKS=$MAX_TASKS."
echo "If the Feature seems complete, run:"
echo "./scripts/run-feature-finish.sh"
