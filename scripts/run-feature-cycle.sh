#!/usr/bin/env bash
set -euo pipefail

MAX_TASKS="${MAX_TASKS:-10}"

mkdir -p docs/management docs/results

for i in $(seq 1 "$MAX_TASKS"); do
  echo "=================================="
  echo " Task cycle $i / $MAX_TASKS"
  echo "=================================="

  if [ -f docs/management/STOP_REQUIRED.md ]; then
    echo "STOP_REQUIRED.md exists. Stop."
    cat docs/management/STOP_REQUIRED.md
    exit 0
  fi

  ./scripts/run-one-task.sh

  if [ -f docs/management/STOP_REQUIRED.md ]; then
    echo "STOP_REQUIRED.md created. Stop."
    cat docs/management/STOP_REQUIRED.md
    exit 0
  fi

  echo "Task cycle $i finished."
done

echo "Reached MAX_TASKS=$MAX_TASKS."
echo "If the Feature seems complete, run:"
echo "./scripts/run-feature-finish.sh"
