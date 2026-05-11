# Task 005

## Feature

Feature 003: Market Data Adapter

## 目的

判定に使う株価データを蓄積するため、銘柄リスト・期間・実行ウィンドウを引数指定できるCSV収集バッチを実装する。

## 依存Task

なし

## 対象ファイル

- src/collect_yahoo_prices_csv.py
- docs/results/task-005-market-data-client-worker-result.md

## 実装内容

- 銘柄一覧（テキストファイル）を入力として、Yahoo Finance から日足データを取得する。
- 取得結果をCSVへ保存し、失敗銘柄一覧と実行レポートを別ファイルで出力する。
- 1銘柄ずつ低頻度で取得し、指定ウィンドウ時間から待機間隔を計算してレート制限リスクを下げる。

## 受け入れ条件

- `python3 src/collect_yahoo_prices_csv.py --help` が成功する。
- 収集バッチが「価格CSV」「失敗銘柄一覧」「実行レポート」を出力できる。
- 通常テスト例として `10銘柄・7日・10分` の引数指定で動作できる。
- 依存パッケージを追加しない。
- 対象外ファイルへの変更なし（結果記録ファイルを除く）。

## 実行するテスト

- python3 src/collect_yahoo_prices_csv.py --help

## 禁止事項

- 依存パッケージ追加
- UI実装
