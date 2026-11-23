/**
 * 特別展・イベントのフォールバックデータ
 * ------------------------------------------------------------
 * 外部ニュースの取得に失敗した場合でも表示される「注目イベント」です。
 * 日付の決まった会期は年度ごとに変わるため、ここでは
 * 「例年の開催傾向」と公式サイトの確認リンクを掲載しています。
 * 会期が確定したら period を具体的な日付に書き換えてください。
 */
import type { AreaKey } from "./museums";

export interface CuratedEvent {
  id: string;
  title: string;
  period: string;
  venue: string;
  area: AreaKey;
  url: string;
  status: "regular" | "seasonal" | "confirmed";
  note?: string;
}

export const FALLBACK_EVENTS: CuratedEvent[] = [
  {
    id: "ev-tamba-daikyoryu",
    title: "特別展「大恐竜展〜新発見の堅頭竜類ザヴァケファレ〜」",
    period: "2026年10月10日〜2027年2月23日",
    venue: "丹波市立たんば恐竜博物館（兵庫県丹波市）",
    area: "kansai",
    url: "https://www.tambaryu.com/",
    status: "confirmed",
    note: "世界初公開の頭突き恐竜の実物化石、ティラノサウルス全身骨格など",
  },
  {
    id: "ev-tamba-fukui",
    title: "特別展「丹波と福井の恐竜たち」",
    period: "2026年6月13日〜12月13日",
    venue: "丹波市立たんば恐竜博物館（兵庫県丹波市）",
    area: "kansai",
    url: "https://www.tambaryu.com/",
    status: "confirmed",
  },
  {
    id: "ev-gunma-jurassic",
    title: "開館30周年記念企画展「北米ジュラ紀の恐竜たち」後期展示",
    period: "2026年9月19日〜12月6日",
    venue: "群馬県立自然史博物館（群馬県富岡市）",
    area: "kanto",
    url: "https://www.gmnh.pref.gunma.jp/",
    status: "confirmed",
  },
  {
    id: "ev-mukawa-100k",
    title: "来館者10万人達成記念イベント（記念品配布・バックヤードツアー）",
    period: "2026年11月28日・29日",
    venue: "むかわ町穂別恐竜博物館（北海道むかわ町）",
    area: "hokkaido-tohoku",
    url: "https://www.town.mukawa.lg.jp/5683.htm",
    status: "confirmed",
  },
  {
    id: "ev-kanna-winter",
    title: "冬季の化石さがし体験",
    period: "2026年12月26日・27日",
    venue: "神流町恐竜センター（群馬県神流町）",
    area: "kanto",
    url: "https://dino-nakasato.org/",
    status: "confirmed",
    note: "1人500円・各回15名。Web予約は11月25日12時頃から",
  },
  {
    id: "ev-fukui-theater",
    title: "3面ダイノシアター 上映再開",
    period: "2026年11月27日〜（予定）",
    venue: "福井県立恐竜博物館（福井県勝山市）",
    area: "hokuriku-chubu",
    url: "https://www.dinosaur.pref.fukui.jp/",
    status: "confirmed",
  },
  {
    id: "ev-fukui-field",
    title: "野外恐竜博物館（発掘現場ツアー）",
    period: "2027年4月中旬〜下旬頃に再開予定",
    venue: "野外恐竜博物館（福井県勝山市北谷町）",
    area: "hokuriku-chubu",
    url: "https://www.dinosaur.pref.fukui.jp/visit/fieldstation",
    status: "seasonal",
  },
];
