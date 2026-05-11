# Current Task

## Task ID

task-003-diagnosis-rules

## Feature

feature-002-diagnosis-logic

## 目的

`evaluateDiagnosis(input)` を最小実装し、仕様の加点ルールに従って `score` / `dangerLevel` / `warnings` / `summaryMessage` を返せる状態にする。

## 対象スコープ

- `src/domain/diagnosis.ts`
- `src/domain/types.ts`（Task目的に必要な最小調整のみ）
- `docs/results/**`
- 参照タスク定義: `docs/tasks/task-003-diagnosis-rules.md`
- 参照仕様: `docs/specs/diagnosis-rules.md`

## 実装内容

- `task-003-diagnosis-rules` を実行する。
- `evaluateDiagnosis(input)` を実装する。
- 仕様に従って `score` を算出する。
- `dangerLevel` / `warnings` / `summaryMessage` を返却する。
- 実装はUI非依存の純粋ロジックとして行う。
- 作業結果を `docs/results/task-003-diagnosis-rules-worker-result.md` に記録する。

## 受け入れ条件

- `docs/specs/diagnosis-rules.md` の加点ルールに従っている。
- 同じ入力で同じ結果を返す（決定的動作）。
- UIに依存していない。
- `npm run build` が成功する。
- 依存パッケージ追加なし。
- Task完了差分（実装対象）は `src/**` / `docs/results/**` / `tsconfig.json` の範囲に収まる。

## 実行するテスト

- `npm run build`

## 禁止事項

- UI実装
- 外部API利用
- 依存パッケージ追加
- 仕様追加
- `docs/management/**` をTask完了差分に混在させること

## 完了後の記録先

- `docs/results/task-003-diagnosis-rules-worker-result.md`
