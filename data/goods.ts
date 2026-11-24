/**
 * 「行く前の予習・お土産グッズ」の商品カード
 * ------------------------------------------------------------
 * 価格は楽天市場などでの一般的な価格帯の目安です（estimate として表示）。
 * keyword は楽天市場の検索語。image に画像パスを入れると商品画像が表示されます。
 */
export interface GoodsItem {
  id: string;
  name: string;
  description: string;
  priceFrom: number; // 目安（円〜）
  keyword: string;
  image?: string;
}

export const PREP_GOODS: GoodsItem[] = [
  {
    id: "zukan",
    name: "子ども向け 恐竜図鑑",
    description: "行く前に子どもと予習。見たい恐竜を決めておくと館内で迷わない",
    priceFrom: 2000,
    keyword: "恐竜 図鑑 子供",
  },
  {
    id: "zukan-dvd",
    name: "DVD付き 恐竜図鑑",
    description: "動く映像で恐竜の大きさや動きをイメージしやすい",
    priceFrom: 2200,
    keyword: "恐竜 図鑑 DVD付き",
  },
  {
    id: "figure",
    name: "恐竜フィギュア",
    description: "定番のお土産。博物館で見た恐竜を家でも",
    priceFrom: 1500,
    keyword: "恐竜 フィギュア",
  },
  {
    id: "plush",
    name: "恐竜ぬいぐるみ",
    description: "小さな子どものお土産に人気",
    priceFrom: 2000,
    keyword: "恐竜 ぬいぐるみ",
  },
  {
    id: "dig-kit",
    name: "化石発掘キット",
    description: "家で発掘体験の続きができる",
    priceFrom: 1200,
    keyword: "化石発掘キット",
  },
  {
    id: "puzzle",
    name: "恐竜 骨格パズル",
    description: "組み立てながら骨のしくみを学べる",
    priceFrom: 1000,
    keyword: "恐竜 骨格 パズル",
  },
];
