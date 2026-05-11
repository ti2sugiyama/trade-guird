# Diff Scope Policy

## Purpose

Task境界を守りつつ、必要な横断修正を可能にする。

## Policy

差分の適否は「ファイル数」ではなく「Task目的への整合性」で判定する。

- 対象外ファイル変更を一律禁止しない
- 変更はすべて Task目的に直接必要であること
- 目的外変更（ついで修正・無関係整形）は禁止

## Task Type

### scoped

- 影響範囲が明確で小さいTask
- 必要に応じて対象ファイルを指定して運用

### cross-cutting

- 目的達成に複数モジュール修正が必要なTask
- ファイル固定ではなく、変更理由の明示を必須とする

## Required Review Checks

- 変更はTask目的に直接寄与しているか
- 受け入れ条件を満たしているか（例: `npm run build` 成功）
- 目的外変更が混入していないか

## Required Record

Worker結果には、変更ファイルごとに以下を記録する。

- 変更内容
- その変更がTask目的に必要な理由（1行）
