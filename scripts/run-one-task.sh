#!/usr/bin/env bash
set -euo pipefail

mkdir -p docs/management docs/results

if [ -f docs/management/STOP_REQUIRED.md ]; then
  echo "STOP_REQUIRED.md exists. Please resolve it first."
  cat docs/management/STOP_REQUIRED.md
  exit 0
fi

echo "=== Manager: select next task ==="
codex exec "$(cat prompts/manager.md)

# 追加指示

このフェーズはTask選定専用です。更新してよいファイルは以下のみに限定してください。
- docs/management/current-task.md
- （必要時のみ）docs/management/STOP_REQUIRED.md

禁止:
- docs/management/task-status.md の更新
- docs/management/feature-status.md の更新
- docs/management/decision-log.md の更新
- docs/management/review.md の更新
"

if [ -f docs/management/STOP_REQUIRED.md ]; then
  echo "Manager requested human confirmation."
  cat docs/management/STOP_REQUIRED.md
  exit 0
fi

echo "=== Worker: implement current task ==="
codex exec "$(cat prompts/worker.md)"

if [ -f docs/management/STOP_REQUIRED.md ]; then
  echo "Worker requested human confirmation."
  cat docs/management/STOP_REQUIRED.md
  exit 0
fi

echo "=== Reviewer: review diff ==="
codex exec "$(cat prompts/reviewer.md)"

if [ -f docs/management/STOP_REQUIRED.md ]; then
  echo "Reviewer requested human confirmation."
  cat docs/management/STOP_REQUIRED.md
  exit 0
fi

echo "=== Manager: update state after review ==="
codex exec "$(cat prompts/manager.md)

# 追加指示

直近の docs/management/review.md と docs/results/ を読み、
Task状態を更新してください。
OKならdone、NEEDS_REWORKならneeds_reworkにしてください。
次Taskの選定はしてもよいですが、実装はしないでください。
"

echo "One task cycle done."
