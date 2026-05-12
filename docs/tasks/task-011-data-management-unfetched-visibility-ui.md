# Task 011

## Feature

Feature 007: JP Master Import And Unfetched Visibility

## 目的

データ管理一覧で価格CSV未取得銘柄を利用者が判別できる表示を追加する。

## 依存Task

task-010-data-management-unfetched-status-merge

## 対象ファイル

- src/App.tsx
- src/App.css
- docs/results/task-011-data-management-unfetched-visibility-ui-worker-result.md

## 実装内容

- 一覧行に未取得状態を示す最小UI（文言またはラベル）を追加する。
- 取得済み銘柄との視認性差が出るよう、既存デザイン範囲でスタイルを調整する。
- 既存の行操作（取得アクション等）と競合しない表示順・表示位置にする。

## 受け入れ条件

- 未取得銘柄が一覧で識別できる。
- 取得済み銘柄の既存表示が回帰しない。
- `npm run build` が成功する。

## 実行するテスト

- npm run build

## 禁止事項

- 依存パッケージ追加
- UI文言の大幅変更
- 仕様外のフィルタ・ソート機能追加
