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
    id: "ev-fukui-special",
    title: "福井県立恐竜博物館 特別展",
    period: "例年 7月中旬〜10月中旬",
    venue: "福井県立恐竜博物館（勝山市）",
    area: "hokuriku-chubu",
    url: "https://www.dinosaur.pref.fukui.jp/",
    status: "seasonal",
    note: "夏休み期間は日時指定予約が早く埋まります",
  },
  {
    id: "ev-fukui-field",
    title: "野外恐竜博物館（化石発掘体験）",
    period: "例年 4月下旬〜11月上旬",
    venue: "野外恐竜博物館（勝山市北谷町）",
    area: "hokuriku-chubu",
    url: "https://www.dinosaur.pref.fukui.jp/",
    status: "seasonal",
  },
  {
    id: "ev-kahaku",
    title: "国立科学博物館 特別展・企画展",
    period: "会期は公式サイトで発表",
    venue: "国立科学博物館（上野）",
    area: "kanto",
    url: "https://www.kahaku.go.jp/event/",
    status: "regular",
  },
  {
    id: "ev-gunma",
    title: "群馬県立自然史博物館 企画展",
    period: "例年 春・夏・秋に開催",
    venue: "群馬県立自然史博物館（富岡市）",
    area: "kanto",
    url: "https://www.gmnh.pref.gunma.jp/",
    status: "seasonal",
  },
  {
    id: "ev-mifune",
    title: "御船町恐竜博物館 化石採集体験・企画展",
    period: "開催日は公式サイトで告知",
    venue: "御船町恐竜博物館（熊本県）",
    area: "kyushu",
    url: "https://mifunemuseum.jp/",
    status: "regular",
  },
  {
    id: "ev-tamba",
    title: "丹波竜 化石発掘体験",
    period: "主に土日祝（開催日は要確認）",
    venue: "丹波竜の里（兵庫県丹波市）",
    area: "kansai",
    url: "https://www.tambaryu.jp/",
    status: "regular",
  },
];
