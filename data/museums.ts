/**
 * 恐竜博物館データベース
 * ------------------------------------------------------------
 * 施設を追加する場合は、MUSEUMS 配列に Museum 型のオブジェクトを1件追加するだけで
 * 一覧・詳細ページ・シミュレーター・絞り込みすべてに自動反映されます。
 *
 * 【重要】料金・メニュー・営業時間は改定されることがあります。
 * 掲載前・定期的に各施設の公式サイトで確認し、lastVerified を更新してください。
 * メニュー・お土産は「現地価格の目安」として設定したサンプル値を含みます。
 * 実際に訪問・確認した値に差し替えて運用してください。
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

export interface PriceItem {
  id: string;
  name: string;
  /** 税込価格（円） */
  price: number;
  note?: string;
}

export interface FeeTable {
  adult: number;
  student: number; // 高校生・大学生
  child: number; // 小・中学生
  preschool: number; // 未就学児
}

export interface Museum {
  id: string; // URLスラッグ
  name: string;
  shortName: string;
  prefecture: string;
  area: AreaKey;
  address: string;
  access: {
    station: string;
    ic: string;
    note?: string;
  };
  hours: string;
  closed: string;
  officialUrl: string;
  /** 独自5段階評価 */
  ratings: {
    exhibit: Rating; // 展示の迫力
    dig: Rating; // 発掘体験の充実度
    food: Rating; // 館内グルメ満足度
    family: Rating; // 子連れ・アクセス快適度
  };
  review: {
    headline: string;
    body: string;
    tips: string[]; // 攻略メモ（混雑回避のコツなど）
    reservationLevel: Rating; // 予約の難易度（5が最難）
    reservationNote: string;
    recommendedStay: string; // 滞在時間の目安
  };
  fees: FeeTable;
  feeNotes: string[];
  specialExhibit?: {
    label: string;
    fees: FeeTable;
    note: string;
  };
  dig: {
    available: boolean;
    name: string;
    price: number; // 1人あたり（円）
    note: string;
  };
  restaurant: {
    inHouse: boolean;
    name: string;
    note: string;
    menu: PriceItem[];
  };
  souvenirs: PriceItem[];
  /** 手配サポートリンク用の検索キーワード */
  search: {
    stay: string;
    rentacarFrom: string;
    lunch: string;
    ticket: string;
  };
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
      station: "えちぜん鉄道 勝山駅からバス・タクシー約10〜15分",
      ic: "中部縦貫自動車道 勝山IC から約10分",
      note: "福井駅から勝山駅までえちぜん鉄道で約55分。週末は直行バスの運行あり（時期により異なる）。",
    },
    hours: "9:00〜17:00（最終入館 16:30）",
    closed: "第2・第4水曜日（祝日の場合は翌日）、年末年始。夏休み期間は無休",
    officialUrl: "https://www.dinosaur.pref.fukui.jp/",
    ratings: { exhibit: 5, dig: 5, food: 4, family: 4 },
    review: {
      headline: "国内最大級の恐竜展示。日時指定予約がほぼ必須",
      body:
        "ドーム型の展示室に全身骨格が並ぶ光景は国内随一。動くティラノサウルスのロボットは小さな子には迫力がありすぎるほど。2023年の増築で化石研究体験や特別展示室が拡充され、1日いても見終わらない密度です。",
      tips: [
        "土日祝・夏休みはオンラインの日時指定券で開館直後の枠を確保するのが最も快適",
        "レストランは11時台前半か13時半以降が狙い目。正午前後は30分以上待つことがある",
        "野外恐竜博物館（発掘体験）は別予約。博物館の入館予約とは別に枠を押さえる",
        "勝山ICからの道は連休に渋滞しやすい。到着は開館30分前を目安に",
      ],
      reservationLevel: 4,
      reservationNote:
        "繁忙期は日時指定券の事前予約を推奨。野外恐竜博物館・化石発掘体験は早い時期に枠が埋まる傾向。",
      recommendedStay: "3〜5時間",
    },
    fees: { adult: 1000, student: 800, child: 500, preschool: 0 },
    feeNotes: ["70歳以上は割引あり", "障がい者手帳提示で本人と介護者1名が無料"],
    specialExhibit: {
      label: "特別展（例年夏開催）",
      fees: { adult: 1800, student: 1300, child: 800, preschool: 0 },
      note: "特別展開催中は常設展とのセット料金。金額は年度により異なるため目安です。",
    },
    dig: {
      available: true,
      name: "野外恐竜博物館（化石発掘体験含む）",
      price: 1000,
      note: "事前予約制・季節運行（概ね4〜11月）。小中学生は割引料金あり。目安として一般料金で計算。",
    },
    restaurant: {
      inHouse: true,
      name: "館内レストラン・カフェ",
      note: "恐竜モチーフのメニューが充実。混雑時は整理券対応となることも。",
      menu: [
        { id: "fk-1", name: "恐竜カレー（化石風ライス）", price: 1300 },
        { id: "fk-2", name: "ソースカツ丼（福井名物）", price: 1450 },
        { id: "fk-3", name: "越前おろしそば", price: 950 },
        { id: "fk-4", name: "お子さまプレート（恐竜型ハンバーグ）", price: 980 },
        { id: "fk-5", name: "恐竜のたまごソフトクリーム", price: 450 },
      ],
    },
    souvenirs: [
      { id: "fk-s1", name: "フクイラプトル オリジナルぬいぐるみ", price: 2200 },
      { id: "fk-s2", name: "常設展示図録・ガイドブック", price: 1500 },
      { id: "fk-s3", name: "恐竜たまごクッキー", price: 864 },
      { id: "fk-s4", name: "化石レプリカ（アンモナイト）", price: 1100 },
      { id: "fk-s5", name: "オリジナル Tシャツ（キッズ）", price: 2500 },
    ],
    search: {
      stay: "勝山 恐竜博物館",
      rentacarFrom: "福井駅",
      lunch: "勝山市 ランチ",
      ticket: "福井県立恐竜博物館",
    },
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
      station: "JR 上野駅 公園口から徒歩約5分",
      ic: "首都高速 上野出口から約5分（専用駐車場なし）",
      note: "周辺コインパーキングは土日に満車になりやすい。電車利用が無難。",
    },
    hours: "9:00〜17:00（入館は閉館30分前まで）",
    closed: "月曜日（祝日の場合は火曜日）、年末年始",
    officialUrl: "https://www.kahaku.go.jp/",
    ratings: { exhibit: 5, dig: 1, food: 3, family: 5 },
    review: {
      headline: "都心アクセス最強。地球館地下の恐竜展示は必見",
      body:
        "地球館地下1階の恐竜展示は、ティラノサウルスとトリケラトプスの対峙ポーズが見どころ。恐竜以外の展示も膨大なので、目的を決めて回らないと時間が足りなくなります。高校生以下は常設展無料なのが家族連れには大きい。",
      tips: [
        "特別展開催日は特別展側に人が集中。常設展だけなら開館直後が空いている",
        "地球館地下1階（恐竜）→3階（大型哺乳類）の順で回ると子どもが飽きにくい",
        "館内レストランは平日でも12時台は混雑。上野公園周辺の飲食店と使い分けを",
      ],
      reservationLevel: 2,
      reservationNote: "常設展は当日入館可能な日が多い。人気特別展は日時指定予約制となる場合あり。",
      recommendedStay: "2〜4時間",
    },
    fees: { adult: 630, student: 630, child: 0, preschool: 0 },
    feeNotes: [
      "常設展：一般・大学生 630円、高校生以下および65歳以上は無料",
      "シミュレーターの「高大生」欄は大学生料金で計算（高校生は0円）",
    ],
    specialExhibit: {
      label: "特別展（恐竜関連は数年ごとに開催）",
      fees: { adult: 2100, student: 2100, child: 600, preschool: 0 },
      note: "特別展は会期ごとに料金が異なります。常設展も観覧可能な場合が多い。",
    },
    dig: {
      available: false,
      name: "化石発掘体験なし",
      price: 0,
      note: "常設の発掘体験はなし。週末に学習プログラムが開催されることがある。",
    },
    restaurant: {
      inHouse: true,
      name: "館内レストラン",
      note: "展示にちなんだ限定メニューが登場することも。",
      menu: [
        { id: "kh-1", name: "恐竜ハンバーグプレート", price: 1500 },
        { id: "kh-2", name: "地層カレー", price: 1350 },
        { id: "kh-3", name: "お子さまランチ", price: 1000 },
        { id: "kh-4", name: "コーヒー・紅茶", price: 450 },
      ],
    },
    souvenirs: [
      { id: "kh-s1", name: "恐竜フィギュア（標本モデル）", price: 1650 },
      { id: "kh-s2", name: "常設展ガイドブック", price: 1200 },
      { id: "kh-s3", name: "骨格パズル（木製）", price: 1980 },
      { id: "kh-s4", name: "オリジナルトートバッグ", price: 1500 },
    ],
    search: {
      stay: "上野 ホテル",
      rentacarFrom: "上野駅",
      lunch: "上野 ランチ",
      ticket: "国立科学博物館",
    },
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
      ic: "上信越自動車道 富岡IC から約10分",
      note: "無料駐車場あり。公共交通は本数が少ないため車推奨。",
    },
    hours: "9:30〜17:00（入館は16:30まで）",
    closed: "月曜日（祝日の場合は翌日）、年末年始",
    officialUrl: "https://www.gmnh.pref.gunma.jp/",
    ratings: { exhibit: 4, dig: 1, food: 2, family: 4 },
    review: {
      headline: "動くティラノと実物大ジオラマ。中学生以下無料がうれしい",
      body:
        "「地球の時代」展示室のカマラサウルス全身骨格と、動くティラノサウルスのジオラマが看板。関東から日帰りしやすく、中学生以下無料なので家族の総額をかなり抑えられます。",
      tips: [
        "企画展期間中は観覧料が上がる。シミュレーターの特別展オプションで比較を",
        "館内に本格的なレストランはないため、昼食は富岡市街で済ませる計画が安心",
        "世界遺産・富岡製糸場とセットで1日コースにしやすい",
      ],
      reservationLevel: 1,
      reservationNote: "通常は予約不要。団体利用時のみ事前連絡。",
      recommendedStay: "2〜3時間",
    },
    fees: { adult: 520, student: 300, child: 0, preschool: 0 },
    feeNotes: ["中学生以下は無料", "企画展開催中は料金が変わります"],
    specialExhibit: {
      label: "企画展開催時",
      fees: { adult: 670, student: 400, child: 0, preschool: 0 },
      note: "企画展ごとに料金が異なる場合があります。",
    },
    dig: {
      available: false,
      name: "常設の発掘体験なし",
      price: 0,
      note: "季節のイベントで化石レプリカ作りなどが行われることがある。",
    },
    restaurant: {
      inHouse: false,
      name: "休憩コーナー・周辺飲食店",
      note: "館内は軽食・自販機程度。下記は周辺飲食店の価格目安です。",
      menu: [
        { id: "gm-1", name: "おっきりこみうどん（周辺店目安）", price: 1100 },
        { id: "gm-2", name: "ソースかつ丼（周辺店目安）", price: 1200 },
        { id: "gm-3", name: "ペットボトル飲料（自販機）", price: 160 },
      ],
    },
    souvenirs: [
      { id: "gm-s1", name: "恐竜ぬいぐるみ", price: 1800 },
      { id: "gm-s2", name: "展示解説書", price: 1000 },
      { id: "gm-s3", name: "化石レプリカ・標本", price: 800 },
      { id: "gm-s4", name: "恐竜消しゴムセット", price: 550 },
    ],
    search: {
      stay: "富岡市 ホテル",
      rentacarFrom: "高崎駅",
      lunch: "富岡市 ランチ",
      ticket: "群馬県立自然史博物館",
    },
    lastVerified: "2026-11",
  },
  {
    id: "mukawa",
    name: "むかわ町穂別博物館",
    shortName: "むかわ",
    prefecture: "北海道",
    area: "hokkaido-tohoku",
    address: "北海道勇払郡むかわ町穂別80-6",
    access: {
      station: "JR 鵡川駅から車で約40分（公共交通は本数わずか）",
      ic: "道東自動車道 むかわ穂別IC から約10分",
      note: "新千歳空港から車で約1時間15分。レンタカー移動が現実的。",
    },
    hours: "9:30〜17:00（入館は16:30まで）",
    closed: "月曜日（祝日の場合は翌日）、祝日の翌日、年末年始",
    officialUrl: "https://www.town.mukawa.lg.jp/1908.htm",
    ratings: { exhibit: 4, dig: 2, food: 1, family: 2 },
    review: {
      headline: "「むかわ竜（カムイサウルス）」の地元。小規模ながら密度が高い",
      body:
        "日本最大級の全身骨格が見つかった町の博物館。規模は大きくないものの、カムイサウルス関連の展示やモササウルス類・アンモナイトの標本が充実しています。道東道からのアクセスは良好。",
      tips: [
        "周辺に飲食店が少ないので、苫小牧・千歳方面で昼食をとってから向かうと安心",
        "冬季は路面凍結に注意。スタッドレス対応のレンタカーを",
        "町内のイベント時期（夏）は関連企画が増える",
      ],
      reservationLevel: 1,
      reservationNote: "通常予約不要。",
      recommendedStay: "1〜1.5時間",
    },
    fees: { adult: 300, student: 300, child: 100, preschool: 0 },
    feeNotes: ["料金は改定されることがあるため公式サイトで確認してください"],
    dig: {
      available: false,
      name: "常設の発掘体験なし",
      price: 0,
      note: "夏季に化石関連の体験イベントが開催される年あり。",
    },
    restaurant: {
      inHouse: false,
      name: "周辺飲食店・道の駅",
      note: "館内に飲食施設なし。下記は町内・周辺飲食店の価格目安です。",
      menu: [
        { id: "mk-1", name: "ししゃも定食（周辺店目安）", price: 1300 },
        { id: "mk-2", name: "醤油ラーメン（周辺店目安）", price: 900 },
        { id: "mk-3", name: "ソフトクリーム（周辺店目安）", price: 400 },
      ],
    },
    souvenirs: [
      { id: "mk-s1", name: "むかわ竜グッズ（ぬいぐるみ等）", price: 2000 },
      { id: "mk-s2", name: "博物館解説ブックレット", price: 800 },
      { id: "mk-s3", name: "恐竜ステッカー", price: 300 },
    ],
    search: {
      stay: "苫小牧 ホテル",
      rentacarFrom: "新千歳空港",
      lunch: "むかわ町 ランチ",
      ticket: "むかわ町 穂別博物館",
    },
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
      station: "熊本駅・熊本桜町バスターミナルからバス約40分",
      ic: "九州自動車道 御船IC から約5分",
      note: "阿蘇くまもと空港から車で約30分。",
    },
    hours: "9:00〜17:00",
    closed: "月曜日（祝日の場合は翌平日）、年末年始",
    officialUrl: "https://mifunemuseum.jp/",
    ratings: { exhibit: 4, dig: 3, food: 2, family: 4 },
    review: {
      headline: "研究機関としての顔も。ガラス越しに標本作業が見られる",
      body:
        "御船層群から産出した化石の研究拠点で、ガラス越しに化石クリーニング作業を見学できるのが特徴。ティラノサウルス全身骨格もあり、九州で恐竜展示を見るなら外せない施設です。",
      tips: [
        "化石採集体験は日程限定・事前申込制のことが多い。公式サイトの告知をこまめに確認",
        "御船ICから近く、熊本市内観光と組み合わせやすい",
        "館内飲食は限られるため、軽食を持参するか周辺店を利用",
      ],
      reservationLevel: 3,
      reservationNote: "体験イベントは申込制・先着順の回あり。",
      recommendedStay: "1.5〜2時間",
    },
    fees: { adult: 500, student: 300, child: 200, preschool: 0 },
    feeNotes: ["企画展は別料金となる場合あり"],
    dig: {
      available: true,
      name: "化石採集体験（イベント開催時）",
      price: 500,
      note: "開催日限定。料金・対象年齢は回によって異なるため目安です。",
    },
    restaurant: {
      inHouse: false,
      name: "休憩スペース・周辺飲食店",
      note: "館内に本格的なレストランはありません。下記は周辺の価格目安です。",
      menu: [
        { id: "mf-1", name: "熊本ラーメン（周辺店目安）", price: 850 },
        { id: "mf-2", name: "太平燕（タイピーエン／周辺店目安）", price: 950 },
        { id: "mf-3", name: "だご汁定食（周辺店目安）", price: 1000 },
      ],
    },
    souvenirs: [
      { id: "mf-s1", name: "ミフネリュウ オリジナルグッズ", price: 1500 },
      { id: "mf-s2", name: "常設展示図録", price: 1200 },
      { id: "mf-s3", name: "化石レプリカ", price: 700 },
    ],
    search: {
      stay: "熊本市 ホテル",
      rentacarFrom: "熊本空港",
      lunch: "御船町 ランチ",
      ticket: "御船町恐竜博物館",
    },
    lastVerified: "2026-11",
  },
  {
    id: "nagasaki",
    name: "長崎市恐竜博物館",
    shortName: "長崎",
    prefecture: "長崎県",
    area: "kyushu",
    address: "長崎県長崎市野母町568-1（長崎市恐竜パーク内）",
    access: {
      station: "JR 長崎駅前からバス約60〜70分",
      ic: "長崎自動車道 長崎芒塚IC から約40分",
      note: "海沿いの絶景ロケーション。軍艦島ツアーの発着エリアにも近い。",
    },
    hours: "9:00〜17:00（入館は16:30まで）",
    closed: "火曜日（祝日の場合は翌日）、年末年始",
    officialUrl: "https://www.city.nagasaki.lg.jp/site/dinosaur-museum/",
    ratings: { exhibit: 4, dig: 2, food: 3, family: 4 },
    review: {
      headline: "海を望む新しい博物館。屋外の恐竜パークで子どもは大はしゃぎ",
      body:
        "2021年開館の比較的新しい施設。ティラノサウルスとトリケラトプスの全身骨格に加え、屋外の恐竜パークでは遊具や大型模型を楽しめます。展示が明るく見やすいので未就学児連れにも向いています。",
      tips: [
        "長崎市中心部からバスで1時間超。帰りのバス時刻を先に確認しておく",
        "屋外パークは日差しを遮るものが少ない。夏は帽子・飲み物必須",
        "週末午後は混雑しやすいので、午前中の到着がおすすめ",
      ],
      reservationLevel: 1,
      reservationNote: "通常予約不要。",
      recommendedStay: "2〜3時間（屋外パーク含む）",
    },
    fees: { adult: 500, student: 300, child: 200, preschool: 0 },
    feeNotes: ["高校生料金は300円（大学生は一般料金の場合あり）", "屋外の恐竜パークは無料"],
    dig: {
      available: false,
      name: "常設の発掘体験なし",
      price: 0,
      note: "ワークショップ・体験イベントが不定期開催。",
    },
    restaurant: {
      inHouse: true,
      name: "館内カフェ（軽食）",
      note: "軽食・ドリンク中心。メニューは時期により変わります。",
      menu: [
        { id: "ng-1", name: "恐竜カレー", price: 900 },
        { id: "ng-2", name: "長崎ちゃんぽん（ミニ）", price: 850 },
        { id: "ng-3", name: "化石発掘パフェ", price: 750 },
        { id: "ng-4", name: "ソフトドリンク", price: 350 },
      ],
    },
    souvenirs: [
      { id: "ng-s1", name: "オリジナル恐竜ぬいぐるみ", price: 2000 },
      { id: "ng-s2", name: "展示ガイドブック", price: 1000 },
      { id: "ng-s3", name: "恐竜クッキー（長崎限定）", price: 980 },
      { id: "ng-s4", name: "恐竜マグネット", price: 500 },
    ],
    search: {
      stay: "長崎市 ホテル",
      rentacarFrom: "長崎駅",
      lunch: "野母崎 ランチ",
      ticket: "長崎市恐竜博物館",
    },
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
      station: "JR 新町駅からバス約2時間（乗継あり）",
      ic: "上信越自動車道 下仁田IC または 関越自動車道 本庄児玉IC から約60分",
      note: "山間部のため車が必須。カーブの多い道が続く。",
    },
    hours: "9:00〜17:00",
    closed: "月曜日（祝日の場合は翌日）、冬季は休館日が増える場合あり",
    officialUrl: "https://www.dino-nakasato.org/",
    ratings: { exhibit: 3, dig: 4, food: 1, family: 2 },
    review: {
      headline: "「恐竜の足跡」の町。化石発掘体験が手軽にできる",
      body:
        "国内で初めて恐竜の足跡化石が確認された「漣岩（さざなみいわ）」で知られる町の施設。モンゴルの恐竜化石展示に加え、館内で化石発掘体験（化石のクリーニング体験）ができるのが魅力。",
      tips: [
        "道中は山道。車酔いしやすい子は酔い止めを",
        "発掘体験は当日受付の回もあるが、連休は予約が安心",
        "周辺は飲食店が少ないので、昼食は事前に計画を",
      ],
      reservationLevel: 2,
      reservationNote: "化石発掘体験は繁忙期に予約推奨。",
      recommendedStay: "1.5〜2時間",
    },
    fees: { adult: 600, student: 600, child: 300, preschool: 0 },
    feeNotes: ["料金は改定されることがあるため公式サイトで確認してください"],
    dig: {
      available: true,
      name: "化石発掘体験",
      price: 500,
      note: "持ち帰りできる化石が見つかることも。料金は目安。",
    },
    restaurant: {
      inHouse: false,
      name: "周辺飲食店",
      note: "館内に飲食施設なし。下記は周辺の価格目安です。",
      menu: [
        { id: "kn-1", name: "手打ちそば（周辺店目安）", price: 1000 },
        { id: "kn-2", name: "こんにゃく田楽（周辺店目安）", price: 400 },
        { id: "kn-3", name: "ペットボトル飲料（自販機）", price: 160 },
      ],
    },
    souvenirs: [
      { id: "kn-s1", name: "恐竜の足跡グッズ", price: 800 },
      { id: "kn-s2", name: "恐竜ぬいぐるみ", price: 1600 },
      { id: "kn-s3", name: "化石標本（小）", price: 500 },
    ],
    search: {
      stay: "神流町 宿",
      rentacarFrom: "高崎駅",
      lunch: "神流町 ランチ",
      ticket: "神流町恐竜センター",
    },
    lastVerified: "2026-11",
  },
  {
    id: "tamba",
    name: "丹波竜化石工房 ちーたんの館",
    shortName: "丹波",
    prefecture: "兵庫県",
    area: "kansai",
    address: "兵庫県丹波市山南町谷川1110",
    access: {
      station: "JR 谷川駅から徒歩約15分",
      ic: "舞鶴若狭自動車道 丹南篠山口IC から約30分",
      note: "大阪から車で約1時間30分。",
    },
    hours: "10:00〜17:00",
    closed: "月曜日（祝日の場合は翌日）、年末年始",
    officialUrl: "https://www.tambaryu.jp/",
    ratings: { exhibit: 3, dig: 4, food: 1, family: 3 },
    review: {
      headline: "丹波竜発見の地。入館料が手頃で発掘体験もセットにしやすい",
      body:
        "丹波竜（タンバティタニス）の化石発掘地近くにある小さな施設。入館料が非常に安く、隣接エリアでの化石発掘体験と組み合わせても家族の負担が小さいのが魅力です。",
      tips: [
        "発掘体験は土日祝が中心。開催日を事前に確認",
        "化石発掘用に汚れてもよい服と軍手を持参",
        "丹波篠山の観光と組み合わせると満足度が上がる",
      ],
      reservationLevel: 2,
      reservationNote: "発掘体験は団体予約が入る日もあるため事前確認が安心。",
      recommendedStay: "1〜2時間（発掘体験含む）",
    },
    fees: { adult: 210, student: 210, child: 100, preschool: 0 },
    feeNotes: ["料金は改定されることがあるため公式サイトで確認してください"],
    dig: {
      available: true,
      name: "化石発掘体験（丹波竜の里）",
      price: 500,
      note: "開催日・料金は時期により異なる場合あり。目安。",
    },
    restaurant: {
      inHouse: false,
      name: "周辺飲食店",
      note: "館内に飲食施設なし。下記は丹波エリア飲食店の価格目安です。",
      menu: [
        { id: "tb-1", name: "ぼたん鍋定食（周辺店目安）", price: 2500 },
        { id: "tb-2", name: "丹波黒豆ソフト（周辺店目安）", price: 450 },
        { id: "tb-3", name: "そば定食（周辺店目安）", price: 1100 },
      ],
    },
    souvenirs: [
      { id: "tb-s1", name: "ちーたん ぬいぐるみ", price: 1500 },
      { id: "tb-s2", name: "丹波竜ガイドブック", price: 600 },
      { id: "tb-s3", name: "丹波竜クッキー", price: 700 },
    ],
    search: {
      stay: "丹波市 宿",
      rentacarFrom: "新大阪駅",
      lunch: "丹波市 山南町 ランチ",
      ticket: "丹波竜化石工房",
    },
    lastVerified: "2026-11",
  },
];

export function getMuseum(id: string): Museum | undefined {
  return MUSEUMS.find((m) => m.id === id);
}

export function areaLabel(key: AreaKey): string {
  return AREAS.find((a) => a.key === key)?.label ?? key;
}
