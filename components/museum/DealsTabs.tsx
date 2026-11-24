"use client";

import { useState, type ReactNode } from "react";
import { BedDouble, Gift, Ticket, type LucideIcon } from "lucide-react";

const TAB_ICONS: Record<string, LucideIcon> = { ticket: Ticket, stay: BedDouble, goods: Gift };

export interface DealTab {
  id: string;
  label: string;
  sub: string;
  /** アイコン名: ticket / stay / goods */
  icon: string;
  content: ReactNode;
}

/** タブ切替（全パネルをHTMLに出力し、表示だけ切り替える） */
export default function DealsTabs({ tabs }: { tabs: DealTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  return (
    <div>
      <div role="tablist" aria-label="予約・購入の種類" className="grid grid-cols-3 gap-1 sm:gap-2">
        {tabs.map((t) => {
          const on = t.id === active;
          const Icon = TAB_ICONS[t.icon] ?? Ticket;
          return (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={on}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-sm border px-1 py-2 text-center transition-colors sm:flex-row sm:gap-2 sm:px-4 ${
                on ? "border-forest bg-forest text-white" : "border-slate-200 bg-white text-slate-ink hover:border-forest"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
              <span className="leading-tight">
                <span className="block text-xs font-bold sm:text-sm">{t.label}</span>
                <span className={`hidden text-[11px] sm:block ${on ? "text-white/80" : "text-slate-500"}`}>{t.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== active}
          className="mt-4"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
