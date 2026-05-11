# Decision Log

## 初期決定

- MVPはReact + TypeScript + Vite
- 外部APIなし
- 認証なし
- DBなし
- localStorage保存
- ルールベース診断

## 2026-05-11 Manager判断

- `task-001-app-shell` は `docs/results/task-001-app-shell-worker-result.md` の成功記録に基づき `done` と判定
- 次実行Taskは `task-002-domain-types` を選定（依存なし、Feature 002の最小前進）
- `task-003-diagnosis-rules` は `task-002-domain-types` 完了待ち
- 現時点で STOP_REQUIRED 該当なし

## 2026-05-11 Manager再判定

- `docs/management/review.md` の判定に基づき、`task-002-domain-types` を `needs_rework`（Retry=1）へ更新。
- 指摘内容は「対象外差分混在」と「`npm run build`失敗（`tsconfig.json` 非推奨設定エラー）」。
- 次実行Taskは `task-002-domain-types` の再実行を継続選定（needs_rework優先ルール）。
- 現時点で同一Taskの失敗は1回のため、`STOP_REQUIRED.md` は未作成。

## 2026-05-11 Manager再再判定

- `task-002-domain-types` は型定義自体は受け入れ条件を満たす一方、`npm run build` が `tsconfig.json` 既知エラーで失敗し再完了判定不能。
- 「Task対象ファイル限定」と「build成功必須」の衝突を解消するため、ブロッカー解消専用Taskとして `task-004-tsconfig-build-compat` を追加。
- `task-002-domain-types` は `blocked` へ変更し、依存を `task-004-tsconfig-build-compat` に設定。
- 次実行Taskは `task-004-tsconfig-build-compat` を選定。
- 同一Task 2回失敗条件には未到達のため、`STOP_REQUIRED.md` は未作成。

## 2026-05-11 Manager Decision (Remove fixed-file-count constraint)

- 固定ファイル数/固定ファイル境界を差分適否の主判定から外す
- 判定軸を「Task目的への整合性」に変更
- 複数ファイル横断が必要なTaskは `cross-cutting` として明示運用する
- レビュー基準は「目的外変更なし」「受け入れ条件達成（例: build成功）」を必須化

## 2026-05-11 Manager再更新

- `needs_rework` 優先ルールに従い、次実行Taskを `task-004-tsconfig-build-compat` に固定。
- Workerが迷わないよう `current-task.md` を所定フォーマットへ統一し、対象ファイルを `tsconfig.json / src/App.tsx / src/main.tsx` に明示。
- `task-status.md` を実態へ同期（`task-001=done`, `task-002=blocked`, `task-004=needs_rework`）。
- 同一Task 2回失敗条件には未到達のため、`STOP_REQUIRED.md` は未作成。

## 2026-05-11 Manager更新（review反映）

- 直近 `docs/management/review.md` を反映し、`task-004-tsconfig-build-compat` は `NEEDS_REWORK` 継続と判定。
- 判定理由は「対象外差分混在」と「結果記録と実差分の不一致」。
- 次実行Taskは `task-004-tsconfig-build-compat` を継続選定（needs_rework優先ルール）。
- `task-002-domain-types` は `task-004` 完了まで `blocked` 維持。
- 同一Task 2回失敗には未到達のため、`STOP_REQUIRED.md` は未作成。

## 2026-05-11 Manager更新（task-004再実行指示）

- 必読ファイル再確認の結果、`needs_rework` の `task-004-tsconfig-build-compat` を次Taskに継続選定。
- Worker指示を「対象外差分を完了差分へ混在させない」「結果記録と実差分の一致必須」に再明確化。
- 未解決blockerなし、同一Task 2回失敗にも未到達のため、`STOP_REQUIRED.md` は未作成。

## 2026-05-11 Manager更新（review + results 突合）

- `docs/management/review.md` と `docs/results/` を照合し、`task-004-tsconfig-build-compat` は `NEEDS_REWORK` 継続と判定。
- 同一Taskの失敗回数を `Retry=2` に更新。
- AGENTS.md の STOP条件「同じTaskで2回失敗」に該当したため、`docs/management/STOP_REQUIRED.md` を作成。
- `blockers.md` に人間確認待ちを登録し、Feature 002 は一時停止扱い。

## 2026-05-11 Human Decision (Resolve STOP_REQUIRED for task-004)

- 判断: `task-004-tsconfig-build-compat` は分割せず継続再実行する（Option A）
- 方針:
  - 対象ファイル境界を厳守する
  - 結果記録（変更ファイル/コマンド/結果）を実差分と一致させる
  - `plannedAmount` の空/非数値入力時の扱いをコードと結果記録で一意化する
- 再開条件を満たしたため、`STOP_REQUIRED.md` を解除して実行再開する

## 2026-05-11 Manager更新（STOP再発行）

- 必読ファイル再確認時点で `task-004-tsconfig-build-compat` は `needs_rework` かつ `Retry=2` であり、AGENTS.md の STOP条件「同じTaskで2回失敗」に該当。
- 現在のHuman Decisionは再開済み履歴として残すが、現状態に対しては再度 `docs/management/STOP_REQUIRED.md` を発行し、実装を停止。
- `task-004` を `blocked` に更新し、Feature `feature-002-diagnosis-logic` も `blocked` へ更新。
- 次アクションは人間判断待ち（Task分割要否、`plannedAmount` 入力仕様、差分境界運用の再確定）。

## 2026-05-11 Manager更新（STOP_REQUIRED再発行・再停止）

- 必読ファイル確認時点で `task-004-tsconfig-build-compat` は `needs_rework` かつ `Retry=2` で維持されており、AGENTS.md の停止条件「同じTaskで2回失敗」に該当。
- 自動実行を停止するため `docs/management/STOP_REQUIRED.md` を再作成。
- `task-004` を `blocked`、Feature `feature-002-diagnosis-logic` を `blocked` に更新。
- 次アクションは人間判断待ち（継続再実行 or Task分割、`plannedAmount` 入力仕様、差分境界運用の再確定）。

## 2026-05-11 Human Decision (Re-open after repeated STOP_REQUIRED)

- 判断: `task-004-tsconfig-build-compat` は分割せず継続再実行する。
- 補足: `plannedAmount` は廃止し、`plannedShares` を採用済み。必要な購入予定額は `株価 × plannedShares` の派生値として扱う。
- 運用: 差分境界は固定ファイル数ではなくTask目的整合性で判定し、結果記録と実差分の一致を必須とする。

## 2026-05-11 Manager更新（STOP_REQUIRED発行）

- 必読ファイル確認時点で `task-004-tsconfig-build-compat` は `needs_rework` かつ `Retry=2`。
- AGENTS.md の停止条件「同じTaskで2回失敗」に該当するため、`docs/management/STOP_REQUIRED.md` を発行。
- `task-004` を `blocked`、Feature `feature-002-diagnosis-logic` を `blocked` へ更新。
- 次アクションは人間判断待ち（継続再実行 / Task分割 / 受け入れ条件見直し）。

## 2026-05-11 Human Decision (Introduce human_override to stop retry loop)

- 同一Task 2回失敗時の即STOP再発を防ぐため、`task-status.md` に `Human Override` 列を追加。
- `human_override=true` のTaskは、Retry=2でも1回のみ再実行を許可する。
- 再実行を選定した時点で `human_override` は `false` へ戻す運用とする。
- 初期設定として `task-004-tsconfig-build-compat` に `human_override=true` を付与して再開。

## 2026-05-11 Human Decision (Remove human_override, gate by STOP_REQUIRED only)

- `human_override` 運用を廃止する。
- 実行可否は `docs/management/STOP_REQUIRED.md` の有無のみで判定する。
- `STOP_REQUIRED.md` がない限り、Retry値に関係なく実行を継続する。
- Retry値は停止トリガーではなく注意情報として扱う。

## 2026-05-11 Manager更新（task-004再選定・指示具体化）

- 必読ファイル確認の結果、`needs_rework` 優先ルールにより次実行Taskは `task-004-tsconfig-build-compat` を継続選定。
- 実行可否は `STOP_REQUIRED.md` の有無のみで判定し、現時点でファイル不在のため実行継続とした。
- Worker向け指示を更新し、対象スコープを `tsconfig.json / src/App.tsx / src/main.tsx / 結果記録` に限定。
- 受け入れ条件として「対象外変更なし」「結果記録と実差分一致」を再明記。
- 未解決blockerなし。

## 2026-05-11 Manager更新（review/result反映・task-004再選定）

- `docs/management/review.md`（NEEDS_REWORK）と `docs/results/task-004-tsconfig-build-compat-worker-result.md` を確認。
- `task-004-tsconfig-build-compat` は「build成功確認済み」だが「対象外差分混在」「結果記録と実差分不一致」が未解消のため `needs_rework` を継続。
- `Retry` は注意情報として `3` に更新（停止判定は `STOP_REQUIRED.md` の有無のみを使用）。
- `STOP_REQUIRED.md` 不在のため実行継続可と判断し、次実行Taskを `task-004-tsconfig-build-compat` に再設定。
- `task-002-domain-types` は依存関係により `blocked` 維持。

## 2026-05-11 Manager更新（task-004再実行指示の明確化）

- 必読ファイル確認の結果、`needs_rework` 優先ルールにより次実行Taskは `task-004-tsconfig-build-compat` を継続選定。
- `docs/management/STOP_REQUIRED.md` は不在のため、停止せず実行継続と判断。
- `current-task.md` を更新し、Worker向けに「対象外差分を最終差分から除外」「結果記録と最終 `git diff` の1ファイル単位一致」を明示。
- `task-status.md` の `task-004` は `needs_rework` 維持、Retryは注意情報として `4` に更新。
- blockerは新規発生なし（`blockers.md` 維持）。

## 2026-05-11 Human Decision (Close STOP_REQUIRED for task-004)

- 判断: `STOP_REQUIRED` の3論点をすべて許可し、本停止をクローズする。
- 許可1: `task-004` の最終差分として許可するファイル範囲は `tsconfig.json` / `src/App.tsx` / `src/main.tsx` / `docs/results/task-004-tsconfig-build-compat-worker-result.md` に確定。
- 許可2: `docs/results/task-004-tsconfig-build-compat-worker-result.md` は最終 `git diff` と1ファイル単位で一致させる運用を確定。
- 許可3: `tsconfig.tsbuildinfo` は差分に含めない運用とし、追跡対象外として扱う方針を確定。
- 再開条件を満たしたため、`docs/management/STOP_REQUIRED.md` を解消して実行再開する。

## 2026-05-11 Human Decision (Approve global diff policy and close STOP_REQUIRED)

- 判断: STOP_REQUIREDの3論点を承認し、運用を確定する。
- 承認1: `task-004` を含む実装Taskの最終差分許可範囲は `src/**` / `docs/results/**` / `tsconfig.json` とする。
- 承認2: `tsconfig.tsbuildinfo` は追跡対象外・差分除外運用とする。
- 承認3: 結果記録ファイルは最終 `git diff` と1ファイル単位で一致必須とする。
- 上記承認により `STOP_REQUIRED.md` を解消し、次のTask選定へ進む。

## 2026-05-11 Manager更新（review OK反映・次Task切替）

- 直近 `docs/management/review.md`（判定: OK）と `docs/results/task-004-tsconfig-build-compat-worker-result.md` を照合し、`task-004-tsconfig-build-compat` を `done` と判定。
- `task-004` 完了により依存待ちだった `task-002-domain-types` を再評価し、結果記録の実装内容を確認のうえ `done` へ更新。
- `needs_rework` / `blocked` の未解決Taskが解消されたため、次実行Taskを `task-003-diagnosis-rules` に切り替え。
- `docs/management/STOP_REQUIRED.md` は不在で、AGENTS.md の停止条件にも新規該当なし。
