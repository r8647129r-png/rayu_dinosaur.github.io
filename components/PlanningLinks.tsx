import { BedDouble, Bus, Car, ExternalLink, Ticket, Utensils, type LucideIcon } from "lucide-react";
import { CATEGORY_META, DISCLOSURE_TEXT, PROVIDERS, type LinkCategory } from "@/config/affiliates";
import type { Museum } from "@/data/museums";

const ICONS: Record<LinkCategory, LucideIcon> = {
  stay: BedDouble,
  tour: Bus,
  rentacar: Car,
  lunch: Utensils,
  ticket: Ticket,
};

function keywordFor(m: Museum, c: LinkCategory): string {
  switch (c) {
    case "stay":
      return m.search.stay;
    case "tour":
      return "恐竜";
    case "rentacar":
      return m.search.rentacarFrom;
    case "lunch":
      return m.search.lunch;
    case "ticket":
      return m.search.ticket;
  }
}

function subtitle(m: Museum, c: LinkCategory): string {
  switch (c) {
    case "stay":
      return `${m.search.stay} 周辺`;
    case "tour":
      return "首都圏発の国内ツアー";
    case "rentacar":
      return `${m.search.rentacarFrom} 発着`;
    case "lunch":
      return `${m.search.lunch}`;
    case "ticket":
      return `${m.shortName}の事前チケット・体験`;
  }
}

export default function PlanningLinks({
  museum: m,
  categories = ["stay", "tour", "rentacar", "lunch", "ticket"],
}: {
  museum: Museum;
  categories?: LinkCategory[];
}) {
  return (
    <section className="border border-slate-200 bg-paper">
      <div className="border-b border-slate-200 px-4 py-3">
        <h3 className="text-sm font-bold text-slate-ink">お出かけ計画・手配サポート</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          {m.name}周辺の情報を各サービスで検索できます。
        </p>
      </div>
      <ul className="grid gap-px bg-slate-200 sm:grid-cols-2">
        {categories.map((c) => {
          const Icon = ICONS[c];
          const meta = CATEGORY_META[c];
          const providers = PROVIDERS.filter((p) => p.category === c);
          return (
            <li key={c} className="bg-white p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-ink">
                <Icon className="h-4 w-4 text-forest" strokeWidth={1.75} aria-hidden />
                {meta.title}
              </p>
              <p className="mt-0.5 pl-6 text-xs text-slate-500">
                {subtitle(m, c)} ・ {meta.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 pl-6">
                {providers.map((p) => (
                  <a
                    key={p.id}
                    href={p.buildUrl(keywordFor(m, c))}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center gap-1.5 rounded-sm border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-ink hover:border-forest hover:text-forest"
                  >
                    {p.label}で確認
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  </a>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="px-4 py-2 text-[11px] text-slate-400">{DISCLOSURE_TEXT}</p>
    </section>
  );
}
