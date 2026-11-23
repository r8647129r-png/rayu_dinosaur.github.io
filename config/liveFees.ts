/**
 * 公式サイトからの入館料 自動取得ルール
 * ------------------------------------------------------------
 * サイトは LIVE_FEE_REVALIDATE 秒ごとに各館の公式料金ページを読み直し、
 * 下記のパターンで料金を抜き出します。抜き出せた場合はその金額で計算し、
 * 失敗した場合（ページ構成の変更など）は data/museums.ts の確認済みの値を使います。
 *
 * pattern のキャプチャグループ（1番目, 2番目…）が fields の各要素に対応します。
 * 「無料」はキャプチャされると 0円として扱います。
 * ページのテキストは全角英数字を半角に変換し、空白を1つにまとめてから照合します。
 */
import type { FeeTable } from "@/data/museums";

export const LIVE_FEE_REVALIDATE = 60 * 60 * 6; // 6時間

type FeeKey = keyof FeeTable;

export interface FeeRow {
  pattern: RegExp;
  fields: FeeKey[][];
}

export interface LiveFeeRule {
  url: string;
  /** 通常（常設展）料金 */
  base: FeeRow[];
  /** 企画展・特別展期間中の料金（任意） */
  special?: FeeRow[];
  /** 企画展の開催期間（例: "7/18~9/13、9/19~12/6"）を抜き出すパターン。今日が期間内なら特別料金を自動適用 */
  specialPeriods?: RegExp;
  /** 現在の料金区分の説明（例: 期間名）を抜き出すパターン */
  label?: RegExp;
}

const N = "([\\d,]+|無料)"; // 金額 or 無料

export const LIVE_FEE_RULES: Record<string, LiveFeeRule> = {
  fukui: {
    url: "https://www.dinosaur.pref.fukui.jp/guide/fee.html",
    base: [
      {
        pattern: new RegExp(`常設展観覧料[\\s\\S]{0,60}?個人 ${N}円 ${N}円 ${N}円`),
        fields: [["adult"], ["student"], ["child"]],
      },
    ],
  },
  kahaku: {
    url: "https://www.kahaku.go.jp/riyou/nyukan-annai/index.html",
    base: [
      {
        pattern: new RegExp(`入館料 ?\\(常設展\\) 一般・大学生 ${N}円? 小・中・高校生 ${N}`),
        fields: [["adult", "student"], ["child"]],
      },
    ],
  },
  gunma: {
    url: "https://www.gmnh.pref.gunma.jp/guide/",
    base: [
      {
        pattern: new RegExp(`開催していない期間[\\s\\S]{0,40}?一般 ${N}円[^ ]* 大学・高専・高校生 ${N}円[^ ]* 中学生以下 ${N}`),
        fields: [["adult"], ["student"], ["child"]],
      },
    ],
    special: [
      {
        pattern: new RegExp(`企画展開催中[\\s\\S]{0,60}?一般 ${N}円[^ ]* 大学・高専・高校生 ${N}円[^ ]* 中学生以下 ${N}`),
        fields: [["adult"], ["student"], ["child"]],
      },
    ],
    specialPeriods: /企画展開催中 ?\(([^)]+)\)/,
  },
  mukawa: {
    url: "https://www.town.mukawa.lg.jp/4356.htm",
    base: [
      {
        pattern: new RegExp(`一般\\(高校生以上\\) ${N}円 [\\d,]+円 小・中学生 ${N}円`),
        fields: [["adult", "student"], ["child"]],
      },
    ],
  },
  mifune: {
    url: "https://mifunemuseum.jp/visit-top/general-info/",
    base: [
      {
        pattern: new RegExp(`大人 ${N}円[^高]{0,30}高校・大学生 ${N}円[^小]{0,30}小・中学生 ${N}円`),
        fields: [["adult"], ["student"], ["child"]],
      },
    ],
  },
  nagasaki: {
    url: "https://nd-museum.jp/guide",
    base: [
      {
        pattern: new RegExp(`一般 ${N}円 [\\d,]+円 小中高生 ${N}円`),
        fields: [["adult"], ["student", "child"]],
      },
    ],
  },
  kanna: {
    url: "https://dino-nakasato.org/facilities/",
    base: [
      {
        pattern: new RegExp(`入場料 大人 ?: ?${N}円 子供\\(小中学生\\) ?: ?${N}円`),
        fields: [["adult", "student"], ["child"]],
      },
    ],
  },
  tamba: {
    url: "https://www.tambaryu.com/annai/annai.html",
    base: [
      {
        pattern: new RegExp(`入館料[\\s\\S]{0,80}?大人\\(高校生以上\\) ?${N}円 小中学生 ${N}円`),
        fields: [["adult", "student"], ["child"]],
      },
    ],
    label: /入館料 【([^】]+)】/,
  },
};
