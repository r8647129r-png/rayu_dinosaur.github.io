"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Museum } from "@/data/museums";
import CostSimulator from "./CostSimulator";
import PlanningLinks from "./PlanningLinks";

export default function QuickSimulator({ museums }: { museums: Museum[] }) {
  const [id, setId] = useState(museums[0]?.id ?? "");
  const museum = museums.find((m) => m.id === id) ?? museums[0];
  if (!museum) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3 border border-slate-200 bg-white p-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs text-slate-500">計算する施設</span>
          <select
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="min-w-[260px] rounded-none border border-slate-300 bg-white px-3 py-2 text-slate-ink focus:border-forest focus:outline-none"
          >
            {museums.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}（{m.prefecture}）
              </option>
            ))}
          </select>
        </label>
        <Link
          href={`/museums/${museum.id}`}
          className="ml-auto flex items-center gap-1 text-sm font-semibold text-forest hover:underline underline-offset-4"
        >
          {museum.shortName}の詳細レビューを見る
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>
      {/* key で施設切替時に入力をリセット */}
      <CostSimulator key={museum.id} museum={museum} showMobileBar={false} />
      <PlanningLinks museum={museum} />
    </div>
  );
}
