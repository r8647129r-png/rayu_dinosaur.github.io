"use client";

import { useMemo, useState } from "react";
import { Calculator, Gift, Pickaxe, RotateCcw, Ticket, Users, UtensilsCrossed } from "lucide-react";
import type { FeeTable, Museum, PriceItem } from "@/data/museums";
import { yen } from "@/lib/format";
import Counter from "./Counter";
import BookingCTA from "./museum/BookingCTA";

type Party = Record<keyof FeeTable, number>;

const PARTY_ROWS: { key: keyof FeeTable; label: string; sub: string }[] = [
  { key: "adult", label: "大人", sub: "一般" },
  { key: "student", label: "高大生", sub: "高校生・大学生" },
  { key: "child", label: "小中学生", sub: "" },
  { key: "preschool", label: "未就学児", sub: "" },
];

const INITIAL_PARTY: Party = { adult: 2, student: 0, child: 1, preschool: 1 };

function Panel({
  icon: Icon,
  title,
  children,
  aside,
}: {
  icon: typeof Users;
  title: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <fieldset className="border border-slate-200 bg-white">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center justify-between border-b border-slate-200 bg-paper px-4 py-2.5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-ink">
          <Icon className="h-4 w-4 text-forest" strokeWidth={1.75} aria-hidden />
          {title}
        </h3>
        {aside}
      </div>
      <div className="px-4 py-3">{children}</div>
    </fieldset>
  );
}

function ItemPicker({
  items,
  qty,
  setQty,
}: {
  items: PriceItem[];
  qty: Record<string, number>;
  setQty: (id: string, v: number) => void;
}) {
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
          <div className="min-w-0">
            <p className="text-sm text-slate-ink">{item.name}</p>
            <p className="text-xs tabular-nums text-slate-500">
              {yen(item.price)}
              {item.estimate ? (
                <span className="ml-1.5 border border-slate-300 px-1 text-[10px] text-slate-500">目安</span>
              ) : (
                "（税込）"
              )}
            </p>
          </div>
          <Counter
            label={item.name}
            value={qty[item.id] ?? 0}
            onChange={(v) => setQty(item.id, v)}
            max={30}
          />
        </li>
      ))}
    </ul>
  );
}

export default function CostSimulator({
  museum: m,
  showMobileBar = true,
  defaultSpecial = false,
  showBooking = true,
}: {
  museum: Museum;
  showMobileBar?: boolean;
  /** 企画展開催中なら true（公式サイトから自動判定） */
  defaultSpecial?: boolean;
  /** 試算結果の下に予約導線を表示する */
  showBooking?: boolean;
}) {
  const [party, setParty] = useState<Party>(INITIAL_PARTY);
  const [useSpecial, setUseSpecial] = useState(defaultSpecial && !!m.specialExhibit);
  const [digAdult, setDigAdult] = useState(0);
  const [digChild, setDigChild] = useState(0);
  const [food, setFood] = useState<Record<string, number>>({});
  const [gifts, setGifts] = useState<Record<string, number>>({});
  const [customGift, setCustomGift] = useState("");
  const [customFood, setCustomFood] = useState("");

  const totalPeople = party.adult + party.student + party.child + party.preschool;
  const fees = useSpecial && m.specialExhibit ? m.specialExhibit.fees : m.fees;

  const result = useMemo(() => {
    const admissionLines = PARTY_ROWS.map((r) => ({
      label: r.label,
      count: party[r.key],
      unit: fees[r.key],
      subtotal: party[r.key] * fees[r.key],
    })).filter((l) => l.count > 0);
    const admission = admissionLines.reduce((s, l) => s + l.subtotal, 0);

    const dig = m.dig.price
      ? Math.min(digAdult, party.adult + party.student) * m.dig.price.adult +
        Math.min(digChild, party.child + party.preschool) * m.dig.price.child
      : 0;
    const toYen = (v: string) => Math.max(0, Math.floor(Number(v) || 0));
    const sumItems = (items: PriceItem[], q: Record<string, number>) =>
      items.reduce((s, i) => s + (q[i.id] ?? 0) * i.price, 0);
    const foodTotal = sumItems(m.restaurant.menu, food) + toYen(customFood);
    const giftItems = sumItems(m.souvenirs, gifts);
    const giftTotal = giftItems + toYen(customGift);
    const extras = dig + foodTotal + giftTotal;

    return { admissionLines, admission, dig, foodTotal, giftTotal, extras, total: admission + extras };
  }, [party, fees, digAdult, digChild, m, food, gifts, customGift, customFood]);

  const reset = () => {
    setParty(INITIAL_PARTY);
    setUseSpecial(defaultSpecial && !!m.specialExhibit);
    setDigAdult(0);
    setDigChild(0);
    setCustomFood("");
    setFood({});
    setGifts({});
    setCustomGift("");
  };

  const perPerson = totalPeople > 0 ? Math.round(result.total / totalPeople) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* 入力エリア */}
      <div className="space-y-4">
        <Panel
          icon={Users}
          title="人数"
          aside={<span className="text-xs text-slate-500">合計 {totalPeople} 名</span>}
        >
          <ul className="divide-y divide-slate-100">
            {PARTY_ROWS.map((r) => (
              <li key={r.key} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="text-sm text-slate-ink">
                    {r.label}
                    {r.sub && <span className="ml-1 text-xs text-slate-500">{r.sub}</span>}
                  </p>
                  <p className="text-xs tabular-nums text-slate-500">
                    {fees[r.key] === 0 ? "無料" : `${yen(fees[r.key])} / 人`}
                  </p>
                </div>
                <Counter
                  label={r.label}
                  value={party[r.key]}
                  onChange={(v) => setParty((p) => ({ ...p, [r.key]: v }))}
                />
              </li>
            ))}
          </ul>
          {m.specialExhibit && (
            <label className="mt-3 flex cursor-pointer items-start gap-3 border border-slate-200 bg-paper p-3 text-sm">
              <input
                type="checkbox"
                checked={useSpecial}
                onChange={(e) => setUseSpecial(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-forest"
              />
              <span>
                <span className="font-semibold text-slate-ink">{m.specialExhibit.label}料金で計算</span>
                <span className="block text-xs text-slate-500">{m.specialExhibit.note}</span>
              </span>
            </label>
          )}
          <ul className="mt-3 space-y-1 text-xs text-slate-500">
            {m.feeNotes.map((n) => (
              <li key={n}>※ {n}</li>
            ))}
          </ul>
        </Panel>

        <Panel icon={Pickaxe} title="化石発掘・体験">
          <p className="text-sm text-slate-ink">{m.dig.name}</p>
          <p className="mt-1 text-xs text-slate-500">{m.dig.note}</p>
          {m.dig.price ? (
            <ul className="mt-2 divide-y divide-slate-100 border-t border-slate-100">
              {[
                { label: "参加人数（大人・高大生）", unit: m.dig.price.adult, value: digAdult, set: setDigAdult, max: party.adult + party.student },
                { label: "参加人数（小中学生以下）", unit: m.dig.price.child, value: digChild, set: setDigChild, max: party.child + party.preschool },
              ].map((r) => (
                <li key={r.label} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="text-sm text-slate-ink">{r.label}</p>
                    <p className="text-xs tabular-nums text-slate-500">{r.unit === 0 ? "無料" : `${yen(r.unit)} / 人`}</p>
                  </div>
                  <Counter label={r.label} value={Math.min(r.value, r.max)} onChange={r.set} max={r.max} />
                </li>
              ))}
            </ul>
          ) : (
            m.dig.available && (
              <p className="mt-2 border-t border-slate-100 pt-2 text-xs text-slate-500">
                料金は公式に記載がないため、施設へ確認のうえ「その他」に入力してください。
              </p>
            )
          )}
        </Panel>

        <Panel
          icon={UtensilsCrossed}
          title={m.restaurant.inHouse ? `館内グルメ（${m.restaurant.name}）` : `お食事（${m.restaurant.name}）`}
          aside={<span className="text-xs tabular-nums text-slate-500">{yen(result.foodTotal)}</span>}
        >
          <p className="mb-1 text-xs text-slate-500">{m.restaurant.note}</p>
          {m.restaurant.menu.length > 0 && (
            <ItemPicker
              items={m.restaurant.menu}
              qty={food}
              setQty={(id, v) => setFood((f) => ({ ...f, [id]: v }))}
            />
          )}
          <label className="mt-2 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
            <span className="text-slate-ink">
              {m.restaurant.menu.length > 0 ? "その他の飲食（任意金額）" : "食事予算（周辺・持参など）"}
            </span>
            <span className="flex items-center gap-1">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={100}
                value={customFood}
                onChange={(e) => setCustomFood(e.target.value)}
                placeholder="0"
                aria-label="飲食の任意金額"
                className="w-28 rounded-none border border-slate-300 px-2 py-1.5 text-right tabular-nums focus:border-forest focus:outline-none"
              />
              <span className="text-slate-500">円</span>
            </span>
          </label>
        </Panel>

        <Panel
          icon={Gift}
          title="お土産予算"
          aside={<span className="text-xs tabular-nums text-slate-500">{yen(result.giftTotal)}</span>}
        >
          <ItemPicker
            items={m.souvenirs}
            qty={gifts}
            setQty={(id, v) => setGifts((g) => ({ ...g, [id]: v }))}
          />
          <label className="mt-2 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
            <span className="text-slate-ink">その他（任意金額）</span>
            <span className="flex items-center gap-1">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={100}
                aria-label="お土産の任意金額"
                value={customGift}
                onChange={(e) => setCustomGift(e.target.value)}
                placeholder="0"
                className="w-28 rounded-none border border-slate-300 px-2 py-1.5 text-right tabular-nums focus:border-forest focus:outline-none"
              />
              <span className="text-slate-500">円</span>
            </span>
          </label>
        </Panel>
      </div>

      {/* 結果（スティッキー） */}
      <aside className="lg:sticky lg:top-24 lg:self-start" aria-live="polite">
        <div className="border border-forest bg-white">
          <div className="flex items-center justify-between bg-forest px-4 py-3 text-white">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <Calculator className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              滞在費の試算結果
            </h3>
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1 text-xs text-white/80 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              リセット
            </button>
          </div>
          <div className="space-y-4 px-4 py-4 text-sm">
            <div>
              <p className="flex items-center justify-between font-semibold text-slate-ink">
                <span className="flex items-center gap-1.5">
                  <Ticket className="h-4 w-4 text-forest" strokeWidth={1.75} aria-hidden />
                  入館料小計
                </span>
                <span className="tabular-nums">{yen(result.admission)}</span>
              </p>
              <ul className="mt-1 space-y-0.5 pl-6 text-xs text-slate-500">
                {result.admissionLines.map((l) => (
                  <li key={l.label} className="flex justify-between tabular-nums">
                    <span>
                      {l.label} {yen(l.unit)} × {l.count}
                    </span>
                    <span>{yen(l.subtotal)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <p className="flex items-center justify-between font-semibold text-slate-ink">
                <span>体験・飲食・お土産小計</span>
                <span className="tabular-nums">{yen(result.extras)}</span>
              </p>
              <ul className="mt-1 space-y-0.5 pl-6 text-xs text-slate-500">
                <li className="flex justify-between tabular-nums">
                  <span>発掘・体験</span>
                  <span>{yen(result.dig)}</span>
                </li>
                <li className="flex justify-between tabular-nums">
                  <span>飲食</span>
                  <span>{yen(result.foodTotal)}</span>
                </li>
                <li className="flex justify-between tabular-nums">
                  <span>お土産</span>
                  <span>{yen(result.giftTotal)}</span>
                </li>
              </ul>
            </div>
            <div className="border-t-2 border-forest pt-3">
              <p className="text-xs text-slate-500">家族全体の合計金額（税込）</p>
              <p className="text-3xl font-bold tabular-nums text-forest">{yen(result.total)}</p>
              <p className="mt-1 text-xs tabular-nums text-slate-500">
                {totalPeople} 名 / 1人あたり約 {yen(perPerson)}
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              交通費・駐車場代は含みません。料金は目安のため、公式サイトで最新情報をご確認ください。
            </p>
          </div>
        </div>
        {showBooking && (
          <BookingCTA museum={m} adults={party.adult + party.student} children={party.child + party.preschool} />
        )}
      </aside>

      {showMobileBar && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-forest bg-white px-4 py-2.5 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between text-sm">
            <span className="text-slate-500">
              入館 {yen(result.admission)} ＋ その他 {yen(result.extras)}
            </span>
            <span className="text-lg font-bold tabular-nums text-forest">{yen(result.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
