#!/usr/bin/env bash
set -euo pipefail

REQUEST="${*:-}"

if [ -z "$REQUEST" ]; then
  echo "Usage: ./scripts/run-planning.sh \"作りたいFeature\""
  exit 1
fi

mkdir -p docs/tasks docs/features docs/management docs/results

echo "=== Planner ==="
codex exec "$(cat prompts/planner.md)

# 人間からのFeature要求

$REQUEST
"

echo "=== Architect ==="
codex exec "$(cat prompts/architect.md)

# 確認対象Feature要求

$REQUEST
"

echo "Planning done."
