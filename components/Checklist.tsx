"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { CHECKLIST_GROUPS } from "@/data/checklist";

const STORAGE_KEY = "dino-guide-checklist-v1";

function load(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function save(state: Record<string, boolean>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* プライベートモード等で保存できない場合は無視 */
  }
}

export default function Checklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChecked(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) save(checked);
  }, [checked, ready]);

  const all = CHECKLIST_GROUPS.flatMap((g) => g.items);
  const done = all.filter((i) => checked[i.id]).length;
  const pct = Math.round((done / all.length) * 100);

  return (
    <div className="border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-paper px-4 py-3">
        <div className="flex-1">
          <p className="text-sm text-slate-ink">
            準備状況 <strong className="tabular-nums text-forest">{done}</strong> / {all.length}
          </p>
          <div className="mt-1.5 h-1.5 w-full max-w-xs bg-slate-200" aria-hidden>
            <div className="h-full bg-forest transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setChecked({})}
          className="flex items-center gap-1 rounded-sm border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-forest hover:text-forest"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          すべて外す
        </button>
      </div>
      <div className="grid gap-px bg-slate-200 md:grid-cols-3">
        {CHECKLIST_GROUPS.map((g) => (
          <div key={g.title} className="bg-white p-4">
            <h3 className="mb-2 text-sm font-bold text-slate-ink">{g.title}</h3>
            <ul className="space-y-1">
              {g.items.map((item) => {
                const on = !!checked[item.id];
                return (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-start gap-3 py-1.5">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={on}
                        onChange={() => setChecked((c) => ({ ...c, [item.id]: !on }))}
                      />
                      <span
                        aria-hidden
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${
                          on ? "border-forest bg-forest text-white" : "border-slate-400 bg-white"
                        }`}
                      >
                        {on && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      <span className="text-sm">
                        <span className={on ? "text-slate-400 line-through" : "text-slate-ink"}>
                          {item.label}
                        </span>
                        <span className="block text-xs text-slate-500">目安: {item.timing}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">
        チェック状態はこのブラウザ内（localStorage）にのみ保存されます。
      </p>
    </div>
  );
}
