# Task Status

| Task | Feature | State | Retry | Dependency | Notes |
|---|---|---:|---:|---|---|
| task-004-tsconfig-build-compat | feature-002-diagnosis-logic | needs_rework | 3 | - | `review.md` が NEEDS_REWORK。build成功は確認済みだが、対象外差分混在と結果記録不一致の解消が未完 (2026-05-11) |
| task-001-app-shell | feature-001-walking-skeleton | done | 2 | - | `docs/results/task-001-app-shell-worker-result.md` で build成功を確認 |
| task-002-domain-types | feature-002-diagnosis-logic | blocked | 1 | task-004-tsconfig-build-compat | task-004完了後にdone判定へ再評価 |
| task-003-diagnosis-rules | feature-002-diagnosis-logic | todo | 0 | task-002-domain-types | task-002完了後に着手 |
