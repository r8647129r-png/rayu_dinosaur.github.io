import { Lightbulb, MessageSquareQuote, Sparkles, CalendarCheck } from "lucide-react";
import type { Museum } from "@/data/museums";
import type { ImageSpec } from "@/data/images";
import ImageFrame from "@/components/ImageFrame";
import RatingBar from "@/components/RatingBar";
import SectionHeading from "@/components/SectionHeading";
import { HIGHLIGHT_ICONS } from "./icons";

const RES_LABEL = ["", "予約不要", "ほぼ予約不要", "予約がおすすめ", "予約推奨", "予約必須級"] as const;

export default function HighlightSection({ museum: m, gallery }: { museum: Museum; gallery: ImageSpec[] }) {
  return (
    <section className="space-y-8">
      {/* 見どころ（画像カード） */}
      <div>
        <SectionHeading icon={Sparkles} title="見どころ" />
        <div className="grid gap-4 sm:grid-cols-3">
          {m.highlights.map((h, i) => {
            const Icon = HIGHLIGHT_ICONS[h.icon];
            return (
              <article key={h.title} className="overflow-hidden rounded-sm border border-slate-200 bg-white">
                <ImageFrame image={gallery[i] ?? { alt: h.title }} className="aspect-[3/2]" />
                <div className="p-4">
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-ink">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-forest-pale text-forest">
                      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    {h.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{h.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* レビュー + 評価 */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-sm border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-ink">
            <MessageSquareQuote className="h-5 w-5 text-forest" strokeWidth={1.75} aria-hidden />
            編集部レビュー
          </h3>
          <p className="mt-3 text-sm leading-loose text-slate-600">{m.review.body}</p>
        </article>
        <aside className="rounded-sm border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-slate-ink">独自評価（5段階）</h3>
          <div className="mt-3 space-y-2.5">
            <RatingBar label="展示の迫力" value={m.ratings.exhibit} />
            <RatingBar label="発掘体験" value={m.ratings.dig} />
            <RatingBar label="館内グルメ" value={m.ratings.food} />
            <RatingBar label="子連れ・アクセス" value={m.ratings.family} />
          </div>
          <div className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
            <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.75} aria-hidden />
            <div>
              <span className="mr-2 inline-block rounded-sm bg-forest px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {RES_LABEL[m.review.reservationLevel]}
              </span>
              {m.review.reservationNote}
            </div>
          </div>
        </aside>
      </div>

      {/* 攻略メモ（カード） */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-ink">
          <Lightbulb className="h-5 w-5 text-forest" strokeWidth={1.75} aria-hidden />
          攻略メモ
        </h3>
        <ol className="grid gap-3 sm:grid-cols-2">
          {m.review.tips.map((t, i) => (
            <li key={t} className="flex gap-3 rounded-sm border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-ink">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-forest text-xs font-bold tabular-nums text-white">
                {i + 1}
              </span>
              {t}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
