# Current Task

## Task ID

task-004-tsconfig-build-compat

## Feature

feature-002-diagnosis-logic

## 目的

`task-004` の受け入れ条件を満たして完了判定可能にする。特に「対象スコープ外変更なし」と「結果記録と実差分一致」を成立させる。

## 対象スコープ

- `tsconfig.json`
- `src/App.tsx`
- `src/main.tsx`
- `docs/results/task-004-tsconfig-build-compat-worker-result.md`

## 実装内容

- 対象スコープ内でのみ必要最小限の修正を行う（不要ならコード変更なし可）。
- `npm run build` を実行し、成功結果を確認する。
- 結果ファイルに「実際にこのTaskで変更したファイル」「各変更理由（1行）」「実行コマンド」「結果」を記録し、実差分と一致させる。

## 受け入れ条件

- `npm run build` が成功する。
- 依存パッケージ追加なし。
- このTaskで新規に発生させた差分が対象スコープ内に限定される。
- `docs/results/task-004-tsconfig-build-compat-worker-result.md` の記載が実差分と一致する。

## 実行するテスト

- `npm run build`

## 禁止事項

- 仕様追加禁止
- UI文言の大幅変更禁止
- dependency追加禁止
- 目的外のリファクタ禁止

## 完了後の記録先

- `docs/results/task-004-tsconfig-build-compat-worker-result.md`
- `docs/management/task-status.md`
- `docs/management/feature-status.md`
- `docs/management/decision-log.md`
