import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Calculator,
  CalendarX,
  Car,
  Clock,
  ExternalLink,
  Gift,
  Lightbulb,
  MapPin,
  Share2,
  Tag,
  Ticket,
  TrainFront,
  UtensilsCrossed,
} from "lucide-react";
import { MUSEUMS, getMuseum } from "@/data/museums";
import { getMuseumImages } from "@/data/images";
import { getMuseumSocial } from "@/data/social";
import { yen } from "@/lib/format";
import { applyLiveFees, getLiveFees } from "@/lib/liveFees";
import { getNearbyHotels, getNearbyRestaurants } from "@/lib/nearby";
import CostSimulator from "@/components/CostSimulator";
import SectionHeading from "@/components/SectionHeading";
import LiveFeeBadge from "@/components/LiveFeeBadge";
import DiscountList from "@/components/DiscountList";
import MuseumHero from "@/components/museum/MuseumHero";
import HighlightSection from "@/components/museum/HighlightSection";
import DealsSection from "@/components/museum/DealsSection";
import SocialSection from "@/components/museum/SocialSection";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return MUSEUMS.map((m) => ({ id: m.id }));
}

export const dynamicParams = false;
// 料金・宿・飲食店の情報を1時間ごとに再生成
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const m = getMuseum(id);
  if (!m) return {};
  const hero = getMuseumImages(id).hero;
  return {
    title: `${m.name}の料金・見どころ・お得な予約｜滞在費シミュレーション`,
    description: `${m.name}（${m.prefecture}）の入館料、見どころ、館内グルメ、お土産の目安から家族の滞在費を計算。チケット・宿・ツアーもお得に手配。${m.review.headline}`,
    openGraph: hero.src ? { images: [{ url: hero.src, alt: hero.alt }] } : undefined,
  };
}

function InfoRow({ icon: Icon, label, children }: { icon: typeof Clock; label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 border-b border-slate-100 py-3 text-sm last:border-b-0">
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
  const base = getMuseum(id);
  if (!base) notFound();

  const [live, hotels, restaurants] = await Promise.all([
    getLiveFees(base),
    getNearbyHotels(base),
    getNearbyRestaurants(base),
  ]);
  const m = applyLiveFees(base, live);
  const images = getMuseumImages(m.id);
  const social = getMuseumSocial(m.id);

  const feeRows = [
    { label: "大人（一般）", value: m.fees.adult },
    { label: "高大生", value: m.fees.student },
    { label: "小中学生", value: m.fees.child },
    { label: "未就学児", value: m.fees.preschool },
  ];

  return (
    <div className="pb-16 lg:pb-0">
      {/* 1. ヒーロー */}
      <MuseumHero museum={m} image={images.hero} />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-10">
        {/* 2. 見どころ・レビュー・攻略メモ */}
        <HighlightSection museum={m} gallery={images.gallery} />

        {/* 料金 */}
        <section>
          <SectionHeading icon={Ticket} title="料金・割引" />
          <div className="mb-4">
            <LiveFeeBadge live={live} museum={base} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="overflow-hidden rounded-sm border border-slate-200 bg-white text-sm">
              <p className="border-b border-slate-200 bg-paper px-4 py-2 text-xs font-bold text-slate-ink">常設展 入館料（税込）</p>
              <table className="w-full">
                <tbody className="divide-y divide-slate-100">
                  {feeRows.map((r) => (
                    <tr key={r.label}>
                      <th className="px-4 py-2.5 text-left font-normal text-slate-600">{r.label}</th>
                      <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-slate-ink">
                        {r.value === 0 ? <span className="text-deal">無料</span> : yen(r.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-sm border border-slate-200 bg-white text-sm">
              <p className="border-b border-slate-200 bg-paper px-4 py-2 text-xs font-bold text-slate-ink">特別展・企画展</p>
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
            <div className="rounded-sm border border-slate-200 bg-white text-sm">
              <p className="border-b border-slate-200 bg-paper px-4 py-2 text-xs font-bold text-slate-ink">発掘・体験</p>
              <div className="px-4 py-3">
                <p className="text-slate-ink">{m.dig.name}</p>
                {m.dig.price && (
                  <p className="mt-1 text-2xl font-bold tabular-nums text-slate-ink">
                    {m.dig.price.adult === 0 ? "無料" : yen(m.dig.price.adult)}
                    {m.dig.price.adult > 0 && <span className="ml-1 text-xs font-normal text-slate-500">大人</span>}
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
          <div className="mt-6">
            <DiscountList museum={m} />
          </div>
        </section>

        {/* グルメ・ショップ */}
        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <SectionHeading icon={UtensilsCrossed} title={m.restaurant.inHouse ? "館内レストラン・カフェ" : "お食事"} lead={m.restaurant.note} />
            {m.restaurant.menu.length === 0 ? (
              <p className="rounded-sm border border-slate-200 bg-paper p-4 text-sm text-slate-500">
                公式サイトに館内飲食メニューの掲載はありません。シミュレーターでは食事予算を自由に入力できます。周辺の飲食店は
                <a href="#deals" className="mx-1 font-semibold text-forest underline underline-offset-4">お得に予約・手配</a>
                から探せます。
              </p>
            ) : (
              <>
                <ul className="divide-y divide-slate-100 overflow-hidden rounded-sm border border-slate-200 bg-white text-sm">
                  {m.restaurant.menu.map((i) => (
                    <li key={i.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <span className="text-slate-ink">{i.name}</span>
                      <span className="whitespace-nowrap font-semibold tabular-nums text-slate-ink">{yen(i.price)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-slate-500">価格は公式掲載の税込価格です。</p>
              </>
            )}
          </div>
          <div>
            <SectionHeading icon={Gift} title="ミュージアムショップ" lead="価格は公式に掲載がないため、編集部の目安です" />
            <ul className="divide-y divide-slate-100 overflow-hidden rounded-sm border border-slate-200 bg-white text-sm">
              {m.souvenirs.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="text-slate-ink">
                    {i.name}
                    {i.estimate && <span className="ml-2 rounded-sm border border-slate-300 px-1 text-[10px] text-slate-500">目安</span>}
                  </span>
                  <span className="whitespace-nowrap font-semibold tabular-nums text-slate-ink">{yen(i.price)}</span>
                </li>
              ))}
            </ul>
            <a href="#deals" className="mt-2 inline-block text-xs font-semibold text-forest underline underline-offset-4">
              似たグッズや予習用の図鑑を見る
            </a>
          </div>
        </section>

        {/* 3. シミュレーター（試算結果の下に予約導線） */}
        <section>
          <SectionHeading
            id="simulator"
            icon={Calculator}
            title={`${m.shortName}のリアル現地滞在費シミュレーター`}
            lead="人数・体験・食べたいメニュー・お土産を選ぶと合計金額がリアルタイムで更新。結果の下からそのまま手配できます。"
          />
          <CostSimulator museum={m} defaultSpecial={!!live.specialActive} />
        </section>

        {/* 4. お得に予約・購入する */}
        <section>
          <SectionHeading
            id="deals"
            icon={Tag}
            title="お得に予約・購入する"
            lead="チケット・宿・交通・グッズをまとめて比較できます。"
          />
          <DealsSection museum={m} hotels={hotels} restaurants={restaurants} />
        </section>

        {/* 5. SNS */}
        <section>
          <SectionHeading icon={Share2} title="SNSで見る最新の様子" lead="公式アカウントの投稿や来館者の様子" />
          <SocialSection museum={m} social={social} />
        </section>

        {/* 基本情報・アクセス */}
        <section>
          <SectionHeading icon={MapPin} title="基本情報・アクセス" />
          <dl className="rounded-sm border border-slate-200 bg-white px-4">
            <InfoRow icon={MapPin} label="住所">{m.address}</InfoRow>
            <InfoRow icon={TrainFront} label="電車・バス">{m.access.station}</InfoRow>
            <InfoRow icon={Car} label="車">{m.access.ic}</InfoRow>
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
        </section>
      </div>
    </div>
  );
}
