import { BadgePercent } from "lucide-react";
import type { Museum } from "@/data/museums";

export default function DiscountList({ museum: m }: { museum: Museum }) {
  if (m.discounts.length === 0) return null;
  return (
    <div className="border border-slate-200 bg-white">
      <h3 className="flex items-center gap-2 border-b border-slate-200 bg-paper px-4 py-2.5 text-sm font-bold text-slate-ink">
        <BadgePercent className="h-4 w-4 text-forest" strokeWidth={1.75} aria-hidden />
        割引・お得なチケット
      </h3>
      <dl className="divide-y divide-slate-100">
        {m.discounts.map((d) => (
          <div key={d.label} className="grid gap-1 px-4 py-2.5 text-sm sm:grid-cols-[200px_minmax(0,1fr)]">
            <dt className="font-semibold text-slate-ink">{d.label}</dt>
            <dd className="text-slate-600">{d.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
