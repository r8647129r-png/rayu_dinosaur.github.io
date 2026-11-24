/**
 * 恐竜博物館データベース
 * ------------------------------------------------------------
 * 施設を追加する場合は、MUSEUMS 配列に Museum 型のオブジェクトを1件追加するだけで
 * 一覧・詳細ページ・シミュレーター・絞り込みすべてに自動反映されます。
 *
 * 料金・時間・メニューは 2026年11月 に各施設の公式サイトで確認した値です（sources 参照）。
 * PriceItem の estimate: true は公式に価格の記載がない「目安」です。画面上でも「目安」と表示されます。
 */

export type AreaKey = "hokkaido-tohoku" | "kanto" | "hokuriku-chubu" | "kansai" | "kyushu";

export const AREAS: { key: AreaKey; label: string }[] = [
  { key: "hokkaido-tohoku", label: "北海道・東北" },
  { key: "kanto", label: "関東" },
  { key: "hokuriku-chubu", label: "北陸・中部" },
  { key: "kansai", label: "関西" },
  { key: "kyushu", label: "九州" },
];

export type Rating = 1 | 2 | 3 | 4 | 5;

export type HighlightIcon = "skeleton" | "dig" | "free" | "food" | "lab" | "view" | "calendar" | "family";

export interface PriceItem {
  id: string;
  name: string;
  /** 税込価格（円） */
  price: number;
  /** true: 公式に価格記載がない目安価格 */
  estimate?: boolean;
}

export interface FeeTable {
  adult: number;
  student: number; // 高校生・大学生
  child: number; // 小・中学生
  preschool: number; // 未就学児
}

export interface Museum {
  id: string;
  name: string;
  shortName: string;
  prefecture: string;
  area: AreaKey;
  address: string;
  access: { station: string; ic: string; note?: string };
  hours: string;
  closed: string;
  officialUrl: string;
  ratings: { exhibit: Rating; dig: Rating; food: Rating; family: Rating };
  review: {
    headline: string;
    body: string;
    tips: string[];
    reservationLevel: Rating;
    reservationNote: string;
    recommendedStay: string;
  };
  /** 見どころ（data/images.ts の gallery と同じ順番。最大3つ） */
  highlights: { icon: HighlightIcon; title: string; text: string }[];
  fees: FeeTable;
  feeNotes: string[];
  specialExhibit?: { label: string; fees: FeeTable; note: string };
  dig: {
    available: boolean;
    name: string;
    /** 1人あたり料金。null は「料金は施設へ確認」 */
    price: { adult: number; child: number } | null;
    note: string;
  };
  restaurant: {
    inHouse: boolean;
    name: string;
    note: string;
    menu: PriceItem[];
  };
  souvenirs: PriceItem[];
  search: { stay: string; rentacarFrom: string; lunch: string; ticket: string };
  /** 周辺の宿・飲食店のリアルタイム検索に使う座標（国土地理院の住所検索で取得） */
  geo: { lat: number; lng: number };
  /** 割引・お得な券（公式サイト記載のもの） */
  discounts: { label: string; detail: string }[];
  sources: { label: string; url: string }[];
  lastVerified: string; // YYYY-MM
}

export const MUSEUMS: Museum[] = [
  {
    id: "fukui",
    name: "福井県立恐竜博物館",
    shortName: "福井",
    prefecture: "福井県",
    area: "hokuriku-chubu",
    address: "福井県勝山市村岡町寺尾51-11（かつやま恐竜の森内）",
    access: {
      station: "えちぜん鉄道 勝山駅からバスまたはタクシー。JR福井駅から直行バスあり（毎日運行）",
      ic: "中部縦貫自動車道 勝山IC から国道416号（福井北JCTから約30分）",
      note: "駐車場は約1,400台（無料）。小松空港から空港連絡バスあり。",
    },
    hours: "9:00〜17:00（入館は16:30まで）。夏季延長期間は8:30〜18:00",
    closed: "第2・第4水曜日（祝日の場合は翌日、夏休み期間は無休）、12月31日・1月1日",
    officialUrl: "https://www.dinosaur.pref.fukui.jp/",
    ratings: { exhibit: 5, dig: 5, food: 5, family: 4 },
    review: {
      headline: "国内最大級の恐竜展示。入館は日時指定の予約制",
      body:
        "ドーム型の展示室に全身骨格が並ぶ、国内随一の恐竜博物館です。館内では化石発掘や化石クリーニングなどの「化石研究体験」ができ、春〜秋は実際の発掘現場を巡る「野外恐竜博物館」も開催されます。館内レストランは恐竜モチーフのメニューが充実しています。",
      tips: [
        "入館には日時指定の観覧券が必要。公式サイトで事前購入しておくのが確実（当日券は販売上限まで）",
        "化石研究体験は単独の事前販売がなく、常設展観覧券とセットで購入する",
        "野外恐竜博物館は2026年の開催を終了。2027年は4月中旬〜下旬頃に再開予定",
        "レストランは席の予約不可。混雑時は車で10分のスキージャム勝山の利用も公式に案内されている",
      ],
      reservationLevel: 4,
      reservationNote: "日時指定の観覧券が必要。キャンセルは常設展券なら当日16:30まで。",
      recommendedStay: "3〜5時間",
    },
    highlights: [
      { icon: "skeleton", title: "ドームに並ぶ全身骨格", text: "国内最大級の恐竜展示。大型の全身骨格がずらりと並ぶ光景は圧巻です。" },
      { icon: "dig", title: "化石研究体験", text: "化石発掘やクリーニングなど本格的な体験ができます（小学生以上）。" },
      { icon: "calendar", title: "野外恐竜博物館", text: "春〜秋は実際の発掘現場をバスで巡るツアーを開催（2027年は4月頃再開予定）。" },
    ],
    fees: { adult: 1000, student: 800, child: 500, preschool: 0 },
    feeNotes: ["70歳以上 500円", "障害者手帳をお持ちの方と介護者1名は減免", "年間パスポート：一般 3,000円 / 高大生 2,400円 / 小中学生 1,500円"],
    specialExhibit: {
      label: "特別展（2026年度の料金を参考表示）",
      fees: { adult: 1800, student: 1600, child: 1000, preschool: 0 },
      note: "2026年度特別展「竜脚類」（7/10〜11/3）の料金。次回の料金は公式発表を確認してください。",
    },
    dig: {
      available: true,
      name: "化石研究体験（化石発掘プラス ほか）",
      price: { adult: 1200, child: 600 },
      note: "常設展観覧料とは別。小学生以上が対象（高大生 1,000円）。約120分。野外恐竜博物館（一般 1,300円 / 小中 650円）は2027年4月頃再開予定。",
    },
    restaurant: {
      inHouse: true,
      name: "館内レストラン",
      note: "10:00〜17:00（LO 16:30）。席の予約は不可。",
      menu: [
        { id: "fk-1", name: "スピノサウルスカレー", price: 1600 },
        { id: "fk-2", name: "肉食ティラノバーガー", price: 1700 },
        { id: "fk-3", name: "福井名物ソースカツ丼", price: 1350 },
        { id: "fk-4", name: "福井名物おろし蕎麦", price: 900 },
        { id: "fk-5", name: "ステゴサウルスキッズハンバーグプレート", price: 1300 },
        { id: "fk-6", name: "季節のティラノパフェ", price: 800 },
      ],
    },
    souvenirs: [
      { id: "fk-s1", name: "恐竜ぬいぐるみ", price: 2500, estimate: true },
      { id: "fk-s2", name: "展示解説書・図録", price: 1500, estimate: true },
      { id: "fk-s3", name: "恐竜のお菓子（箱）", price: 1000, estimate: true },
      { id: "fk-s4", name: "化石レプリカ・標本", price: 1000, estimate: true },
    ],
    search: { stay: "勝山 恐竜博物館", rentacarFrom: "福井駅", lunch: "勝山市 ランチ", ticket: "福井県立恐竜博物館" },
    geo: { lat: 36.081306, lng: 136.50621 },
    discounts: [
      { label: "年間パスポート", detail: "一般 3,000円 / 高大生 2,400円 / 小中学生 1,500円。年3回以上なら得" },
      { label: "70歳以上", detail: "常設展 500円" },
      { label: "団体（30名以上）", detail: "一般 800円 / 高大生 640円 / 小中学生 400円" },
      { label: "障害者手帳", detail: "本人と介護者1名が免除（ミライロID可）" },
    ],
    sources: [
      { label: "観覧料・開館時間", url: "https://www.dinosaur.pref.fukui.jp/guide/fee.html" },
      { label: "アクセス", url: "https://www.dinosaur.pref.fukui.jp/guide/access.html" },
      { label: "化石研究体験", url: "https://www.dinosaur.pref.fukui.jp/event/fossil.html" },
      { label: "館内レストラン", url: "https://fpdmrest.jp/" },
    ],
    lastVerified: "2026-11",
  },
  {
    id: "kahaku",
    name: "国立科学博物館",
    shortName: "科博",
    prefecture: "東京都",
    area: "kanto",
    address: "東京都台東区上野公園7-20",
    access: {
      station: "JR 上野駅 公園口から徒歩5分",
      ic: "首都高速 上野出口から約5分（専用駐車場なし）",
      note: "東京メトロ上野駅・京成上野駅からは徒歩10分。",
    },
    hours: "9:00〜17:00（入館は16:30まで）",
    closed: "月曜日（日・月曜が祝日・休日の場合は火曜日）、12月28日〜1月1日",
    officialUrl: "https://www.kahaku.go.jp/",
    ratings: { exhibit: 5, dig: 1, food: 4, family: 5 },
    review: {
      headline: "都心アクセス最強。高校生以下は常設展が無料",
      body:
        "地球館地下1階の恐竜展示が見どころ。恐竜以外の展示も膨大なので、目的を決めて回るのがおすすめです。小・中・高校生は常設展が無料なので、家族の入館料を大きく抑えられます。館内にはレストラン「ムーセイオン」とカフェ「くじらカフェ」があります。",
      tips: [
        "電子チケットの事前購入が可能。窓口に並ばずに入館できる",
        "地球館地下3階は2026年9月8日から展示改修のため閉鎖中（恐竜展示は地下1階）",
        "レストランは10:30〜17:00。昼どきを外すと入りやすい",
      ],
      reservationLevel: 2,
      reservationNote: "常設展は予約不要。特別展は展覧会ごとに条件が異なる。",
      recommendedStay: "2〜4時間",
    },
    highlights: [
      { icon: "skeleton", title: "地球館地下1階の恐竜展示", text: "国立の博物館ならではの充実した恐竜展示。恐竜以外の展示も膨大です。" },
      { icon: "free", title: "高校生以下は常設展無料", text: "小・中・高校生と65歳以上は無料。家族の入館料を抑えられます。" },
      { icon: "food", title: "恐竜メニューのレストラン", text: "「ダイナソープレート」など展示にちなんだメニューがそろいます。" },
    ],
    fees: { adult: 630, student: 630, child: 0, preschool: 0 },
    feeNotes: [
      "一般・大学生 630円。小・中・高校生と65歳以上は無料（年齢がわかる証明書が必要）",
      "シミュレーターの「高大生」欄は大学生料金（630円）で計算しています。高校生は無料です",
    ],
    dig: {
      available: false,
      name: "化石発掘体験なし",
      price: null,
      note: "常設の発掘体験はありません。土日祝に研究者の解説（ディスカバリートーク）があります。",
    },
    restaurant: {
      inHouse: true,
      name: "レストラン「ムーセイオン」・くじらカフェ",
      note: "ムーセイオンは地球館中2階、10:30〜17:00（LOは閉店30分前）。価格は税込。",
      menu: [
        { id: "kh-1", name: "ダイナソープレート（骨付き鶏モモ肉カレー）", price: 1750 },
        { id: "kh-2", name: "キッズイタチプレート", price: 1400 },
        { id: "kh-3", name: "ピラミッドカレー", price: 1000 },
        { id: "kh-4", name: "恐竜ハヤシライス", price: 1000 },
        { id: "kh-5", name: "かはくホエールプリン", price: 650 },
        { id: "kh-6", name: "恐竜プレート（くじらカフェ）", price: 1200 },
      ],
    },
    souvenirs: [
      { id: "kh-s1", name: "フタバスズキリュウぬいぐるみ", price: 2500, estimate: true },
      { id: "kh-s2", name: "オリジナルTシャツ", price: 3000, estimate: true },
      { id: "kh-s3", name: "オリジナルクリアファイル", price: 400, estimate: true },
      { id: "kh-s4", name: "アートてぬぐい", price: 1200, estimate: true },
    ],
    search: { stay: "上野 ホテル", rentacarFrom: "上野駅", lunch: "上野 ランチ", ticket: "国立科学博物館" },
    geo: { lat: 35.716393, lng: 139.776062 },
    discounts: [
      { label: "18歳未満・65歳以上", detail: "常設展が無料（年齢がわかる証明書が必要）" },
      { label: "団体（有料20名以上）", detail: "一般・大学生 510円" },
      { label: "電子チケット", detail: "アソビュー！で事前購入可（窓口に並ばず入館）" },
    ],
    sources: [
      { label: "入館料・開館時間", url: "https://www.kahaku.go.jp/riyou/nyukan-annai/index.html" },
      { label: "アクセス", url: "https://www.kahaku.go.jp/riyou/access.html" },
      { label: "レストラン（メニューPDF）", url: "https://www.kahaku.go.jp/riyou/kannai-guide/restaurant.html" },
      { label: "ミュージアムショップ", url: "https://www.kahaku.go.jp/riyou/kannai-guide/shop.html" },
    ],
    lastVerified: "2026-11",
  },
  {
    id: "gunma",
    name: "群馬県立自然史博物館",
    shortName: "群馬",
    prefecture: "群馬県",
    area: "kanto",
    address: "群馬県富岡市上黒岩1674-1",
    access: {
      station: "上信電鉄 上州富岡駅からタクシー約10分",
      ic: "上信越自動車道 富岡IC・下仁田IC から国道254号経由で約7km",
      note: "無料駐車場あり（混雑時は臨時駐車場）。上州富岡駅・上州一ノ宮駅に無料レンタル自転車あり。",
    },
    hours: "9:30〜17:00（入館は16:30まで）",
    closed: "月曜日（祝日の場合は翌日）、年末年始",
    officialUrl: "https://www.gmnh.pref.gunma.jp/",
    ratings: { exhibit: 4, dig: 2, food: 1, family: 4 },
    review: {
      headline: "中学生以下は無料。企画展の時期は料金が変わる",
      body:
        "恐竜の全身骨格を中心にした「地球の時代」展示が見どころ。中学生以下は無料なので、子ども連れの総額を抑えやすい施設です。2026年は開館30周年記念企画展「北米ジュラ紀の恐竜たち」を開催しています（後期は12月6日まで）。",
      tips: [
        "企画展開催中は一般1,300円、開催していない時期は510円。行く日の料金を確認しておく",
        "レストランはなし。飲食は中庭と自動販売機コーナーで可能なので、お弁当持参が便利",
        "土曜日に「化石ミニ発掘体験」が開催されることがある（無料・申込順）",
        "世界遺産・富岡製糸場とあわせて1日コースにしやすい",
      ],
      reservationLevel: 1,
      reservationNote: "入館は予約不要。体験イベントはWeb申込。",
      recommendedStay: "2〜3時間",
    },
    highlights: [
      { icon: "skeleton", title: "「地球の時代」の恐竜展示", text: "恐竜の全身骨格を中心に、地球の歴史をたどる展示が見どころです。" },
      { icon: "free", title: "中学生以下は無料", text: "いつ行っても中学生以下は無料。子連れの総額を抑えやすい施設です。" },
      { icon: "calendar", title: "充実の企画展", text: "2026年は開館30周年記念「北米ジュラ紀の恐竜たち」を開催（12/6まで）。" },
    ],
    fees: { adult: 510, student: 300, child: 0, preschool: 0 },
    feeNotes: ["中学生以下は無料", "障害者手帳をお持ちの方と介助者1名は無料", "平日は「ぐーちょきシニアパスポート」提示で2割引"],
    specialExhibit: {
      label: "企画展開催中",
      fees: { adult: 1300, student: 600, child: 0, preschool: 0 },
      note: "2026年は「北米ジュラ紀の恐竜たち」後期展示（9/19〜12/6）。",
    },
    dig: {
      available: true,
      name: "化石ミニ発掘体験（サイエンス・サタデー）",
      price: { adult: 0, child: 0 },
      note: "参加無料（観覧券が必要）。開催日限定・小学生以上・各日12組程度で申込順。",
    },
    restaurant: {
      inHouse: false,
      name: "中庭・自動販売機コーナー",
      note: "館内にレストランはありません。中庭と自動販売機コーナーで飲食できます。",
      menu: [],
    },
    souvenirs: [
      { id: "gm-s1", name: "恐竜ぬいぐるみ", price: 2000, estimate: true },
      { id: "gm-s2", name: "恐竜フィギュア", price: 1000, estimate: true },
      { id: "gm-s3", name: "化石標本（小）", price: 500, estimate: true },
    ],
    search: { stay: "富岡市 ホテル", rentacarFrom: "高崎駅", lunch: "富岡市 ランチ", ticket: "群馬県立自然史博物館" },
    geo: { lat: 36.275826, lng: 138.870544 },
    discounts: [
      { label: "中学生以下", detail: "常に無料" },
      { label: "ぐーちょきシニアパスポート", detail: "平日に提示で2割引（団体割引と併用不可）" },
      { label: "団体（有料20名以上）", detail: "企画展中 一般 1,040円 / 通常 410円" },
      { label: "障害者手帳等", detail: "本人と介助者1名が無料" },
    ],
    sources: [
      { label: "利用案内・観覧料", url: "https://www.gmnh.pref.gunma.jp/guide/" },
      { label: "アクセス", url: "https://www.gmnh.pref.gunma.jp/access/" },
      { label: "化石ミニ発掘体験", url: "https://www.gmnh.pref.gunma.jp/event/id15055/" },
    ],
    lastVerified: "2026-11",
  },
  {
    id: "mukawa",
    name: "むかわ町穂別恐竜博物館",
    shortName: "むかわ",
    prefecture: "北海道",
    area: "hokkaido-tohoku",
    address: "北海道勇払郡むかわ町穂別80-6",
    access: {
      station: "道南バス「穂別中央」から徒歩約10分（JR鵡川駅からバス、千歳駅・南千歳駅から予約制バスあり）",
      ic: "道東自動車道 むかわ穂別IC から約20分",
      note: "札幌から約2時間、苫小牧から約1時間半。混雑時は臨時駐車場あり。",
    },
    hours: "9:30〜17:00（入館は16:30まで）",
    closed: "月曜日、祝日の翌日（月曜が祝日の場合は火・水曜）、年末年始",
    officialUrl: "https://www.town.mukawa.lg.jp/1908.htm",
    ratings: { exhibit: 4, dig: 1, food: 1, family: 2 },
    review: {
      headline: "「むかわ竜」の町に2026年4月リニューアルオープン",
      body:
        "日本最大級の恐竜全身骨格「むかわ竜（カムイサウルス）」が見つかった町の博物館。2026年4月25日に「恐竜館」と「海洋化石館」の2館体制でリニューアルし、観覧券1枚で両方を見学できます。11月には来館者10万人を達成しました。",
      tips: [
        "館内に飲食施設はないので、苫小牧・千歳方面で食事を済ませてから向かうと安心",
        "千歳駅・南千歳駅からのバスは前々日までの予約が必要",
        "冬は路面凍結に注意。レンタカーはスタッドレス対応を",
        "2026年11月28日・29日に10万人達成記念イベント（記念品配布・バックヤードツアー）",
      ],
      reservationLevel: 1,
      reservationNote: "個人の入館は予約不要。",
      recommendedStay: "1.5〜2時間",
    },
    highlights: [
      { icon: "skeleton", title: "むかわ竜の町", text: "日本最大級の恐竜全身骨格「むかわ竜（カムイサウルス）」の発見地です。" },
      { icon: "view", title: "恐竜館と海洋化石館", text: "観覧券1枚で2つの館を見学できます。" },
      { icon: "calendar", title: "2026年4月リニューアル", text: "リニューアル後、半年余りで来館者10万人を達成しました。" },
    ],
    fees: { adult: 600, student: 600, child: 300, preschool: 0 },
    feeNotes: ["一般は高校生以上（高大生も一般料金）", "小学生未満は無料", "年間券：一般 1,500円 / 小中学生 800円", "障害者手帳をお持ちの方と付き添い1名は無料"],
    dig: {
      available: false,
      name: "発掘体験の案内なし",
      price: null,
      note: "公式サイトに常設の発掘体験の記載はありません。",
    },
    restaurant: {
      inHouse: false,
      name: "館内飲食施設なし",
      note: "公式サイトに館内飲食施設の記載はありません。周辺で食事予算を見込んでください。",
      menu: [],
    },
    souvenirs: [
      { id: "mk-s1", name: "むかわ竜グッズ", price: 1500, estimate: true },
      { id: "mk-s2", name: "恐竜ステッカー・小物", price: 500, estimate: true },
    ],
    search: { stay: "苫小牧 ホテル", rentacarFrom: "新千歳空港", lunch: "むかわ町 ランチ", ticket: "むかわ町穂別恐竜博物館" },
    geo: { lat: 42.790371, lng: 142.129654 },
    discounts: [
      { label: "年間券", detail: "一般 1,500円 / 小中学生 800円" },
      { label: "むかわ町民", detail: "開館記念日週間・国際博物館の日などは無料" },
      { label: "障害者手帳等", detail: "本人と付き添い1名が無料" },
    ],
    sources: [
      { label: "アクセス・利用案内", url: "https://www.town.mukawa.lg.jp/4356.htm" },
      { label: "開館・休館日", url: "https://www.town.mukawa.lg.jp/2402.htm" },
      { label: "リニューアル特設ページ", url: "https://www.town.mukawa.lg.jp/5683.htm" },
    ],
    lastVerified: "2026-11",
  },
  {
    id: "mifune",
    name: "御船町恐竜博物館",
    shortName: "御船",
    prefecture: "熊本県",
    area: "kyushu",
    address: "熊本県上益城郡御船町御船995-6",
    access: {
      station: "熊本桜町バスターミナルから御船方面行きバスで約50分、「御船町恐竜博物館前」下車すぐ",
      ic: "九州自動車道 御船IC から約10分",
      note: "阿蘇くまもと空港からバス約50分。博物館来館者は「赤色の駐車場」を利用。",
    },
    hours: "9:00〜17:00（入館は16:30まで）",
    closed: "月曜日（祝日の場合は翌日）、年末年始。GW・夏休みなどは月曜も開館する場合あり",
    officialUrl: "https://mifunemuseum.jp/",
    ratings: { exhibit: 4, dig: 2, food: 1, family: 4 },
    review: {
      headline: "研究機関の顔も持つ博物館。工作系の体験プログラムが豊富",
      body:
        "御船層群の化石研究の拠点で、ティラノサウルスの全身骨格などを展示しています。化石のレプリカづくりや恐竜缶バッジづくりなど、地学に関係する体験プログラムが14種類あります（材料費100〜300円）。ミュージアムショップは隣の御船町観光交流センター内にあります。",
      tips: [
        "体験プログラムは観覧料＋材料費。開催日は公式サイトの「わくわく体験教室」で確認",
        "館内には食事ができる場所がない。隣の観光交流センターに飲食可能なスペースあり",
        "2026年は熊本地震の影響で臨時休館したが、8月21日に再開済み",
      ],
      reservationLevel: 2,
      reservationNote: "個人の入館は予約不要。体験教室は申込制の回あり。",
      recommendedStay: "1.5〜2時間",
    },
    highlights: [
      { icon: "lab", title: "化石研究の拠点", text: "御船層群の化石研究を行う研究機関としての顔も持つ博物館です。" },
      { icon: "dig", title: "14種類の体験プログラム", text: "化石のレプリカづくりなど、材料費100〜300円で体験できます。" },
      { icon: "skeleton", title: "ティラノサウルスの全身骨格", text: "迫力ある全身骨格を間近で見られます。" },
    ],
    fees: { adult: 500, student: 300, child: 200, preschool: 0 },
    feeNotes: ["小学生未満は無料（保護者同伴）", "定期観覧券（1年間）：大人 900円 / 高大生 500円 / 小中学生 300円", "障害者手帳をお持ちの方は無料"],
    dig: {
      available: false,
      name: "体験プログラム（工作系）",
      price: null,
      note: "化石発掘体験の常設はなし。化石レプリカづくり等の体験は観覧料＋材料費100〜300円。",
    },
    restaurant: {
      inHouse: false,
      name: "隣接の観光交流センター",
      note: "博物館内に食事ができる場所はありません。隣の観光交流センターに飲食可能なスペースがあります。",
      menu: [],
    },
    souvenirs: [
      { id: "mf-s1", name: "展示解説書", price: 1000, estimate: true },
      { id: "mf-s2", name: "御船層群バンダナ", price: 1000, estimate: true },
      { id: "mf-s3", name: "ピンバッジ", price: 500, estimate: true },
      { id: "mf-s4", name: "オリジナルポストカード", price: 200, estimate: true },
    ],
    search: { stay: "熊本市 ホテル", rentacarFrom: "熊本空港", lunch: "御船町 ランチ", ticket: "御船町恐竜博物館" },
    geo: { lat: 32.714283, lng: 130.801804 },
    discounts: [
      { label: "定期観覧券（1年間）", detail: "大人 900円 / 高大生 500円 / 小中学生 300円。2回で元が取れる" },
      { label: "団体（20名以上）", detail: "大人 450円 / 高大生 250円 / 小中学生 150円" },
      { label: "障害者手帳等", detail: "常設展が無料" },
    ],
    sources: [
      { label: "入館とアクセス", url: "https://mifunemuseum.jp/visit-top/general-info/" },
      { label: "よくある質問", url: "https://mifunemuseum.jp/visit-top/faq/" },
      { label: "体験プログラム", url: "https://mifunemuseum.jp/education-top/educational-info/taken/" },
      { label: "ミュージアムショップ", url: "https://mifunemuseum.jp/visit-top/shop/" },
    ],
    lastVerified: "2026-11",
  },
  {
    id: "nagasaki",
    name: "長崎市恐竜博物館（ベネックス恐竜博物館）",
    shortName: "長崎",
    prefecture: "長崎県",
    area: "kyushu",
    address: "長崎県長崎市野母町568-1（長崎のもざき恐竜パーク内）",
    access: {
      station: "長崎駅前南口バス停から「樺島」行きで「恐竜パーク前」下車、徒歩1分（時間帯により乗継ぎあり）",
      ic: "長崎南環状線 新戸町IC から約15分",
      note: "無料駐車場：一般車212台・大型バス5台。",
    },
    hours: "9:00〜17:00",
    closed: "毎週月曜日（祝日を除く）",
    officialUrl: "https://nd-museum.jp/",
    ratings: { exhibit: 4, dig: 2, food: 1, family: 4 },
    review: {
      headline: "海を望む恐竜パークの中の博物館。研究室も見学できる",
      body:
        "2021年開館の比較的新しい博物館で、世界最大級のティラノサウルス全身骨格レプリカや、長崎で見つかった実物化石を展示しています。X線CTを備えた研究室（オープンラボ）の様子も見学できます。館内は飲食禁止です。",
      tips: [
        "長崎駅からはバスで移動。平日10〜14時・土日祝10〜15時は乗継ぎが必要",
        "館内は飲食・持ち込みとも原則不可。食事は外で計画を",
        "軍艦島資料館とのセット券（一般 750円 / 小中高生 400円）がある",
      ],
      reservationLevel: 1,
      reservationNote: "個人の入館は予約不要（団体15名以上は事前予約）。",
      recommendedStay: "1.5〜2時間",
    },
    highlights: [
      { icon: "skeleton", title: "世界最大級のティラノサウルス", text: "全長約13mのティラノサウルス全身骨格レプリカを展示しています。" },
      { icon: "lab", title: "オープンラボ", text: "X線CTを備えた研究室で、化石研究の様子を見学できます。" },
      { icon: "view", title: "海を望む恐竜パーク", text: "長崎のもざき恐竜パークの中にあり、軍艦島も望めるロケーションです。" },
    ],
    fees: { adult: 500, student: 250, child: 250, preschool: 0 },
    feeNotes: [
      "小中高生 250円。大学生は一般料金（500円）です",
      "シミュレーターの「高大生」欄は高校生料金で計算しています",
      "年間パスポート：一般 1,250円 / 小中高生 630円",
    ],
    dig: {
      available: false,
      name: "ワークショップ（開催日限定）",
      price: null,
      note: "常設の発掘体験はなし。ワークショップの内容・料金は公式サイトで確認してください。",
    },
    restaurant: {
      inHouse: false,
      name: "館内飲食不可",
      note: "館内での飲食・持ち込みは原則不可です。",
      menu: [],
    },
    souvenirs: [
      { id: "ng-s1", name: "恐竜ぬいぐるみ", price: 2000, estimate: true },
      { id: "ng-s2", name: "恐竜のお菓子", price: 1000, estimate: true },
      { id: "ng-s3", name: "恐竜グッズ（小物）", price: 500, estimate: true },
    ],
    search: { stay: "長崎市 ホテル", rentacarFrom: "長崎駅", lunch: "野母崎 ランチ", ticket: "長崎市恐竜博物館" },
    geo: { lat: 32.582142, lng: 129.744904 },
    discounts: [
      { label: "年間パスポート", detail: "一般 1,250円 / 小中高生 630円" },
      { label: "軍艦島資料館セット券", detail: "一般 750円 / 小中高生 400円" },
      { label: "団体（15名以上）", detail: "一般 400円 / 小中高生 210円" },
      { label: "長崎市内在住の障害者手帳等", detail: "常設展が無料" },
    ],
    sources: [
      { label: "ご利用案内・観覧料", url: "https://nd-museum.jp/guide" },
      { label: "アクセス", url: "https://nd-museum.jp/access" },
    ],
    lastVerified: "2026-11",
  },
  {
    id: "kanna",
    name: "神流町恐竜センター",
    shortName: "神流",
    prefecture: "群馬県",
    area: "kanto",
    address: "群馬県多野郡神流町神ヶ原51-2",
    access: {
      station: "JR群馬藤岡駅・新町駅から日本中央バス奥多野線で「恐竜センター」下車、徒歩2分",
      ic: "藤岡方面・下仁田方面からの経路案内あり（公式サイト）",
      note: "山間部のため車が便利。冬季は道路状況に注意。",
    },
    hours: "9:00〜16:30（入館は16:00まで）",
    closed: "月曜日（祝日・振替休日の場合は翌日）。12月〜3月は木曜日も休館。夏休み期間は無休",
    officialUrl: "https://dino-nakasato.org/",
    ratings: { exhibit: 3, dig: 5, food: 1, family: 2 },
    review: {
      headline: "ハンマーで化石を探す本格的な発掘体験ができる",
      body:
        "モンゴルの恐竜化石展示や、屋外のティラノサウルス産状骨格（12m）が見どころ。センター横で行う「化石さがし体験」は、ハンマーで岩を割って化石を探す本格派です。屋外テントがあり雨天でも開催されます。",
      tips: [
        "化石さがし体験はWeb予約制（電話予約不可）。当日枠は各回5名程度",
        "冬季（12/26・27）も発掘体験あり。予約は11月25日12時頃から",
        "館内に飲食施設の案内はなし。キッチンカーが出店する日がある",
      ],
      reservationLevel: 3,
      reservationNote: "化石さがし体験は事前のWeb予約が基本。",
      recommendedStay: "2〜3時間（発掘体験含む）",
    },
    highlights: [
      { icon: "dig", title: "本格的な化石さがし体験", text: "ハンマーで岩を割って化石を探す体験。屋外テントで雨天も開催されます。" },
      { icon: "skeleton", title: "ティラノサウルス産状骨格", text: "野外に全長12mのティラノサウルス産状骨格を展示しています。" },
      { icon: "view", title: "モンゴルの恐竜化石", text: "モンゴルで発掘された恐竜化石の展示が見どころです。" },
    ],
    fees: { adult: 800, student: 800, child: 500, preschool: 0 },
    feeNotes: [
      "公式の区分は大人 800円 / 子供（小中学生）500円。高大生は大人料金で計算しています",
      "未就学児の料金は公式に記載がないため0円で計算しています",
      "障害者手帳・療育手帳の提示で本人と介護者1名は半額",
    ],
    dig: {
      available: true,
      name: "化石さがし体験",
      price: { adult: 500, child: 500 },
      note: "1人500円（冬季開催分の料金）。開催日限定・Web予約制。",
    },
    restaurant: {
      inHouse: false,
      name: "館内飲食施設なし",
      note: "公式サイトに飲食施設の記載はありません。キッチンカー出店日あり。",
      menu: [],
    },
    souvenirs: [
      { id: "kn-s1", name: "恐竜ぬいぐるみ", price: 1500, estimate: true },
      { id: "kn-s2", name: "化石標本（小）", price: 500, estimate: true },
      { id: "kn-s3", name: "恐竜グッズ（小物）", price: 500, estimate: true },
    ],
    search: { stay: "神流町 宿", rentacarFrom: "高崎駅", lunch: "神流町 ランチ", ticket: "神流町恐竜センター" },
    geo: { lat: 36.080009, lng: 138.840103 },
    discounts: [
      { label: "年間パスポート", detail: "販売あり（総合案内で案内）" },
      { label: "団体（20名以上）", detail: "大人 750円 / 子供 450円" },
      { label: "障害者手帳・療育手帳", detail: "本人と介護者1名が半額" },
    ],
    sources: [
      { label: "施設案内・入館料", url: "https://dino-nakasato.org/facilities/" },
      { label: "アクセス", url: "https://dino-nakasato.org/access/" },
      { label: "化石さがし体験", url: "https://dino-nakasato.org/2022_fossil-excavation/" },
    ],
    lastVerified: "2026-11",
  },
  {
    id: "tamba",
    name: "丹波市立たんば恐竜博物館",
    shortName: "丹波",
    prefecture: "兵庫県",
    area: "kansai",
    address: "兵庫県丹波市山南町谷川1110（丹波市役所山南支所横）",
    access: {
      station: "JR福知山線 久下村駅から徒歩約10分。谷川駅から路線バス・タクシー約5分",
      ic: "舞鶴若狭自動車道 春日IC、北近畿豊岡自動車道 氷上IC から約30分",
      note: "旧「丹波竜化石工房 ちーたんの館」がリニューアルした施設です。",
    },
    hours: "10:00〜17:00（11月〜3月は16:00まで）。入館は閉館30分前まで",
    closed: "月曜日（祝日の場合は翌平日）、12月29日〜1月3日",
    officialUrl: "https://www.tambaryu.com/",
    ratings: { exhibit: 4, dig: 4, food: 1, family: 3 },
    review: {
      headline: "旧ちーたんの館がリニューアル。丹波竜を中心に約300点を展示",
      body:
        "丹波竜（タンバティタニス）の発見地にある博物館。5つのゾーンで約300点の標本を展示しています。2026年10月10日〜2027年2月23日は特別展「大恐竜展」を開催中で、この期間は入館料が特別料金です。近くの化石発見地では「元気村かみくげ」の化石発掘体験もあります（土日祝のみ）。",
      tips: [
        "「大恐竜展」期間中（〜2027/2/23）は大人1,500円。期間外の料金は公式サイトで確認",
        "兵庫県内の小中学生は「ココロンカード」提示で入館無料",
        "化石発掘体験は元気村かみくげ（地元運営）。料金・予約は元気村かみくげへ問い合わせ",
      ],
      reservationLevel: 2,
      reservationNote: "個人の入館は予約不要。発掘体験は運営元へ確認。",
      recommendedStay: "1.5〜2時間（発掘体験は別途）",
    },
    highlights: [
      { icon: "skeleton", title: "丹波竜の発見地", text: "丹波竜（タンバティタニス）が見つかった地にある博物館です。" },
      { icon: "view", title: "5ゾーン・約300点の展示", text: "丹波の地層から脊椎動物の進化まで、楽しみながら学べます。" },
      { icon: "calendar", title: "特別展「大恐竜展」", text: "世界初公開の頭突き恐竜の実物化石などを展示（2027/2/23まで）。" },
    ],
    fees: { adult: 1500, student: 1500, child: 500, preschool: 0 },
    feeNotes: [
      "「大恐竜展」期間中（2026/10/10〜2027/2/23）の料金：大人（高校生以上）1,500円 / 小中学生 500円",
      "未就学児の料金は公式に記載がないため0円で計算しています",
      "兵庫県内の小中学生はココロンカード提示で無料",
    ],
    dig: {
      available: true,
      name: "元気村かみくげ 化石発掘体験道場",
      price: null,
      note: "土日祝のみ。地元地域の運営で、料金・予約は元気村かみくげへ問い合わせ。",
    },
    restaurant: {
      inHouse: false,
      name: "館内飲食施設の案内なし",
      note: "公式サイトに飲食施設の記載はありません。",
      menu: [],
    },
    souvenirs: [
      { id: "tb-s1", name: "丹波竜グッズ", price: 1500, estimate: true },
      { id: "tb-s2", name: "恐竜のお菓子", price: 800, estimate: true },
      { id: "tb-s3", name: "恐竜グッズ（小物）", price: 500, estimate: true },
    ],
    search: { stay: "丹波市 宿", rentacarFrom: "新大阪駅", lunch: "丹波市 山南町 ランチ", ticket: "たんば恐竜博物館" },
    geo: { lat: 35.074215, lng: 135.035065 },
    discounts: [
      { label: "ココロンカード", detail: "兵庫県内の小中学生は提示で無料" },
      { label: "団体（有料20名以上）", detail: "大恐竜展期間中 大人 1,300円 / 小中学生 400円" },
      { label: "障害のある方と介助者1名", detail: "大人 800円 / 小中学生 300円" },
    ],
    sources: [
      { label: "施設利用案内", url: "https://www.tambaryu.com/annai/annai.html" },
      { label: "アクセス", url: "https://www.tambaryu.com/access/index.html" },
    ],
    lastVerified: "2026-11",
  },
];

export function getMuseum(id: string): Museum | undefined {
  return MUSEUMS.find((m) => m.id === id);
}

export function areaLabel(key: AreaKey): string {
  return AREAS.find((a) => a.key === key)?.label ?? key;
}
