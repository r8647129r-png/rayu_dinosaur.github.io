import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  CalendarX,
  ExternalLink,
  Gift,
  Lightbulb,
  MapPin,
  Calculator,
  Ticket,
  TrainFront,
  Car,
  UtensilsCrossed,
  MessageSquareQuote,
} from "lucide-react";
import { MUSEUMS, areaLabel, getMuseum } from "@/data/museums";
import { yen } from "@/lib/format";
import RatingBar from "@/components/RatingBar";
import CostSimulator from "@/components/CostSimulator";
import PlanningLinks from "@/components/PlanningLinks";
import SectionHeading from "@/components/SectionHeading";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return MUSEUMS.map((m) => ({ id: m.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const m = getMuseum(id);
  if (!m) return {};
  return {
    title: `${m.name}の料金・館内グルメ・滞在費シミュレーション`,
    description: `${m.name}（${m.prefecture}）の入館料、化石発掘体験、館内レストランのメニュー価格、お土産の目安から家族の滞在費を計算。${m.review.headline}`,
  };
}

function InfoRow({ icon: Icon, label, children }: { icon: typeof Clock; label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-3 border-b border-slate-100 py-3 text-sm last:border-b-0">
      <dt className="flex items-start gap-1.5 text-slate-500">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.75} aria-hidden />
        {label}
      </dt>
      <dd className="text-slate-ink">{children}</dd>
    </div>
  );
}

export default async function MuseumPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const m = getMuseum(id);
  if (!m) notFound();

  const feeRows = [
    { label: "大人（一般）", value: m.fees.adult },
    { label: "高大生", value: m.fees.student },
    { label: "小中学生", value: m.fees.child },
    { label: "未就学児", value: m.fees.preschool },
  ];

  return (
    <div className="pb-16 lg:pb-0">
      {/* ヘッダー */}
      <section className="border-b border-slate-200 bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Link href="/#museums" className="flex w-fit items-center gap-1 text-xs text-slate-500 hover:text-forest">
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            施設一覧へ戻る
          </Link>
          <p className="mt-4 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            {areaLabel(m.area)} / {m.prefecture}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-ink md:text-3xl">{m.name}</h1>
          <p className="mt-2 text-sm text-forest md:text-base">{m.review.headline}</p>
          <p className="mt-3 text-xs text-slate-400">情報確認: {m.lastVerified}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10">
        {/* レビュー */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <SectionHeading icon={MessageSquareQuote} title="本音レビュー" />
            <p className="text-sm leading-loose text-slate-600">{m.review.body}</p>
            <div className="mt-6 border border-slate-200 bg-white">
              <h3 className="flex items-center gap-2 border-b border-slate-200 bg-paper px-4 py-2.5 text-sm font-bold text-slate-ink">
                <Lightbulb className="h-4 w-4 text-forest" strokeWidth={1.75} aria-hidden />
                攻略メモ
              </h3>
              <ol className="divide-y divide-slate-100">
                {m.review.tips.map((t, i) => (
                  <li key={t} className="flex gap-3 px-4 py-3 text-sm text-slate-ink">
                    <span className="font-bold tabular-nums text-forest">{String(i + 1).padStart(2, "0")}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <aside className="space-y-4">
            <div className="border border-slate-200 bg-white p-4">
              <h3 className="mb-3 text-sm font-bold text-slate-ink">独自評価（5段階）</h3>
              <div className="space-y-2">
                <RatingBar label="展示の迫力" value={m.ratings.exhibit} />
                <RatingBar label="発掘体験の充実度" value={m.ratings.dig} />
                <RatingBar label="館内グルメ満足度" value={m.ratings.food} />
                <RatingBar label="子連れ・アクセス" value={m.ratings.family} />
              </div>
            </div>
            <div className="border border-slate-200 bg-white p-4 text-sm">
              <h3 className="mb-2 font-bold text-slate-ink">予約の難易度</h3>
              <RatingBar label="難易度" value={m.review.reservationLevel} />
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{m.review.reservationNote}</p>
              <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                滞在時間の目安: <span className="font-semibold text-slate-ink">{m.review.recommendedStay}</span>
              </p>
            </div>
          </aside>
        </section>

        {/* 料金 */}
        <section>
          <SectionHeading icon={Ticket} title="料金体系" lead="税込・個人料金。団体・各種割引は公式サイトをご確認ください。" />
          <div className="grid gap-6 md:grid-cols-3">
            <table className="w-full border border-slate-200 bg-white text-sm">
              <caption className="border border-b-0 border-slate-200 bg-paper px-4 py-2 text-left text-xs font-bold text-slate-ink">
                常設展 入館料
              </caption>
              <tbody className="divide-y divide-slate-100">
                {feeRows.map((r) => (
                  <tr key={r.label}>
                    <th className="px-4 py-2.5 text-left font-normal text-slate-600">{r.label}</th>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-slate-ink">
                      {r.value === 0 ? "無料" : yen(r.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border border-slate-200 bg-white text-sm">
              <p className="border-b border-slate-200 bg-paper px-4 py-2 text-xs font-bold text-slate-ink">
                特別展（目安）
              </p>
              {m.specialExhibit ? (
                <div className="px-4 py-3">
                  <p className="text-slate-ink">{m.specialExhibit.label}</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-slate-ink">
                    {yen(m.specialExhibit.fees.adult)}
                    <span className="ml-1 text-xs font-normal text-slate-500">大人</span>
                  </p>
                  <p className="mt-2 text-xs text-slate-500">{m.specialExhibit.note}</p>
                </div>
              ) : (
                <p className="px-4 py-3 text-slate-500">定期的な特別展の料金設定なし</p>
              )}
            </div>
            <div className="border border-slate-200 bg-white text-sm">
              <p className="border-b border-slate-200 bg-paper px-4 py-2 text-xs font-bold text-slate-ink">
                化石発掘体験
              </p>
              <div className="px-4 py-3">
                <p className="text-slate-ink">{m.dig.name}</p>
                {m.dig.price && (
                  <p className="mt-1 text-2xl font-bold tabular-nums text-slate-ink">
                    {m.dig.price.adult === 0 ? "無料" : yen(m.dig.price.adult)}
                    {m.dig.price.adult > 0 && <span className="ml-1 text-xs font-normal text-slate-500">大人 / 人</span>}
                    {m.dig.price.child !== m.dig.price.adult && (
                      <span className="ml-3 text-base">
                        {yen(m.dig.price.child)}
                        <span className="ml-1 text-xs font-normal text-slate-500">小中学生</span>
                      </span>
                    )}
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-500">{m.dig.note}</p>
              </div>
            </div>
          </div>
          <ul className="mt-3 space-y-1 text-xs text-slate-500">
            {m.feeNotes.map((n) => (
              <li key={n}>※ {n}</li>
            ))}
          </ul>
        </section>

        {/* グルメ・お土産 */}
        <section className="grid gap-6 md:grid-cols-2">
          <div>
            <SectionHeading icon={UtensilsCrossed} title={m.restaurant.inHouse ? "館内レストラン・カフェ" : "お食事（周辺の目安）"} lead={m.restaurant.note} />
            {m.restaurant.menu.length === 0 ? (
              <p className="border border-slate-200 bg-paper p-4 text-sm text-slate-500">
                公式サイトに館内飲食メニューの掲載はありません。シミュレーターでは食事予算を自由に入力できます。
              </p>
            ) : (
            <table className="w-full border border-slate-200 bg-white text-sm">
              <tbody className="divide-y divide-slate-100">
                {m.restaurant.menu.map((i) => (
                  <tr key={i.id}>
                    <th className="px-4 py-2.5 text-left font-normal text-slate-ink">{i.name}</th>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-slate-ink">{yen(i.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
            {m.restaurant.menu.length > 0 && <p className="mt-2 text-xs text-slate-500">価格は公式掲載の税込価格です。</p>}
          </div>
          <div>
            <SectionHeading icon={Gift} title="ミュージアムショップ" lead="価格は公式に掲載がないため、編集部の目安です" />
            <table className="w-full border border-slate-200 bg-white text-sm">
              <tbody className="divide-y divide-slate-100">
                {m.souvenirs.map((i) => (
                  <tr key={i.id}>
                    <th className="px-4 py-2.5 text-left font-normal text-slate-ink">
                      {i.name}
                      {i.estimate && <span className="ml-2 border border-slate-300 px-1 text-[10px] text-slate-500">目安</span>}
                    </th>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-slate-ink">{yen(i.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* シミュレーター */}
        <section>
          <SectionHeading
            id="simulator"
            icon={Calculator}
            title={`${m.shortName}のリアル現地滞在費シミュレーター`}
            lead="人数・体験・食べたいメニュー・お土産を選ぶと、合計金額がリアルタイムで更新されます。"
          />
          <CostSimulator museum={m} />
          <div className="mt-6">
            <PlanningLinks museum={m} />
          </div>
        </section>

        {/* アクセス */}
        <section>
          <SectionHeading icon={MapPin} title="基本情報・アクセス" />
          <div className="grid gap-6 lg:grid-cols-2">
            <dl className="border border-slate-200 bg-white px-4">
              <InfoRow icon={MapPin} label="住所">{m.address}</InfoRow>
              <InfoRow icon={TrainFront} label="最寄り駅">{m.access.station}</InfoRow>
              <InfoRow icon={Car} label="最寄りIC">{m.access.ic}</InfoRow>
              <InfoRow icon={Clock} label="開館時間">{m.hours}</InfoRow>
              <InfoRow icon={CalendarX} label="休館日">{m.closed}</InfoRow>
              {m.access.note && <InfoRow icon={Lightbulb} label="補足">{m.access.note}</InfoRow>}
              <InfoRow icon={ExternalLink} label="公式サイト">
                <a href={m.officialUrl} target="_blank" rel="noopener noreferrer" className="break-all text-forest underline underline-offset-4">
                  {m.officialUrl}
                </a>
              </InfoRow>
              <InfoRow icon={ExternalLink} label="情報の出典">
                <ul className="space-y-1">
                  {m.sources.map((src) => (
                    <li key={src.url}>
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-forest underline underline-offset-4">
                        {src.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-xs text-slate-500">{m.lastVerified} 時点で公式サイトを確認</p>
              </InfoRow>
            </dl>
            <PlanningLinks museum={m} categories={["stay", "rentacar"]} />
          </div>
        </section>
      </div>
    </div>
  );
}
