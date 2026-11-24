"use client";

import { BedDouble, ExternalLink, Ticket, CalendarCheck } from "lucide-react";
import { PROVIDERS } from "@/config/affiliates";
import type { Museum } from "@/data/museums";

function provider(id: string) {
  return PROVIDERS.find((p) => p.id === id);
}

/** 試算結果の直下に出す「この条件でお得に手配する」エリア */
export default function BookingCTA({
  museum: m,
  adults,
  children,
}: {
  museum: Museum;
  adults: number;
  children: number;
}) {
  const asoview = provider("asoview");
  const rakuten = provider("rakuten-travel");
  const jalan = provider("jalan");
  const party = [adults > 0 && `大人${adults}名`, children > 0 && `子ども${children}名`].filter(Boolean).join("・") || "人数未設定";

  const btn = "flex min-h-[48px] w-full items-center justify-between gap-2 rounded-sm px-4 text-sm font-semibold";
  return (
    <div className="border border-t-0 border-forest bg-cta-pale p-4">
      <p className="text-sm font-bold text-slate-ink">この条件でお得に手配する</p>
      <p className="mt-0.5 text-xs text-slate-600">{party}での旅行に</p>
      <div className="mt-3 space-y-2">
        {m.review.reservationLevel >= 4 && (
          <a href={m.officialUrl} target="_blank" rel="noopener noreferrer" className={`${btn} bg-forest text-white hover:bg-forest-dark`}>
            <span className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" strokeWidth={2} aria-hidden />
              公式サイトで日時指定券を予約
            </span>
            <ExternalLink className="h-4 w-4 opacity-80" strokeWidth={2} aria-hidden />
          </a>
        )}
        {asoview && (
          <a href={asoview.buildUrl(m.search.ticket)} target="_blank" rel="noopener noreferrer sponsored" className={`${btn} bg-cta text-white hover:bg-cta-dark`}>
            <span className="flex items-center gap-2">
              <Ticket className="h-4 w-4" strokeWidth={2} aria-hidden />
              アソビュー！で事前チケットを探す
            </span>
            <ExternalLink className="h-4 w-4 opacity-80" strokeWidth={2} aria-hidden />
          </a>
        )}
        <p className="pt-1 text-xs font-semibold text-slate-600">
          <BedDouble className="mr-1 inline h-3.5 w-3.5 text-deal" strokeWidth={2} aria-hidden />
          {children > 0 ? "家族向けに" : ""}周辺ホテルの空室を見る
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[rakuten, jalan].map(
            (p) =>
              p && (
                <a
                  key={p.id}
                  href={p.buildUrl(m.search.stay)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex min-h-[44px] items-center justify-center gap-1 rounded-sm border border-deal bg-white px-2 text-sm font-semibold text-deal hover:bg-deal-pale"
                >
                  {p.label}
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                </a>
              )
          )}
        </div>
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
        ※リンク先はアフィリエイト広告を含みます。料金・在庫は各サイトでご確認ください。
      </p>
    </div>
  );
}
