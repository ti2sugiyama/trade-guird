# Diagnosis Rules

## 入力項目

- tickerName: 銘柄名
- plannedShares: 購入予定株数
- isSurging: 急騰中か
- isFalling: 下落中か
- isAveragingDown: ナンピン目的か
- isEarningsNear: 決算前後か
- influencedByBoard: 掲示板に影響されたか
- revengeTrade: 損を取り返したい気持ちが強いか
- memo: メモ

補足:
- `plannedAmount`（購入予定額）が必要な場合は、購入決定時の `株価 × plannedShares` を派生値として扱う。

## 判定

危険度は `low`, `medium`, `high` の3段階。

## 加点ルール

- isSurging: +25
- isFalling: +15
- isAveragingDown: +30
- isEarningsNear: +25
- influencedByBoard: +20
- revengeTrade: +30

## 危険度

- 0〜29: low
- 30〜69: medium
- 70以上: high

## メッセージ方針

- high: 今日は買わずに一晩置くことを強く推奨
- medium: 条件を整理してから再検討
- low: 重大な危険サインは少ないが、購入理由を明文化
