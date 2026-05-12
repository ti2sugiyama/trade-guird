# Task Status

| Task | Feature | State | Retry | Dependency | Blocker | Notes |
|---|---|---:|---:|---|---|---|
| task-001-app-shell | feature-001-walking-skeleton | done | 2 | - | - | `docs/results/task-001-app-shell-worker-result.md` で build成功を確認 |
| task-004-tsconfig-build-compat | feature-002-diagnosis-logic | done | 4 | - | - | `review.md`(2026-05-11) 判定OK。build成功・許可範囲差分・結果記録整合を確認 |
| task-002-domain-types | feature-002-diagnosis-logic | done | 1 | task-004-tsconfig-build-compat | - | `task-004` 完了後に再評価し、型定義実装内容を結果記録で確認 |
| task-003-diagnosis-rules | feature-002-diagnosis-logic | done | 2 | task-002-domain-types | - | `review.md`(2026-05-11) 判定OK。Task 003 完了判定対象差分の目的外ファイル混在解消、結果記録整合、`npm run build` 成功を確認 |
| task-005-market-data-client | feature-003-market-data-adapter | done | 3 | - | - | `review.md`(2026-05-11) 判定 `OK`。Task 005 の目的・許可範囲差分（`src/collect_yahoo_prices_csv.py` と結果記録）・テスト・3種出力確認の整合を確認。 |
| task-006-real-market-diagnosis-adapter | feature-004-real-market-diagnosis | done | 5 | task-005-market-data-client | - | `review.md`(2026-05-12) 判定 `OK` を反映。`docs/results/task-006-real-market-diagnosis-adapter-worker-result.md` と整合し、build成功・許可範囲差分収束を確認。 |
| task-007-data-management-page-mvp | feature-005-data-management-page | done | 3 | task-006-real-market-diagnosis-adapter | - | `review.md`(2026-05-12) 最新判定 `OK` を反映。Task 007 完了判定対象差分の収束（`src/**` と `docs/results/task-007-data-management-page-mvp-worker-result.md`）と `npm run build` 成功を確認。 |
| task-008-data-management-row-fetch-action | feature-006-data-refresh-ui | done | 6 | task-007-data-management-page-mvp | - | `review.md`(2026-05-12) 最新判定 `OK` と `docs/results/task-008-data-management-row-fetch-action-worker-result.md` を照合し、受け入れ条件達成・build成功・差分整合を確認。 |
| task-009-jp-master-official-import | feature-007-jp-master-import-and-unfetched-visibility | needs_rework | 1 | - | - | `review.md`(2026-05-12, 判定 `NEEDS_REWORK`) と `docs/results/task-009-jp-master-official-import-worker-result.md`(2026-05-12 15:04更新)を再照合。未解決は「Task完了判定差分を対象3ファイルへ収束」のみ。 |
| task-010-data-management-unfetched-status-merge | feature-007-jp-master-import-and-unfetched-visibility | todo | 0 | task-009-jp-master-official-import | - | 銘柄マスタ基準で一覧データを生成し、価格CSV未取得状態を判定するTask。 |
| task-011-data-management-unfetched-visibility-ui | feature-007-jp-master-import-and-unfetched-visibility | todo | 0 | task-010-data-management-unfetched-status-merge | - | 一覧UIで未取得銘柄を識別可能にする表示Task。 |
| task-none-waiting | operational-management | done | 8 | - | - | `docs/results/task-none-waiting-worker-result.md` を確認し、待機運用Taskとしての記録整合更新を確認。 |
