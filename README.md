# 恐竜博物館 滞在費ガイド

全国の恐竜博物館の入館料・化石発掘体験・館内グルメ・お土産から、家族の現地滞在費を計算する Next.js（App Router）サイト。

## ローカル起動

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # 本番ビルドの確認
```

## 編集ポイント

| やりたいこと | 編集するファイル |
| --- | --- |
| 施設・料金・メニュー・お土産の追加/修正 | `data/museums.ts`（配列に1件追加で全ページに反映） |
| アフィリエイトIDの設定 | `config/affiliates.ts` の `AFFILIATE_IDS` |
| 注目イベント（フォールバック）の更新 | `data/events.ts` |
| ニュース取得元RSS・更新間隔 | `lib/events.ts` の `FEEDS` / `EVENTS_REVALIDATE` |
| チェックリスト項目 | `data/checklist.ts` |

掲載料金・メニュー価格は目安です。公開前に各施設の公式サイトで確認し、`lastVerified` を更新してください。

## Vercel への公開

1. GitHub にリポジトリを作成して push
2. https://vercel.com に GitHub でログイン →「Add New → Project」→ リポジトリを Import
3. Framework は Next.js が自動選択されるので、そのまま「Deploy」
