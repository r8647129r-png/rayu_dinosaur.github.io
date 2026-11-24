import { BedDouble, Bus, Car, CheckCircle2, ExternalLink, Gift, Ticket, Utensils, BookOpen, type LucideIcon } from "lucide-react";
import { PROVIDERS, DISCLOSURE_TEXT, wrapRakuten, type ProviderDef } from "@/config/affiliates";
import type { Museum } from "@/data/museums";
import { PREP_GOODS } from "@/data/goods";
import type { NearbyHotel, NearbyRestaurant, NearbyResult } from "@/lib/nearby";
import ImageFrame from "@/components/ImageFrame";
import { NearbyHotels, NearbyRestaurants } from "@/components/NearbyLists";
import { yen } from "@/lib/format";
import DealsTabs from "./DealsTabs";

const ichiba = (kw: string) => wrapRakuten(`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(kw)}/`);

function ProviderButton({ p, keyword, primary = false }: { p: ProviderDef; keyword: string; primary?: boolean }) {
  return (
    <a
      href={p.buildUrl(keyword)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-sm px-3 text-sm font-semibold ${
        primary ? "bg-cta text-white hover:bg-cta-dark" : "border border-deal bg-white text-deal hover:bg-deal-pale"
      }`}
    >
      {p.label}で見る
      <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
    </a>
  );
}

function DealCard({
  icon: Icon,
  title,
  lead,
  points,
  children,
  badge,
}: {
  icon: LucideIcon;
  title: string;
  lead: string;
  points?: string[];
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <article className="flex flex-col rounded-sm border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-ink">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-deal-pale text-deal">
            <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
          {title}
        </h3>
        {badge && <span className="shrink-0 rounded-sm bg-cta-pale px-1.5 py-0.5 text-[11px] font-semibold text-cta-dark">{badge}</span>}
      </div>
      <p className="mt-2 text-sm text-slate-600">{lead}</p>
      {points && (
        <ul className="mt-3 space-y-1.5">
          {points.map((pt) => (
            <li key={pt} className="flex items-start gap-1.5 text-sm text-slate-ink">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-deal" strokeWidth={2} aria-hidden />
              {pt}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-4">{children}</div>
    </article>
  );
}

export default function DealsSection({
  museum: m,
  hotels,
  restaurants,
}: {
  museum: Museum;
  hotels: NearbyResult<NearbyHotel>;
  restaurants: NearbyResult<NearbyRestaurant>;
}) {
  const by = (cat: ProviderDef["category"]) => PROVIDERS.filter((p) => p.category === cat);
  const asoview = PROVIDERS.find((p) => p.id === "asoview")!;

  const ticketPanel = (
    <div className="grid gap-4 md:grid-cols-3">
      <DealCard
        icon={Ticket}
        title="事前チケット（アソビュー！）"
        lead="レジャー・体験チケットの予約サイト。取扱いがあれば事前に購入できます。"
        points={["当日の窓口・券売機の待ちを減らせる", "スマホのチケット画面で入場できる施設も", "取扱いの有無はリンク先で確認"]}
        badge="事前購入"
      >
        <ProviderButton p={asoview} keyword={m.search.ticket} primary />
      </DealCard>
      <DealCard
        icon={CheckCircle2}
        title="公式サイトで確認・予約"
        lead={m.review.reservationNote}
        points={m.discounts.slice(0, 2).map((d) => `${d.label}：${d.detail}`)}
      >
        <a
          href={m.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-sm bg-forest px-3 text-sm font-semibold text-white hover:bg-forest-dark"
        >
          公式サイトを開く
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        </a>
      </DealCard>
      <DealCard
        icon={Gift}
        title={m.dig.available ? "発掘・体験プログラム" : "体験・イベント"}
        lead={m.dig.name}
        points={[
          m.dig.price
            ? m.dig.price.adult === 0
              ? "参加無料（観覧券が必要）"
              : `大人 ${yen(m.dig.price.adult)}${m.dig.price.child !== m.dig.price.adult ? ` / 小中学生 ${yen(m.dig.price.child)}` : ""}`
            : "料金は施設に確認",
          m.dig.note,
        ]}
      >
        <a
          href="#simulator"
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-sm border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-ink hover:border-forest hover:text-forest"
        >
          体験代を含めて試算する
        </a>
      </DealCard>
    </div>
  );

  const stayPanel = (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <DealCard
          icon={BedDouble}
          title="子連れ・恐竜好きの旅に便利な周辺の宿"
          lead={`${m.search.stay} 周辺のホテル・旅館の空室と料金を比較`}
          badge="比較"
        >
          <div className="grid grid-cols-2 gap-2">
            {by("stay").map((p, i) => (
              <ProviderButton key={p.id} p={p} keyword={m.search.stay} primary={i === 0} />
            ))}
          </div>
        </DealCard>
        <DealCard icon={Car} title="空港・駅からのレンタカー比較" lead={`${m.search.rentacarFrom} 発着のレンタカー料金を比較。${m.access.ic}`}>
          <div className="grid grid-cols-2 gap-2">
            {by("rentacar").map((p, i) => (
              <ProviderButton key={p.id} p={p} keyword={m.search.rentacarFrom} primary={i === 0} />
            ))}
          </div>
        </DealCard>
        <DealCard icon={Bus} title="交通＋宿のパッケージツアー" lead="出発地を選んで、恐竜関係の国内ツアーを探す（JTB旅物語）">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2">
            {by("tour").map((p) => (
              <a
                key={p.id}
                href={p.buildUrl("恐竜")}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex min-h-[44px] items-center justify-center rounded-sm border border-deal bg-white px-2 text-xs font-semibold text-deal hover:bg-deal-pale"
              >
                {p.label.replace("JTB ", "")}
              </a>
            ))}
          </div>
        </DealCard>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <NearbyHotels museum={m} data={hotels} />
        <NearbyRestaurants museum={m} data={restaurants} />
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-sm border border-slate-200 bg-white p-4 text-sm">
        <Utensils className="h-4 w-4 text-deal" strokeWidth={1.75} aria-hidden />
        <span className="mr-2 font-semibold text-slate-ink">周辺ランチを探す</span>
        {by("lunch").map((p) => (
          <ProviderButton key={p.id} p={p} keyword={m.search.lunch} />
        ))}
      </div>
    </div>
  );

  const goods = [
    ...PREP_GOODS,
    ...m.souvenirs.map((s) => ({ id: s.id, name: `${s.name}（${m.shortName}の館内価格目安）`, description: "ミュージアムショップの価格目安。似た商品を事前にチェック", priceFrom: s.price, keyword: `恐竜 ${s.name.replace(/（.*?）/g, "")}`, image: undefined as string | undefined })),
  ].slice(0, 8);

  const goodsPanel = (
    <div>
      <p className="mb-3 flex items-center gap-1.5 text-sm text-slate-600">
        <BookOpen className="h-4 w-4 text-deal" strokeWidth={1.75} aria-hidden />
        行く前に子どもと予習できる図鑑や、定番の恐竜グッズ。価格は目安です。
      </p>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {goods.map((g) => (
          <li key={g.id} className="flex flex-col overflow-hidden rounded-sm border border-slate-200 bg-white">
            <ImageFrame image={{ src: g.image, alt: g.name }} className="aspect-square" showLabel={false} />
            <div className="flex flex-1 flex-col p-3">
              <p className="text-sm font-semibold leading-snug text-slate-ink">{g.name}</p>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{g.description}</p>
              <p className="mt-2 text-sm font-bold tabular-nums text-cta-dark">
                {yen(g.priceFrom)}〜<span className="ml-1 text-[10px] font-normal text-slate-500">目安</span>
              </p>
              <a
                href={ichiba(g.keyword)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="mt-2 flex min-h-[40px] items-center justify-center gap-1 rounded-sm bg-cta px-2 text-xs font-semibold text-white hover:bg-cta-dark"
              >
                楽天市場で探す
                <ExternalLink className="h-3 w-3" strokeWidth={2} aria-hidden />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <p className="mb-4 rounded-sm border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
        ※本ページはプロモーション（アフィリエイト広告）を含みます。{DISCLOSURE_TEXT.replace("本セクションのリンクには広告（アフィリエイトリンク）が含まれます。", "")}
      </p>
      <DealsTabs
        tabs={[
          { id: "ticket", label: "チケット・体験", sub: "並ばず入場・事前購入", icon: "ticket", content: ticketPanel },
          { id: "stay", label: "宿泊・交通", sub: "宿・レンタカー・ツアー", icon: "stay", content: stayPanel },
          { id: "goods", label: "予習・グッズ", sub: "図鑑・お土産", icon: "goods", content: goodsPanel },
        ]}
      />
    </div>
  );
}
