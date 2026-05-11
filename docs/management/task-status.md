# Task Status

| Task | Feature | State | Retry | Dependency | Notes |
|---|---|---:|---:|---|---|
| task-001-app-shell | feature-001-walking-skeleton | done | 2 | - | `docs/results/task-001-app-shell-worker-result.md` で build成功を確認 |
| task-004-tsconfig-build-compat | feature-002-diagnosis-logic | done | 4 | - | `review.md`(2026-05-11) 判定OK。build成功・許可範囲差分・結果記録整合を確認 |
| task-002-domain-types | feature-002-diagnosis-logic | done | 1 | task-004-tsconfig-build-compat | `task-004` 完了後に再評価し、型定義実装内容を結果記録で確認 |
| task-003-diagnosis-rules | feature-002-diagnosis-logic | done | 2 | task-002-domain-types | `review.md`(2026-05-11) 判定OK。Task 003 完了判定対象差分の目的外ファイル混在解消、結果記録整合、`npm run build` 成功を確認 |
| task-none-waiting | operational-management | done | 2 | - | `review.md`(2026-05-11) 最新判定OK。待機Taskの完了判定対象差分は `docs/results/task-none-waiting-worker-result.md` のみに整合 |
