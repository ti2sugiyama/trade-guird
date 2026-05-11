# Worker Result

## Task ID

task-006-real-market-diagnosis-adapter

## 実装内容

- 実データCSVを `src/data/embeddedMarketCsv.ts` から読み込む導線（`src/App.tsx` -> `buildDiagnosisInputFromMarketCsv`）を維持。
- 欠損銘柄時に `実データ診断不可: <ticker> の価格データが見つかりません。` を返す挙動（`src/domain/diagnosis.ts`）を維持。
- 許可範囲外の未追跡差分 `data/**`、`docs/features/feature-004-real-market-diagnosis.md`、`docs/tasks/task-006-real-market-diagnosis-adapter.md` を完了判定差分から外すため、`/private/tmp/trade-guird-task006-hold` へ退避。

## 変更ファイル

- src/App.tsx
- src/domain/diagnosis.ts
- src/domain/types.ts
- src/data/embeddedMarketCsv.ts
- docs/results/task-006-real-market-diagnosis-adapter-worker-result.md

## 変更理由（ファイルごと）

- `src/App.tsx`: 実データCSVを使う診断導線を維持し、画面から実データ診断を実行できる状態を保つため。
- `src/domain/diagnosis.ts`: CSV変換ロジックと欠損銘柄時の明示的エラー返却を維持するため。
- `src/domain/types.ts`: 実データ診断導線で使う入力ソース型を維持するため。
- `src/data/embeddedMarketCsv.ts`: 実データ診断入力の埋め込みCSVを `src/**` 配下で管理するため。
- `docs/results/task-006-real-market-diagnosis-adapter-worker-result.md`: Task実施内容、検証結果、差分収束状況を記録するため。

## 実行したテスト

- `npm run build`

## 結果

- `npm run build` は成功。
- 実データ経路で診断結果表示が可能な実装状態を維持。
- 欠損銘柄時の明示的失敗メッセージを維持。
- `docs/management/**` を除く差分は `src/**` と `docs/results/**` に収束（`git status --short` で確認）。

完了判定対象として残した差分一覧:

- `src/App.tsx`
- `src/domain/diagnosis.ts`
- `src/domain/types.ts`
- `src/data/embeddedMarketCsv.ts`
- `docs/results/task-006-real-market-diagnosis-adapter-worker-result.md`

除外差分の扱い:

- `data/**`、`docs/features/feature-004-real-market-diagnosis.md`、`docs/tasks/task-006-real-market-diagnosis-adapter.md` は許可範囲外の未追跡差分のため、完了判定対象から除外する目的で `/private/tmp/trade-guird-task006-hold` に退避。
- `docs/management/**` の差分は管理運用差分として完了判定対象外。

## 未解決事項

- なし

## 注意点

- 退避した許可範囲外ファイルを戻す必要がある場合は `/private/tmp/trade-guird-task006-hold` を参照すること。
