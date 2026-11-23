"use client";

import { useMemo, useState } from "react";
import { Check, SlidersHorizontal } from "lucide-react";
import { AREAS, type AreaKey, type Museum } from "@/data/museums";
import MuseumCard from "./MuseumCard";

type FilterKey = "dig" | "restaurant" | "preschoolFree";

const FILTERS: { key: FilterKey; label: string; test: (m: Museum) => boolean }[] = [
  { key: "dig", label: "発掘体験あり", test: (m) => m.dig.available },
  { key: "restaurant", label: "館内レストランあり", test: (m) => m.restaurant.inHouse },
  { key: "preschoolFree", label: "未就学児無料", test: (m) => m.fees.preschool === 0 },
];

export default function MuseumExplorer({ museums }: { museums: Museum[] }) {
  const [area, setArea] = useState<AreaKey | "all">("all");
  const [active, setActive] = useState<Set<FilterKey>>(new Set());

  const toggle = (k: FilterKey) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });

  const list = useMemo(
    () =>
      museums.filter(
        (m) =>
          (area === "all" || m.area === area) &&
          FILTERS.every((f) => !active.has(f.key) || f.test(m))
      ),
    [museums, area, active]
  );

  const tabs: { key: AreaKey | "all"; label: string }[] = [{ key: "all", label: "すべて" }, ...AREAS];

  return (
    <div>
      <div role="tablist" aria-label="エリア" className="flex overflow-x-auto border-b border-slate-300">
        {tabs.map((t) => {
          const selected = area === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={selected}
              onClick={() => setArea(t.key)}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm transition-colors ${
                selected
                  ? "border-forest font-semibold text-forest"
                  : "border-transparent text-slate-500 hover:text-slate-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          条件で絞り込み
        </span>
        {FILTERS.map((f) => {
          const on = active.has(f.key);
          return (
            <button
              key={f.key}
              onClick={() => toggle(f.key)}
              aria-pressed={on}
              className={`flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-sm ${
                on
                  ? "border-forest bg-forest text-white"
                  : "border-slate-300 bg-white text-slate-ink hover:border-forest"
              }`}
            >
              <span
                className={`flex h-3.5 w-3.5 items-center justify-center border ${
                  on ? "border-white" : "border-slate-400"
                }`}
              >
                {on && <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />}
              </span>
              {f.label}
            </button>
          );
        })}
        <span className="ml-auto text-sm text-slate-500">
          該当 <strong className="text-slate-ink">{list.length}</strong> 施設
        </span>
      </div>

      {list.length === 0 ? (
        <p className="mt-8 border border-dashed border-slate-300 bg-paper p-8 text-center text-sm text-slate-500">
          条件に一致する施設がありません。条件を変更してください。
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => (
            <MuseumCard key={m.id} museum={m} />
          ))}
        </div>
      )}
    </div>
  );
}
