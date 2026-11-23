import Link from "next/link";
import { ArrowRight, MapPin, Pickaxe, UtensilsCrossed, Baby } from "lucide-react";
import { areaLabel, type Museum } from "@/data/museums";
import { yen } from "@/lib/format";
import RatingBar from "./RatingBar";

export default function MuseumCard({ museum: m }: { museum: Museum }) {
  return (
    <article className="flex flex-col border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-paper px-5 py-4">
        <p className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          {areaLabel(m.area)} / {m.prefecture}
        </p>
        <h3 className="mt-1 text-lg font-bold text-slate-ink">{m.name}</h3>
        <p className="mt-1 text-sm text-forest">{m.review.headline}</p>
      </div>
      <div className="flex-1 space-y-2 px-5 py-4">
        <RatingBar label="展示の迫力" value={m.ratings.exhibit} />
        <RatingBar label="発掘体験" value={m.ratings.dig} />
        <RatingBar label="館内グルメ" value={m.ratings.food} />
        <RatingBar label="子連れ・アクセス" value={m.ratings.family} />
      </div>
      <dl className="grid grid-cols-2 gap-px border-t border-slate-200 bg-slate-200 text-sm">
        <div className="bg-white px-5 py-3">
          <dt className="text-xs text-slate-500">大人 入館料</dt>
          <dd className="font-semibold tabular-nums text-slate-ink">{yen(m.fees.adult)}</dd>
        </div>
        <div className="bg-white px-5 py-3">
          <dt className="text-xs text-slate-500">小中学生</dt>
          <dd className="font-semibold tabular-nums text-slate-ink">
            {m.fees.child === 0 ? "無料" : yen(m.fees.child)}
          </dd>
        </div>
      </dl>
      <ul className="flex flex-wrap gap-2 border-t border-slate-200 px-5 py-3 text-xs">
        {m.dig.available && (
          <li className="flex items-center gap-1 border border-forest/30 bg-forest-pale px-2 py-0.5 text-forest">
            <Pickaxe className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /> 発掘体験
          </li>
        )}
        {m.restaurant.inHouse && (
          <li className="flex items-center gap-1 border border-forest/30 bg-forest-pale px-2 py-0.5 text-forest">
            <UtensilsCrossed className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /> 館内飲食
          </li>
        )}
        {m.fees.preschool === 0 && (
          <li className="flex items-center gap-1 border border-slate-300 px-2 py-0.5 text-slate-600">
            <Baby className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /> 未就学児無料
          </li>
        )}
      </ul>
      <Link
        href={`/museums/${m.id}`}
        className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm font-semibold text-forest hover:bg-forest-pale"
      >
        詳細・滞在費を計算する
        <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </Link>
    </article>
  );
}
