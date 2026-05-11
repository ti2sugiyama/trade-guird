# Task 002

## Feature

Feature 002: Diagnosis Logic

## 目的

診断入力、診断結果、危険度の型を定義する。

## 依存Task

なし

## 対象ファイル

- src/domain/types.ts

## 実装内容

- DiagnosisInput
- DiagnosisResult
- DangerLevel
- WarningItem
を定義する。

## 受け入れ条件

- 型がexportされている
- UIに依存しない
- docs/specs/diagnosis-rules.md の入力項目と対応している

## 実行するテスト

- npm run build

## 禁止事項

- UI実装禁止
- localStorage実装禁止
