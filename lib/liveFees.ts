import { LIVE_FEE_REVALIDATE, LIVE_FEE_RULES, type FeeRow } from "@/config/liveFees";
import type { FeeTable, Museum } from "@/data/museums";

export type LiveFeeStatus = "live" | "changed" | "fallback";

export interface LiveFeeResult {
  status: LiveFeeStatus;
  /** 実際に計算に使う通常料金 */
  fees: FeeTable;
  /** 企画展料金（取得できた場合） */
  specialFees?: FeeTable;
  /** 今日が企画展期間中なら true（期間を取得できた館のみ） */
  specialActive?: boolean;
  /** 料金区分の説明（取得できた場合） */
  label?: string;
  /** 確認済みデータから変わった項目 */
  changes: { field: keyof FeeTable; from: number; to: number }[];
  checkedAt: string;
  sourceUrl?: string;
}

/** HTML → 照合用テキスト（タグ除去・全角→半角・空白正規化） */
export function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .normalize("NFKC")
    .replace(/\s+/g, " ");
}

function toYen(raw: string): number | null {
  if (raw === "無料") return 0;
  const n = Number(raw.replace(/,/g, ""));
  return Number.isFinite(n) && n >= 0 && n <= 10000 ? n : null;
}

/** ルールに従って料金を抜き出す。1つでも失敗したら null */
export function extractFees(text: string, rows: FeeRow[], base: FeeTable): FeeTable | null {
  const out: FeeTable = { ...base };
  for (const row of rows) {
    const m = text.match(row.pattern);
    if (!m) return null;
    for (let i = 0; i < row.fields.length; i++) {
      const v = m[i + 1] !== undefined ? toYen(m[i + 1]) : null;
      if (v === null) return null;
      for (const f of row.fields[i]) out[f] = v;
    }
  }
  return out;
}

/** "7/18~9/13、9/19~12/6" のような期間表記に today が含まれるか */
export function inPeriods(periods: string, today: Date): boolean {
  const md = (today.getMonth() + 1) * 100 + today.getDate(); // 月*100+日
  for (const [, m1, d1, m2, d2] of periods.matchAll(/(\d{1,2})\/(\d{1,2}) ?[~〜-] ?(\d{1,2})\/(\d{1,2})/g)) {
    const from = Number(m1) * 100 + Number(d1);
    const to = Number(m2) * 100 + Number(d2);
    if (from <= to ? md >= from && md <= to : md >= from || md <= to) return true;
  }
  return false;
}

export async function getLiveFees(m: Museum): Promise<LiveFeeResult> {
  const checkedAt = new Date().toISOString();
  const fallback: LiveFeeResult = { status: "fallback", fees: m.fees, changes: [], checkedAt };
  const rule = LIVE_FEE_RULES[m.id];
  if (!rule) return fallback;

  try {
    const res = await fetch(rule.url, {
      next: { revalidate: LIVE_FEE_REVALIDATE },
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DinoMuseumGuide/1.0)" },
    });
    if (!res.ok) return { ...fallback, sourceUrl: rule.url };
    const text = htmlToText(await res.text());

    const fees = extractFees(text, rule.base, m.fees);
    if (!fees) return { ...fallback, sourceUrl: rule.url };

    const specialFees =
      rule.special && m.specialExhibit ? extractFees(text, rule.special, m.specialExhibit.fees) ?? undefined : undefined;

    let specialActive: boolean | undefined;
    if (rule.specialPeriods) {
      const p = text.match(rule.specialPeriods);
      if (p) {
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
        specialActive = inPeriods(p[1], now);
      }
    }
    const label = rule.label ? text.match(rule.label)?.[1] : undefined;

    const changes = (Object.keys(fees) as (keyof FeeTable)[])
      .filter((k) => fees[k] !== m.fees[k])
      .map((k) => ({ field: k, from: m.fees[k], to: fees[k] }));

    return {
      status: changes.length > 0 ? "changed" : "live",
      fees,
      specialFees,
      specialActive,
      label,
      changes,
      checkedAt,
      sourceUrl: rule.url,
    };
  } catch {
    return { ...fallback, sourceUrl: rule.url };
  }
}

/** 自動取得した料金を反映した Museum を返す */
export function applyLiveFees(m: Museum, live: LiveFeeResult): Museum {
  return {
    ...m,
    fees: live.fees,
    specialExhibit:
      m.specialExhibit && live.specialFees ? { ...m.specialExhibit, fees: live.specialFees } : m.specialExhibit,
  };
}
