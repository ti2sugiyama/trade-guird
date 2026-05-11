# AGENTS.md

このリポジトリは、AIロール分担による小さな自動開発ループを前提にしています。

## プロジェクト方針

- MVPを小さく動かす
- FeatureをTaskへ分解する
- Taskは最小単位で実装する
- 人間確認が必要になるまで自動で進める
- STOP条件を強めにする

## 正とする情報

優先順位は以下です。

1. `docs/specs/`
2. `docs/features/`
3. `docs/tasks/`
4. `docs/management/current-task.md`
5. 現在のコード

## 共通禁止事項

- 指示された範囲外を勝手に変更しない
- 大規模リファクタを勝手にしない
- 仕様を勝手に追加しない
- UI文言を勝手に大きく変えない
- 依存パッケージを勝手に追加しない
- 認証、課金、DB設計を勝手に追加しない
- エラーを握り潰さない
- テスト失敗を隠さない

## Task差分の共通許可範囲

- 全Taskで、実装差分として許可する範囲は原則 `src/**`、`docs/results/**`、`tsconfig.json` のみとする。
- `docs/management/**` の更新は管理運用用とし、Task完了差分の判定対象外として別コミットで扱う。
- `*.tsbuildinfo` は追跡対象外とし、Task差分に含めない。

## STOP_REQUIREDを作成する条件

以下の場合は `docs/management/STOP_REQUIRED.md` を作成してください。

- 仕様が曖昧
- 仕様同士が矛盾
- API契約変更が必要
- DB設計変更が必要
- 認証・課金に影響
- 依存パッケージ追加が必要
- 大規模リファクタが必要
- git diffが大きすぎる
- テストが通らない原因が不明
- データ消失リスク
- セキュリティ上の懸念

補足:
- `Retry` 回数は停止トリガーではなく注意情報として扱う。
- `STOP_REQUIRED.md` の作成は、Reviewerが `review.md` を `STOP_REQUIRED` 判定した場合、またはManagerが上記の明確な停止条件を確認した場合に限る。

## 推奨変更単位

- 1 Task = 1つの小さな目的
- 1 Task = 1コミット候補
- 1 Feature = 複数Taskのまとまり
