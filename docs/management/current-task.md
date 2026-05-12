# Current Task

## Task ID

task-009-jp-master-official-import

## Feature

feature-007-jp-master-import-and-unfetched-visibility

## 目的

`review.md`（2026-05-12 判定: `NEEDS_REWORK`）の指摘を解消し、task-009 を再提出可能な状態にする。
完了判定差分を task-009 対象3ファイルのみに収束させる。

## 対象スコープ

- `src/collect_yahoo_prices_csv.py`
- `src/data/embeddedMarketCsv.ts`
- `docs/results/task-009-jp-master-official-import-worker-result.md`

## 実装内容

- task-009 の完了判定差分から対象外ファイルを除外し、対象3ファイルのみを残す。
- `docs/results/task-009-jp-master-official-import-worker-result.md` の「変更ファイル」「実行コマンド」「確認結果」を再提出時点の実差分・実行結果に一致させる。
- `*.tsbuildinfo` を task-009 の差分に含めない。

## 受け入れ条件

- `git diff --name-only`（task-009 完了判定対象）で対象3ファイルのみが出力される。
- `python3 src/collect_yahoo_prices_csv.py --help` が成功する。
- 最小入力CSVによる公式マスタ取り込みコマンドが成功する。
- `npm run build` が成功する。
- 結果記録の記載内容が実差分・実行結果と一致している。

## 実行するテスト

- `python3 src/collect_yahoo_prices_csv.py --help`
- `python3 src/collect_yahoo_prices_csv.py --official-master-csv <最小入力CSV> --append-suffix .T --master-out-ts <出力先> --out-dir <出力先>`
- `npm run build`

## 禁止事項

- 実装差分の許可範囲（`src/**`、`docs/results/**`、`tsconfig.json`）を超える変更をしない。
- task-009 で UI 実装をしない。
- 依存パッケージを追加しない。
- 仕様外の列追加や独自ルール強制をしない。
- `docs/management/**` を Task 完了差分として扱わない。

## 完了後の記録先

- `docs/results/task-009-jp-master-official-import-worker-result.md`
