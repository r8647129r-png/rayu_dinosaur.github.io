/**
 * 画像設定（ここだけ書き換えれば全ページの写真が差し替わります）
 * ------------------------------------------------------------
 * 1. 写真ファイルを public/images/museums/<施設ID>/ に置く
 *    例: public/images/museums/mifune/hero.jpg
 * 2. 下の src に "/images/museums/mifune/hero.jpg" のように書く
 *    （外部URL "https://..." も可）
 * 3. 撮影者・提供元がある場合は credit に書く（画像の右下に表示）
 *
 * src が未設定の画像は「写真提供募集中 / イメージ」のプレースホルダーで表示されます。
 * gallery の順番は data/museums.ts の highlights（見どころ）と対応します。
 */

export interface ImageSpec {
  src?: string;
  alt: string;
  credit?: string;
}

export interface MuseumImageSet {
  hero: ImageSpec;
  gallery: ImageSpec[]; // 最大3枚（highlights と同じ順番）
}

export const MUSEUM_IMAGES: Record<string, MuseumImageSet> = {
  fukui: {
    hero: { alt: "福井県立恐竜博物館の外観・展示室" },
    gallery: [{ alt: "恐竜の全身骨格が並ぶ展示室" }, { alt: "化石研究体験" }, { alt: "野外恐竜博物館の発掘現場" }],
  },
  kahaku: {
    hero: { alt: "国立科学博物館の外観" },
    gallery: [{ alt: "地球館地下1階の恐竜展示" }, { alt: "家族での見学" }, { alt: "レストランの恐竜メニュー" }],
  },
  gunma: {
    hero: { alt: "群馬県立自然史博物館の展示" },
    gallery: [{ alt: "恐竜の全身骨格" }, { alt: "家族での見学" }, { alt: "企画展の展示" }],
  },
  mukawa: {
    hero: { alt: "むかわ町穂別恐竜博物館" },
    gallery: [{ alt: "むかわ竜（カムイサウルス）の骨格" }, { alt: "海洋化石館の展示" }, { alt: "リニューアルした館内" }],
  },
  mifune: {
    hero: { alt: "御船町恐竜博物館" },
    gallery: [{ alt: "化石研究の拠点" }, { alt: "体験プログラム" }, { alt: "ティラノサウルスの全身骨格" }],
  },
  nagasaki: {
    hero: { alt: "長崎市恐竜博物館と海の眺め" },
    gallery: [{ alt: "ティラノサウルス全身骨格レプリカ" }, { alt: "オープンラボ" }, { alt: "恐竜パークからの眺め" }],
  },
  kanna: {
    hero: { alt: "神流町恐竜センター" },
    gallery: [{ alt: "化石さがし体験" }, { alt: "ティラノサウルス産状骨格" }, { alt: "モンゴルの恐竜化石展示" }],
  },
  tamba: {
    hero: { alt: "丹波市立たんば恐竜博物館" },
    gallery: [{ alt: "丹波竜の展示" }, { alt: "5つのゾーンの常設展示" }, { alt: "特別展の展示" }],
  },
};

export function getMuseumImages(id: string): MuseumImageSet {
  return MUSEUM_IMAGES[id] ?? { hero: { alt: "博物館のイメージ" }, gallery: [] };
}
