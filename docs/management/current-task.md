# Current Task

## Task ID

task-005-market-data-client

## Feature

feature-003-market-data-adapter

## 目的

`NEEDS_REWORK` 指摘を解消し、Task完了判定対象差分を許可範囲へ収束させたうえで結果記録との整合を取る。

## 対象スコープ

- src/collect_yahoo_prices_csv.py
- docs/results/task-005-market-data-client-worker-result.md

## 実装内容

- `docs/management/**` を除く差分から、`task-005` 完了判定に不要な差分（`scripts/**`、`prompts/**`、`docs/specs/**`、`AGENTS.md`、`docs/results/task-none-waiting-worker-result.md` など）を除外し、Task差分を `src/**` と `docs/results/**` のみに収束させる。
- 実差分を基準に `docs/results/task-005-market-data-client-worker-result.md` の「変更ファイル」「結果」を更新し、記録と実態を一致させる。
- CLIエントリ要件として `python3 src/collect_yahoo_prices_csv.py --help` 成功状態を維持する。

## 受け入れ条件

- `docs/management/**` を除くTask完了判定対象差分が `src/**` と `docs/results/**` のみに収まる。
- `docs/management/**` を除く差分に `task-005` 目的外ファイル（`scripts/**`、`prompts/**`、`docs/specs/**`、`AGENTS.md`、`docs/results/task-none-waiting-worker-result.md`）が残っていない。
- `docs/results/task-005-market-data-client-worker-result.md` の記録内容（変更ファイル・結果）が実差分と一致する。
- `python3 src/collect_yahoo_prices_csv.py --help` が成功する。
- 依存パッケージを追加しない。

## 実行するテスト

- python3 src/collect_yahoo_prices_csv.py --help

## 禁止事項

- 実装差分として `src/**` と `docs/results/**`（および管理運用の `docs/management/**`）以外を変更しない。
- 依存パッケージ追加をしない。
- UI実装・仕様追加・DB/API/Auth/Paymentの設計変更をしない。

## 完了後の記録先

- docs/results/task-005-market-data-client-worker-result.md

## 判断メモ（1-3行）

- 2026-05-11: `review.md` 判定 `NEEDS_REWORK` と `docs/results/`・実差分確認の結果、`task-005` は未完了のため最優先で再実行する。
- 2026-05-11: PM承認により、`task-005` の実装先は `scripts/**` ではなく `src/**`（`src/collect_yahoo_prices_csv.py`）で確定。
- 2026-05-11: STOP条件（仕様矛盾、API/DB/Auth/Payment影響、依存追加必須、原因不明テスト失敗等）には該当せず、`STOP_REQUIRED.md` は作成しない。
- 参照specs: なし / 矛盾: なし
