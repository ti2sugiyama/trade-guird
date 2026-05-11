# Task Status

| Task | Feature | State | Retry | Dependency | Blocker | Notes |
|---|---|---:|---:|---|---|---|
| task-001-app-shell | feature-001-walking-skeleton | done | 2 | - | - | `docs/results/task-001-app-shell-worker-result.md` で build成功を確認 |
| task-004-tsconfig-build-compat | feature-002-diagnosis-logic | done | 4 | - | - | `review.md`(2026-05-11) 判定OK。build成功・許可範囲差分・結果記録整合を確認 |
| task-002-domain-types | feature-002-diagnosis-logic | done | 1 | task-004-tsconfig-build-compat | - | `task-004` 完了後に再評価し、型定義実装内容を結果記録で確認 |
| task-003-diagnosis-rules | feature-002-diagnosis-logic | done | 2 | task-002-domain-types | - | `review.md`(2026-05-11) 判定OK。Task 003 完了判定対象差分の目的外ファイル混在解消、結果記録整合、`npm run build` 成功を確認 |
| task-none-waiting | operational-management | done | 3 | - | - | `review.md`(2026-05-11) 判定 `OK`。待機Task差分を `docs/results/task-none-waiting-worker-result.md` のみに収束し、受け入れ条件を満たした |
| task-005-market-data-client | feature-003-market-data-adapter | in_progress | 0 | - | - | 2026-05-11 PM承認で実装対象を `src/**` に統一。`docs/tasks/task-005-market-data-client.md` を `scripts/**` から修正済み |
