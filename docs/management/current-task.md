# Current Task

## Task ID

task-004-tsconfig-build-compat

## Feature

feature-002-diagnosis-logic

## 目的

`npm run build` を安定して成功させるために必要な最小修正を行い、結果記録を実差分と一致させる。

## 対象スコープ

- TypeScript / ビルド設定
- ビルド失敗に直接関与する実装ファイル
- 当該Taskの結果記録ファイル

## 実装内容

- `npm run build` 失敗原因を解消する最小変更を実装する。
- 変更はTask目的に直接必要なものに限定する。
- 実際に変更したファイルを結果記録へ列挙し、各ファイルの変更理由を1行で記録する。

## 受け入れ条件

- `npm run build` が成功する。
- 依存パッケージ追加なし。
- 目的外変更がない。
- 結果記録（変更ファイル・理由・テスト結果）が実差分と一致する。

## 実行するテスト

- npm run build

## 禁止事項

- 仕様追加禁止
- UI文言の大幅変更禁止
- dependency追加禁止
- 目的外のリファクタ禁止

## 完了後の記録先

- docs/results/task-004-tsconfig-build-compat-worker-result.md
- docs/management/task-status.md
- docs/management/feature-status.md
- docs/management/decision-log.md
