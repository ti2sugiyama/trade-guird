# Current Task

## Task ID

task-005-market-data-client

## Feature

feature-003-market-data-adapter

## 目的

Task 005 の実行可否を確定するため、実装差分許可範囲の矛盾を人間確認で解消し、実装対象を確定する。

## 対象スコープ

- docs/management/current-task.md
- docs/tasks/task-005-market-data-client.md

## 実装内容

- `docs/tasks/task-005-market-data-client.md` の対象を `scripts/**` から `src/**` に修正する。
- 実装対象パスを `src/collect_yahoo_prices_csv.py` に統一する。
- 修正後、Worker は共通許可範囲内で Task 005 実装を再開する。

## 受け入れ条件

- 仕様矛盾に対する人間の明示判断が記録されていること。
- Task 005 の実装対象パスが `src/**` に確定していること。
- `docs/tasks/task-005-market-data-client.md` の対象ファイルとテストコマンドが `src/**` に整合していること。

## 実行するテスト

- なし（管理判断のみ）

## 禁止事項

- コード実装の開始
- 依存パッケージ追加
- 仕様の独断変更

## 完了後の記録先

- docs/management/current-task.md

## 判断メモ（1-3行）

- 2026-05-11: task-005 は Task定義の対象ファイルと共通許可範囲が衝突しているため、実装開始前に停止判定へ切り替える。
- 2026-05-11: PM承認により、task-005 の実装対象は `scripts/**` ではなく `src/**` に統一して進行する。
- 参照specs: なし / 矛盾: 解消（対象を `src/**` に修正）
