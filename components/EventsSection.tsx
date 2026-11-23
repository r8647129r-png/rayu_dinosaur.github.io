import { CalendarDays, ExternalLink, MapPin, Newspaper } from "lucide-react";
import { areaLabel } from "@/data/museums";
import type { EventsPayload } from "@/lib/events";

const STATUS_LABEL = {
  confirmed: "会期確定",
  seasonal: "例年開催",
  regular: "随時開催",
} as const;

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function EventsSection({ data, newsLimit = 6 }: { data: EventsPayload; newsLimit?: number }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      {/* 注目イベント（キュレーション / フォールバック） */}
      <div className="border border-slate-200 bg-white">
        <h3 className="flex items-center gap-2 border-b border-slate-200 bg-paper px-4 py-2.5 text-sm font-bold text-slate-ink">
          <CalendarDays className="h-4 w-4 text-forest" strokeWidth={1.75} aria-hidden />
          注目の特別展・体験イベント
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-2 font-normal">イベント</th>
                <th className="px-4 py-2 font-normal">開催期間</th>
                <th className="px-4 py-2 font-normal">エリア</th>
                <th className="px-4 py-2 font-normal">
                  <span className="sr-only">リンク</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.curated.map((e) => (
                <tr key={e.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-ink">{e.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                      {e.venue}
                    </p>
                    {e.note && <p className="mt-0.5 text-xs text-slate-500">{e.note}</p>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-ink">
                    {e.period}
                    <span className="mt-1 block w-fit border border-slate-300 px-1.5 text-[11px] text-slate-500">
                      {STATUS_LABEL[e.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{areaLabel(e.area)}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                    >
                      公式サイト
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 最新ニュース（RSS 自動取得） */}
      <div className="border border-slate-200 bg-white">
        <h3 className="flex items-center justify-between border-b border-slate-200 bg-paper px-4 py-2.5 text-sm font-bold text-slate-ink">
          <span className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-forest" strokeWidth={1.75} aria-hidden />
            恐竜展・化石イベントの最新ニュース
          </span>
          <span className="text-[11px] font-normal text-slate-400">1時間ごとに自動更新</span>
        </h3>
        {data.newsStatus === "ok" ? (
          <ul className="divide-y divide-slate-100">
            {data.news.slice(0, newsLimit).map((n) => (
              <li key={n.link}>
                <a
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 hover:bg-paper"
                >
                  <p className="text-sm leading-snug text-slate-ink">{n.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {n.source}
                    {n.publishedAt && ` ・ ${formatDate(n.publishedAt)}`}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-6 text-sm text-slate-500">
            現在ニュースを取得できません。左の注目イベント一覧と、各施設の公式サイトをご確認ください。
          </p>
        )}
        <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">
          最終取得: {formatDate(data.fetchedAt)} ／ 出典: Google ニュース
        </p>
      </div>
    </div>
  );
}
