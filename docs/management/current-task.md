# Current Task

## Task ID

task-manager-stop-resolution-2026-05-11

## Feature

feature-002-diagnosis-logic

## 目的

`STOP_REQUIRED` を解消するため、`task-004-tsconfig-build-compat` の差分許容範囲と運用ルールを人間判断で確定する。

## 対象スコープ

- docs/management/STOP_REQUIRED.md
- docs/management/current-task.md

## 実装内容

- コード実装・Task再実行は行わない。
- 以下の3点について人間判断を取得する。
  1. `task-004` の最終差分として許可するファイル範囲
  2. `tsconfig.tsbuildinfo` の扱い
  3. 結果ファイル記載を最終 `git diff` と一致させる運用ルール
- 判断確定後、Managerが次に実行するTaskを1件再選定する。

## 受け入れ条件

- 上記3論点の判断結果が明文化されていること。
- `STOP_REQUIRED.md` 解消前に Worker が実装Taskを実行しないこと。

## 実行するテスト

- なし（停止フェーズ）

## 禁止事項

- コード実装
- `task-004-tsconfig-build-compat` の再試行
- `STOP_REQUIRED.md` 未解消でのTask進行

## 完了後の記録先

- docs/management/current-task.md
- docs/management/STOP_REQUIRED.md
