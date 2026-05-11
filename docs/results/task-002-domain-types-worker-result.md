# Worker Result

## Task ID

task-002-domain-types

## 実装内容

- `src/domain/types.ts` の `DiagnosisInput.plannedAmount` を `number` に修正。
- 以下の型が `export` されていることを確認。
  - `DangerLevel`
  - `DiagnosisInput`
  - `WarningItem`
  - `DiagnosisResult`

## 変更ファイル

- src/domain/types.ts
- docs/results/task-002-domain-types-worker-result.md

## 実行したテスト

- `npm run build`

## 結果

- 失敗（Task実装箇所とは別要因）
- エラー内容:
  - `tsconfig.json` の `moduleResolution=node10` が非推奨で TypeScript 7.0 で無効化予定
  - `ignoreDeprecations: "6.0"` の指定または設定移行が必要というエラー

## 未解決事項

- `npm run build` を通すには `tsconfig.json` の調整が必要。
- ただし今回のTask指定対象は `src/domain/types.ts` のため未対応。

## 注意点

- `DiagnosisInput.plannedAmount` は `number` 型になったため、UI側で文字列を扱っている箇所との整合が別Taskで必要。
