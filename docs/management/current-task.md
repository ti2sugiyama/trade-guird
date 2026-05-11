# Current Task

## Task ID

task-004-tsconfig-build-compat

## Feature

feature-002-diagnosis-logic

## 目的

`task-004-tsconfig-build-compat` の再修正を行い、対象ファイル内の最小差分で `npm run build` 成功・結果記録一致を満たす。

## 対象ファイル

- tsconfig.json
- src/App.tsx
- src/main.tsx
- docs/results/task-004-tsconfig-build-compat-worker-result.md

## 実装内容

- `npm run build` を成功させるための最小差分のみを適用する。
- 変更ファイルは対象ファイルに限定し、Task外差分を混在させない。
- 結果ファイルの「変更ファイル」「実行コマンド」「結果」を実差分と一致させる。

## 受け入れ条件

- `npm run build` が成功する。
- 依存パッケージ追加なし。
- 変更ファイルが対象ファイル内に限定されている。
- `docs/results/task-004-tsconfig-build-compat-worker-result.md` の記載が実差分と一致している。

## 実行するテスト

- npm run build

## 禁止事項

- 仕様追加禁止
- UI文言の大幅変更禁止
- dependency追加禁止
- 目的外のリファクタ禁止
- 対象外ファイル変更禁止

## 完了後の記録先

- docs/results/task-004-tsconfig-build-compat-worker-result.md
- docs/management/task-status.md
- docs/management/feature-status.md
- docs/management/decision-log.md
