# Task 003

## Feature

Feature 002: Diagnosis Logic

## 目的

ルールベース診断関数を実装する。

## 依存Task

Task 002

## 対象ファイル

- src/domain/diagnosis.ts
- src/domain/types.ts

## 実装内容

- evaluateDiagnosis(input) を実装する
- scoreを算出する
- dangerLevelを返す
- warningsを返す
- summaryMessageを返す

## 受け入れ条件

- docs/specs/diagnosis-rules.md の加点ルールに従う
- UIに依存しない
- 同じ入力なら同じ結果を返す

## 実行するテスト

- npm run build

## 禁止事項

- UI実装禁止
- 外部API利用禁止
