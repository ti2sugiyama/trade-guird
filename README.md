# AI Dev Role Template / 株売買ヘルパーMVP Lite

このプロジェクトは、Codex CLIで以下の開発フローを試すための雛形です。

```text
Human
  ↓
Manager
  ↓
Planner / Architect
  ↓
Task Queue
  ↓
Manager → Worker → Reviewer → Manager
  ↓
Tester
  ↓
Documenter
  ↓
Manager
```

## 目的

- 人間が毎回ワーカーにプロンプトを貼らない
- Manager が Feature / Task / STOP を管理する
- Worker は毎回リセットして `current-task.md` だけ実装する
- Reviewer は差分レビューだけ行う
- Feature 完了時に Tester / Documenter を使う

## 含まれるもの

```text
prompts/
  manager.md
  planner.md
  architect.md
  worker.md
  reviewer.md
  tester.md
  documenter.md

scripts/
  run-feature-cycle.sh
  run-one-task.sh
  run-planning.sh
  run-feature-finish.sh
  clear-stop.sh

docs/
  specs/
  features/
  tasks/
  management/
  results/

src/
  React + TypeScript の小さなMVP雛形
```

## 初回セットアップ

```bash
npm install
npm run dev
```

## Codex CLIで試す

まず Codex CLI が使える状態にしてください。

```bash
codex --help
```

### 1. Featureの計画だけ作る

```bash
./scripts/run-planning.sh "診断入力フォームを作りたい"
```

### 2. Taskを1つだけ実装する

```bash
./scripts/run-one-task.sh
```

### 3. Feature単位で自動ループする

```bash
./scripts/run-feature-cycle.sh
```

追加指示をWorkerに渡す場合（例: 取得は日付レンジ限定を優先）:

```bash
./scripts/run-feature-cycle.sh --max-tasks 3 --instruction "データ取得はstart/end日付指定を優先して実装する"
```

Task単発で追加指示を渡す場合:

```bash
./scripts/run-one-task.sh --instruction "データ取得はstart/end日付指定を優先して実装する"
```

`STOP_REQUIRED.md` が作成されたら人間確認が必要です。

```bash
cat docs/management/STOP_REQUIRED.md
```

解除する場合:

```bash
./scripts/clear-stop.sh
```

## 重要な考え方

- Manager だけが次の作業を決めます
- Worker は次のTaskを決めません
- Reviewer はコード修正しません
- Planner / Architect は毎回呼びません
- Tester / Documenter は主にFeature完了時に呼びます
- Worker / Reviewer は `codex exec` により毎回使い捨てにします

## 推奨する実行サイクル

最初は完全自動にしすぎず、以下がおすすめです。

```bash
./scripts/run-one-task.sh
git diff
npm test
```

慣れてから:

```bash
./scripts/run-feature-cycle.sh
```
