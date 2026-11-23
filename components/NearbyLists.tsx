import { BedDouble, ExternalLink, Star, Ticket, Utensils } from "lucide-react";
import type { Museum } from "@/data/museums";
import type { NearbyHotel, NearbyRestaurant, NearbyResult } from "@/lib/nearby";
import { PROVIDERS } from "@/config/affiliates";
import { yen } from "@/lib/format";

function jst(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function SearchFallback({ category, keyword, message }: { category: "stay" | "lunch"; keyword: string; message: string }) {
  return (
    <div className="px-4 py-4 text-sm text-slate-500">
      <p>{message}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {PROVIDERS.filter((p) => p.category === category).map((p) => (
          <a
            key={p.id}
            href={p.buildUrl(keyword)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-1.5 rounded-sm border border-slate-300 bg-white px-3 py-1.5 text-slate-ink hover:border-forest hover:text-forest"
          >
            {p.label}で探す
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          </a>
        ))}
      </div>
    </div>
  );
}

export function NearbyHotels({ museum: m, data }: { museum: Museum; data: NearbyResult<NearbyHotel> }) {
  return (
    <section className="border border-slate-200 bg-white">
      <h3 className="flex items-center justify-between gap-2 border-b border-slate-200 bg-paper px-4 py-2.5 text-sm font-bold text-slate-ink">
        <span className="flex items-center gap-2">
          <BedDouble className="h-4 w-4 text-forest" strokeWidth={1.75} aria-hidden />
          周辺3km の宿・最安料金
        </span>
        {data.status === "ok" && <span className="text-[11px] font-normal text-slate-400">{jst(data.checkedAt)} 時点</span>}
      </h3>
      {data.status === "ok" ? (
        <>
          <ul className="divide-y divide-slate-100">
            {data.items.map((h) => (
              <li key={h.id}>
                <a href={h.url} target="_blank" rel="noopener noreferrer sponsored" className="flex gap-3 px-4 py-3 hover:bg-paper">
                  {h.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={h.imageUrl} alt="" className="h-14 w-20 shrink-0 object-cover" loading="lazy" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-ink">{h.name}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{h.access}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs">
                      {h.minCharge ? (
                        <span className="font-semibold tabular-nums text-forest">{yen(h.minCharge)}〜 / 人泊</span>
                      ) : (
                        <span className="text-slate-500">料金はリンク先で確認</span>
                      )}
                      {h.reviewAverage ? (
                        <span className="flex items-center gap-0.5 text-slate-500">
                          <Star className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                          {h.reviewAverage.toFixed(2)}（{h.reviewCount}件）
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">
            料金は楽天トラベルの最安プランの目安で、日付・人数により変わります。
            <a href="https://webservice.rakuten.co.jp/" target="_blank" rel="noopener noreferrer" className="ml-1 underline">
              Supported by Rakuten Developers
            </a>
          </p>
        </>
      ) : (
        <SearchFallback
          category="stay"
          keyword={m.search.stay}
          message={data.status === "empty" ? "3km圏内に楽天トラベル掲載の宿がありません。エリアを広げて検索してください。" : "最新の空室・料金は各予約サイトで確認できます。"}
        />
      )}
    </section>
  );
}

export function NearbyRestaurants({ museum: m, data }: { museum: Museum; data: NearbyResult<NearbyRestaurant> }) {
  return (
    <section className="border border-slate-200 bg-white">
      <h3 className="flex items-center justify-between gap-2 border-b border-slate-200 bg-paper px-4 py-2.5 text-sm font-bold text-slate-ink">
        <span className="flex items-center gap-2">
          <Utensils className="h-4 w-4 text-forest" strokeWidth={1.75} aria-hidden />
          周辺3km の飲食店・クーポン
        </span>
        {data.status === "ok" && <span className="text-[11px] font-normal text-slate-400">{jst(data.checkedAt)} 時点</span>}
      </h3>
      {data.status === "ok" ? (
        <>
          <ul className="divide-y divide-slate-100">
            {data.items.map((r) => (
              <li key={r.id} className="flex gap-3 px-4 py-3">
                {r.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.imageUrl} alt="" className="h-14 w-14 shrink-0 object-cover" loading="lazy" />
                )}
                <div className="min-w-0 flex-1">
                  <a href={r.url} target="_blank" rel="noopener noreferrer sponsored" className="text-sm font-semibold text-slate-ink hover:text-forest hover:underline">
                    {r.name}
                  </a>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {r.genre}
                    {r.budget && ` ・ 予算 ${r.budget}`}
                  </p>
                  {r.hasCoupon && r.couponUrl && (
                    <a
                      href={r.couponUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="mt-1 inline-flex items-center gap-1 border border-forest px-1.5 py-0.5 text-[11px] font-semibold text-forest hover:bg-forest-pale"
                    >
                      <Ticket className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                      クーポンあり
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">
            <a href="http://webservice.recruit.co.jp/" target="_blank" rel="noopener noreferrer" className="underline">
              Powered by ホットペッパーグルメ Webサービス
            </a>
          </p>
        </>
      ) : (
        <SearchFallback
          category="lunch"
          keyword={m.search.lunch}
          message={data.status === "empty" ? "3km圏内に掲載店がありません。" : "周辺の飲食店は各グルメサイトで探せます。"}
        />
      )}
    </section>
  );
}
