# Architecture

## 技術構成

- Frontend: React + TypeScript + Vite
- Backend: なし
- API: なし（外部通信を前提にしない）
- Domain Logic: `src/domain`
- Storage: localStorage + ファイル生成（CSV/埋め込みTS）
- Storage Wrapper: `src/storage`
- Data Source Adapter: `src/data` / `src/collect_yahoo_prices_csv.py`
- UI Components: `src/App.tsx`（MVPでは単一画面）

## ディレクトリ責務

```text
src/
  App.tsx
    画面表示とイベント処理。domain/storage/dataを組み合わせる。

  domain/
    診断ルール、データ管理一覧の判定ロジック、型定義。
    価格CSVの有無判定などの業務ロジックを置く。

  storage/
    localStorageへの保存・取得の薄いラッパー。

  data/
    参照用の埋め込みデータ（例: 銘柄マスタ、価格CSVインデックス）。

  collect_yahoo_prices_csv.py
    公式データ・価格CSVの取り込みと、`src/data` への変換を行う。
```

## Feature 007 向け境界定義

- Frontend
  - 一覧表示と操作のみ担当する。
  - 「未取得」の判定そのものは持たない（domain結果を表示するだけ）。
- Domain
  - 銘柄マスタ基準で一覧行を生成する。
  - 各銘柄の価格CSV有無を `fetched/unfetched` の状態として一意に判定する。
- Storage
  - localStorageはUI状態や履歴に限定し、銘柄マスタの正本は置かない。
  - 銘柄マスタと価格CSVメタ情報は `src/data` の生成物を読む。
- API/Backend
  - MVPでは追加しない。
  - 公式データ取り込みはオフライン前処理（Pythonスクリプト）で完結させる。

## 依存方向

- `App.tsx` → `domain` / `storage` / `data`
- `domain` → `types`（必要時に `data` を入力として受けるが、直接IOしない）
- `storage` → ブラウザAPI（localStorage）のみ
- `collect_yahoo_prices_csv.py` → `src/data` 生成（実行時UI依存なし）

## 設計方針

- 診断ロジックや一覧判定ロジックはUIから分離する
- localStorageアクセスは直接UIに書かない
- storageは薄いラッパーにする
- MVPでは状態管理ライブラリを使わない
- 外部API・認証・課金・DBは追加しない
- 依存パッケージは増やさない
