# Current Task

## Task ID

task-none-waiting

## Feature

operational-management

## 目的

実行可能なTaskが補充されるまで待機し、Queue更新時に次Taskを即時開始できる管理状態を維持する。

## 対象スコープ

- docs/management/current-task.md

## 実装内容

- 新規Taskの追加または既存Task状態変更があるまで待機する。
- `docs/management/task-status.md` / `docs/management/feature-status.md` / `docs/management/blockers.md` の整合を監視する。
- 実装作業（`src/**` 変更）は行わない。

## 受け入れ条件

- `STOP_REQUIRED.md` が存在しない状態で待機継続できる。
- `ready` または `needs_rework` のTaskが発生したら、このファイルを次Task内容へ更新できる。

## 実行するテスト

- なし（管理更新のみ）

## 禁止事項

- コード実装をしない。
- 仕様を追加しない。
- DB/API/Auth/Paymentの大きな変更を決めない。

## 完了後の記録先

- docs/results/task-none-waiting-worker-result.md
