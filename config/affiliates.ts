/**
 * アフィリエイト設定ファイル
 * ------------------------------------------------------------
 * ここに各ASPで発行されたIDを貼るだけで、全施設の
 * 「お出かけ計画・手配サポート」リンクが一括で切り替わります。
 *
 * - IDが空文字（""）の場合は、アフィリエイトを経由しない通常リンクになります。
 * - 各サービスの検索URL形式は変更されることがあるため、
 *   公開前に実際にクリックして遷移先を確認してください。
 * - アフィリエイトリンクを掲載する場合は、ステルスマーケティング規制
 *   （景品表示法）に基づき「広告・PRを含む」旨の表記が必要です。
 *   表記文言は DISCLOSURE_TEXT で変更できます。
 */

export const DISCLOSURE_TEXT =
  "本セクションのリンクには広告（アフィリエイトリンク）が含まれます。料金・空室は各サービスでご確認ください。";

/** 各ASPのトラッキングID（ここを書き換えるだけでOK） */
export const AFFILIATE_IDS = {
  /** 楽天アフィリエイトID 例: "1a2b3c4d.5e6f7a8b.1a2b3c4e.5e6f7a8c" */
  rakuten: "",
  /** バリューコマース（じゃらん等）: sid / pid */
  valuecommerceSid: "",
  valuecommercePidJalan: "",
  valuecommercePidHotpepper: "",
  /** A8.net 等でアソビュー！を扱う場合の a8mat パラメータ */
  asoviewA8mat: "",
  /** 食べログ（バリューコマース等で提携する場合の pid） */
  valuecommercePidTabelog: "",
} as const;

/**
 * リアルタイム価格APIのキー（Vercel の Environment Variables に設定する）
 * - RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY : 楽天ウェブサービスのアプリID・アクセスキー（宿の最安値）
 * - RAKUTEN_AFFILIATE_ID                : 楽天アフィリエイトID（宿リンクを自動でアフィリエイト化）
 * - HOTPEPPER_API_KEY                   : ホットペッパーグルメ Webサービスのキー（周辺飲食店・クーポン）
 * 未設定の場合、その一覧は表示されず検索リンクのみになります。
 */
export const API_KEYS = {
  rakutenAppId: process.env.RAKUTEN_APP_ID ?? "",
  rakutenAccessKey: process.env.RAKUTEN_ACCESS_KEY ?? "",
  rakutenAffiliateId: process.env.RAKUTEN_AFFILIATE_ID || AFFILIATE_IDS.rakuten,
  hotpepperKey: process.env.HOTPEPPER_API_KEY ?? "",
};

/* ---------- ラッパー（アフィリエイトURLへの変換） ---------- */

export function wrapRakuten(url: string): string {
  if (!AFFILIATE_IDS.rakuten) return url;
  return `https://hb.afl.rakuten.co.jp/hgc/${AFFILIATE_IDS.rakuten}/?pc=${encodeURIComponent(
    url
  )}&m=${encodeURIComponent(url)}`;
}

export function wrapValueCommerce(url: string, pid: string): string {
  if (!AFFILIATE_IDS.valuecommerceSid || !pid) return url;
  return `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${AFFILIATE_IDS.valuecommerceSid}&pid=${pid}&vc_url=${encodeURIComponent(
    url
  )}`;
}

function wrapA8(url: string, a8mat: string): string {
  if (!a8mat) return url;
  return `https://px.a8.net/svt/ejp?a8mat=${a8mat}&a8ejpredirect=${encodeURIComponent(
    url
  )}`;
}

const q = (s: string) => encodeURIComponent(s);

/* ---------- 各サービスの検索URL定義 ---------- */

export type LinkCategory = "stay" | "rentacar" | "lunch" | "ticket";

export interface ProviderDef {
  id: string;
  label: string;
  category: LinkCategory;
  /** keyword: 施設ごとの検索語（data/museums.ts の search フィールド） */
  buildUrl: (keyword: string) => string;
}

export const PROVIDERS: ProviderDef[] = [
  // 1. 宿泊
  {
    id: "rakuten-travel",
    label: "楽天トラベル",
    category: "stay",
    buildUrl: (kw) =>
      wrapRakuten(`https://kw.travel.rakuten.co.jp/keyword/Search.do?f_query=${q(kw)}`),
  },
  {
    id: "jalan",
    label: "じゃらん",
    category: "stay",
    buildUrl: (kw) =>
      wrapValueCommerce(
        `https://www.jalan.net/uw/uwp1700/uww1701.do?keyword=${q(kw)}`,
        AFFILIATE_IDS.valuecommercePidJalan
      ),
  },
  // 2. レンタカー
  {
    id: "rakuten-rentacar",
    label: "楽天レンタカー",
    category: "rentacar",
    buildUrl: () => wrapRakuten("https://travel.rakuten.co.jp/cars/"),
  },
  {
    id: "jalan-rentacar",
    label: "じゃらんレンタカー",
    category: "rentacar",
    buildUrl: () =>
      wrapValueCommerce("https://www.jalan.net/rentacar/", AFFILIATE_IDS.valuecommercePidJalan),
  },
  // 3. 周辺ランチ
  {
    id: "tabelog",
    label: "食べログ",
    category: "lunch",
    buildUrl: (kw) =>
      wrapValueCommerce(
        `https://tabelog.com/rstLst/?vs=1&sk=${q(kw)}`,
        AFFILIATE_IDS.valuecommercePidTabelog
      ),
  },
  {
    id: "hotpepper",
    label: "ホットペッパーグルメ",
    category: "lunch",
    buildUrl: (kw) =>
      wrapValueCommerce(
        `https://www.hotpepper.jp/CSP/psh010/doBasic?FWT=${q(kw)}`,
        AFFILIATE_IDS.valuecommercePidHotpepper
      ),
  },
  // 4. チケット・体験
  {
    id: "asoview",
    label: "アソビュー！",
    category: "ticket",
    buildUrl: (kw) =>
      wrapA8(`https://www.asoview.com/search/?q=${q(kw)}`, AFFILIATE_IDS.asoviewA8mat),
  },
];

export const CATEGORY_META: Record<LinkCategory, { title: string; description: string }> = {
  stay: {
    title: "周辺の宿泊施設・恐竜ルームの空室確認",
    description: "施設周辺のホテル・旅館の空室と料金を比較",
  },
  rentacar: {
    title: "最寄り駅・空港からのレンタカー料金比較",
    description: "公共交通が少ないエリアは車移動が便利",
  },
  lunch: {
    title: "博物館周辺のランチ・飲食店検索",
    description: "館内が混雑する時間帯の代替候補に",
  },
  ticket: {
    title: "事前チケット・体験プログラムの予約",
    description: "当日券の待ち時間を減らす",
  },
};
