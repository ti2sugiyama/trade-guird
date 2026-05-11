# Architecture

## 技術構成

- Frontend: React + TypeScript + Vite
- Backend: なし
- Storage: localStorage
- Domain Logic: src/domain
- Storage Wrapper: src/storage
- UI Components: src/components

## ディレクトリ責務

```text
src/domain/
  診断ルール、スコアリング、型定義

src/storage/
  localStorageへの保存・取得

src/components/
  UIコンポーネント
```

## 設計方針

- 診断ロジックはUIから分離する
- localStorageアクセスは直接UIに書かない
- MVPでは状態管理ライブラリを使わない
- 依存パッケージは増やさない
