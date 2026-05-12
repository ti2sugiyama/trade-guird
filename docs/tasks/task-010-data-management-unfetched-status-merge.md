# Task 010

## Feature

Feature 007: JP Master Import And Unfetched Visibility

## 目的

銘柄マスタと価格CSV管理情報を突合し、価格未取得銘柄を一覧データとして判定できるようにする。

## 依存Task

task-009-jp-master-official-import

## 対象ファイル

- src/App.tsx
- src/types.ts
- docs/results/task-010-data-management-unfetched-status-merge-worker-result.md

## 実装内容

- データ管理一覧の行データ生成を、価格CSV基準から銘柄マスタ基準へ切り替える。
- 各銘柄について「価格CSVあり / なし」を判定する状態を追加する。
- 既存項目（銘柄コード、名称、更新系情報）が維持されるように整合をとる。

## 受け入れ条件

- 価格CSVが存在しない銘柄も一覧データに含まれる。
- 価格CSV未取得状態をコード上で一意に判定できる。
- 既存のデータ管理一覧機能（行レンダリング前提データ）が壊れない。

## 実行するテスト

- npm run build

## 禁止事項

- 依存パッケージ追加
- 銘柄判定ロジックと無関係なUI全面改修
