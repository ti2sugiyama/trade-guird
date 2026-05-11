# Task 004

## Feature

Feature 002: Diagnosis Logic

## 目的

TypeScript設定および関連する最小範囲の型整合性を修正し、`npm run build` を通る状態へ復旧する。

## 依存Task

なし

## 対象ファイル

- tsconfig.json
- src/App.tsx
- src/main.tsx
- docs/results/task-004-tsconfig-build-compat-worker-result.md

## 実装内容

- `moduleResolution` 変更後に残るビルド失敗要因を特定し、最小差分で解消する。
- 現行プロジェクト構成（Vite + TS）に整合する形で修正する。
- 変更理由を結果ファイルに記録する。

## 受け入れ条件

- `npm run build` が成功する。
- 依存パッケージ追加なし。
- 対象外ファイルへの変更なし（結果記録ファイルを除く）。

## 実行するテスト

- npm run build

## 禁止事項

- UI実装禁止
- 依存パッケージ追加禁止
- 仕様追加禁止
