import { RefreshCw, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import type { LiveFeeResult } from "@/lib/liveFees";
import type { Museum } from "@/data/museums";
import { yen } from "@/lib/format";

const FIELD_LABEL = { adult: "大人", student: "高大生", child: "小中学生", preschool: "未就学児" } as const;

function jst(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function LiveFeeBadge({ live, museum }: { live: LiveFeeResult; museum: Museum }) {
  if (live.status === "fallback") {
    return (
      <p className="flex items-start gap-2 border border-slate-300 bg-paper px-3 py-2 text-xs text-slate-600">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        <span>
          公式サイトから料金を自動取得できなかったため、{museum.lastVerified} に確認した料金で計算しています。
        </span>
      </p>
    );
  }
  return (
    <div className={`border px-3 py-2 text-xs ${live.status === "changed" ? "border-forest bg-forest-pale text-forest" : "border-slate-200 bg-paper text-slate-600"}`}>
      <p className="flex items-center gap-2">
        <RefreshCw className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        公式サイトの料金を自動で反映しています（6時間ごとに確認・最終確認 {jst(live.checkedAt)}）
      </p>
      {live.label && <p className="mt-1 pl-5">現在の料金区分：{live.label}</p>}
      {live.specialActive && <p className="mt-1 pl-5">本日は企画展の開催期間中のため、企画展料金で計算しています。</p>}
      {live.changes.length > 0 && (
        <ul className="mt-1 space-y-0.5 pl-5 font-semibold">
          {live.changes.map((c) => {
            const Icon = c.to < c.from ? TrendingDown : TrendingUp;
            return (
              <li key={c.field} className="flex items-center gap-1">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                料金が変わりました：{FIELD_LABEL[c.field]} {yen(c.from)} → {yen(c.to)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
