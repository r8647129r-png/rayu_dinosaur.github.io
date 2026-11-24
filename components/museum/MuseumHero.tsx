import Link from "next/link";
import { Calculator, ChevronLeft, MapPin, Tag, Clock } from "lucide-react";
import { areaLabel, type Museum } from "@/data/museums";
import type { ImageSpec } from "@/data/images";
import ImageFrame from "@/components/ImageFrame";
import { yen } from "@/lib/format";

export function overallScore(m: Museum): number {
  const r = m.ratings;
  return Math.round(((r.exhibit + r.dig + r.food + r.family) / 4) * 10) / 10;
}

export default function MuseumHero({ museum: m, image }: { museum: Museum; image: ImageSpec }) {
  const score = overallScore(m);
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <Link href="/#museums" className="inline-flex min-h-[32px] items-center gap-1 text-xs text-slate-500 hover:text-forest">
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          施設一覧へ戻る
        </Link>
      </div>
      <div className="mx-auto max-w-6xl px-0 pb-8 sm:px-4">
        <div className="relative">
          <ImageFrame image={image} className="aspect-[16/9] sm:aspect-[21/9]" priority />
          {/* PC: 画像にオーバーレイ / スマホ: 画像の下に重ねて表示 */}
          <div className="relative -mt-6 mx-3 border border-slate-200 bg-white p-5 shadow-sm sm:absolute sm:bottom-6 sm:left-6 sm:mx-0 sm:mt-0 sm:max-w-xl sm:bg-white/95 sm:backdrop-blur">
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              {areaLabel(m.area)} / {m.prefecture}
            </p>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-ink md:text-3xl">{m.name}</h1>
            <p className="mt-2 text-sm leading-relaxed text-forest md:text-base">{m.review.headline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="flex items-baseline gap-1">
                <span className="text-xs text-slate-500">編集部評価</span>
                <span className="text-2xl font-bold tabular-nums text-slate-ink">{score.toFixed(1)}</span>
                <span className="text-xs text-slate-500">/ 5</span>
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Tag className="h-3.5 w-3.5 text-forest" strokeWidth={1.75} aria-hidden />
                大人 {yen(m.fees.adult)}
                {m.fees.child === 0 ? "・小中学生 無料" : `・小中学生 ${yen(m.fees.child)}`}
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="h-3.5 w-3.5 text-forest" strokeWidth={1.75} aria-hidden />
                滞在 {m.review.recommendedStay}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href="#simulator"
                className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-sm border border-forest bg-white px-3 text-sm font-semibold text-forest hover:bg-forest-pale"
              >
                <Calculator className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                滞在費を計算する
              </a>
              <a
                href="#deals"
                className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-sm bg-cta px-3 text-sm font-semibold text-white hover:bg-cta-dark"
              >
                <Tag className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                お得に予約・手配する
              </a>
            </div>
          </div>
        </div>
        <p className="mt-3 px-4 text-[11px] text-slate-400 sm:px-0">
          ※本ページはプロモーション（アフィリエイト広告）を含みます。情報確認: {m.lastVerified}
        </p>
      </div>
    </section>
  );
}
