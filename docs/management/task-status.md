# Task Status

| Task | Feature | State | Retry | Dependency | Notes |
|---|---|---:|---:|---|---|
| task-004-tsconfig-build-compat | feature-002-diagnosis-logic | needs_rework | 2 | - | Human Decisionで分割せず継続再実行を承認。対象ファイル境界厳守と結果記録一致で再提出 (2026-05-11) |
| task-001-app-shell | feature-001-walking-skeleton | done | 2 | - | `docs/results/task-001-app-shell-worker-result.md` で build成功を確認 |
| task-002-domain-types | feature-002-diagnosis-logic | blocked | 1 | task-004-tsconfig-build-compat | task-004完了後にdone判定へ再評価 |
| task-003-diagnosis-rules | feature-002-diagnosis-logic | todo | 0 | task-002-domain-types | task-002完了後に着手 |
