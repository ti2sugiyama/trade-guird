# Task Status

| Task | Feature | State | Retry | Dependency | Notes |
|---|---|---:|---:|---|---|
| task-004-tsconfig-build-compat | feature-002-diagnosis-logic | needs_rework | 4 | - | `review.md` 指摘の「対象外差分混在」と「結果記録不一致」を解消する再実行を指示 (2026-05-11) |
| task-001-app-shell | feature-001-walking-skeleton | done | 2 | - | `docs/results/task-001-app-shell-worker-result.md` で build成功を確認 |
| task-002-domain-types | feature-002-diagnosis-logic | blocked | 1 | task-004-tsconfig-build-compat | task-004完了後にdone判定へ再評価 |
| task-003-diagnosis-rules | feature-002-diagnosis-logic | todo | 0 | task-002-domain-types | task-002完了後に着手 |
