export interface ChecklistItem {
  id: string;
  label: string;
  timing: string;
}

export const CHECKLIST_GROUPS: { title: string; items: ChecklistItem[] }[] = [
  {
    title: "予約・手配",
    items: [
      { id: "ticket", label: "チケットの事前予約（日時指定券の有無を確認）", timing: "2〜4週間前" },
      { id: "dig", label: "化石発掘体験の予約", timing: "1ヶ月前" },
      { id: "stay", label: "宿泊施設の予約（連休・夏休みは早めに）", timing: "1〜2ヶ月前" },
      { id: "car", label: "レンタカー・駐車場の確認", timing: "2週間前" },
      { id: "closed", label: "休館日・臨時休館の確認", timing: "前日" },
    ],
  },
  {
    title: "持ち物",
    items: [
      { id: "shoes", label: "歩きやすい靴（館内は広く、屋外展示も多い）", timing: "当日" },
      { id: "gloves", label: "軍手・汚れてもよい服（発掘体験用）", timing: "当日" },
      { id: "hat", label: "帽子・飲み物（屋外体験・夏季）", timing: "当日" },
      { id: "bag", label: "お土産用のエコバッグ", timing: "当日" },
      { id: "id", label: "学生証・年齢確認書類（割引用）", timing: "当日" },
      { id: "cash", label: "現金（小規模施設・体験は現金のみの場合あり）", timing: "当日" },
    ],
  },
  {
    title: "子連れの準備",
    items: [
      { id: "stroller", label: "ベビーカー貸出・授乳室の有無を確認", timing: "1週間前" },
      { id: "snack", label: "軽食・おやつ（飲食可能エリアを確認）", timing: "当日" },
      { id: "motion", label: "酔い止め（山間部の施設へ車で行く場合）", timing: "当日" },
    ],
  },
];
