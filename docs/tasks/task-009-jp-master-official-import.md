# Task 009

## Feature

Feature 007: JP Master Import And Unfetched Visibility

## 目的

公式データから日本株の銘柄マスタを取り込み、後続Taskが参照できる共通データ入力を用意する。

## 依存Task

なし

## 対象ファイル

- src/collect_yahoo_prices_csv.py
- src/data/embeddedMarketCsv.ts
- docs/results/task-009-jp-master-official-import-worker-result.md

## 実装内容

- 公式データの入力形式を定義し、銘柄コード・銘柄名を欠損なく扱える取り込み処理を追加する。
- 既存の銘柄入力（手動リスト）を壊さない形で、公式マスタを利用できる実行導線を追加する。
- 取り込み結果の件数と失敗情報を確認できる最小レポートを出力できるようにする。

## 受け入れ条件

- 公式データを入力にして銘柄マスタを生成できる。
- 銘柄コード・銘柄名が一覧化され、後続処理で再利用できる形式になっている。
- 既存フローでの価格CSV収集が回帰しない。

## 実行するテスト

- python3 src/collect_yahoo_prices_csv.py --help
- 公式データ入力を使った最小件数の実行確認

## 禁止事項

- 依存パッケージ追加
- 仕様外の列追加や独自ルール強制
- UI実装
