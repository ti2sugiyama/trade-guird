#!/usr/bin/env bash
set -euo pipefail

mkdir -p docs/management docs/results

if [ -f docs/management/STOP_REQUIRED.md ]; then
  echo "STOP_REQUIRED.md exists. Please resolve it first."
  cat docs/management/STOP_REQUIRED.md
  exit 0
fi

echo "=== Tester: feature integration check ==="
codex exec "$(cat prompts/tester.md)"

if [ -f docs/management/STOP_REQUIRED.md ]; then
  echo "Tester requested human confirmation."
  cat docs/management/STOP_REQUIRED.md
  exit 0
fi

echo "=== Documenter: sync docs ==="
codex exec "$(cat prompts/documenter.md)"

if [ -f docs/management/STOP_REQUIRED.md ]; then
  echo "Documenter requested human confirmation."
  cat docs/management/STOP_REQUIRED.md
  exit 0
fi

echo "=== Manager: feature completion judgment ==="
codex exec "$(cat prompts/manager.md)

# 追加指示

Tester結果とDocumenter更新を確認し、Feature完了判定をしてください。
Featureが完了していれば feature-status.md を更新してください。
次Featureに進める場合はその旨をdecision-log.mdに記録してください。
"

echo "Feature finish cycle done."
