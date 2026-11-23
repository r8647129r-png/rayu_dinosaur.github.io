import Link from "next/link";
import { Calculator, CalendarDays, ClipboardCheck, Library, ArrowRight } from "lucide-react";
import { MUSEUMS } from "@/data/museums";
import { getEvents } from "@/lib/events";
import { applyLiveFees, getLiveFees } from "@/lib/liveFees";
import MuseumExplorer from "@/components/MuseumExplorer";
import QuickSimulator from "@/components/QuickSimulator";
import EventsSection from "@/components/EventsSection";
import Checklist from "@/components/Checklist";
import SectionHeading from "@/components/SectionHeading";

export const revalidate = 3600;

export default async function HomePage() {
  const [events, lives] = await Promise.all([getEvents(), Promise.all(MUSEUMS.map(getLiveFees))]);
  const liveMuseums = MUSEUMS.map((m, i) => applyLiveFees(m, lives[i]));
  const specialActive = Object.fromEntries(MUSEUMS.map((m, i) => [m.id, !!lives[i].specialActive]));

  return (
    <>
      <section className="border-b border-slate-200 bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <p className="text-xs font-semibold tracking-widest text-forest">DINOSAUR MUSEUM COST GUIDE</p>
          <h1 className="mt-3 text-2xl font-bold leading-snug text-slate-ink md:text-4xl">
            恐竜博物館の「現地でいくらかかるか」を、
            <br className="hidden md:block" />
            家族の人数で正確に。
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            入館料だけでなく、化石発掘体験・館内レストランのメニュー・お土産まで積み上げて試算。
            全国{MUSEUMS.length}施設の料金と本音レビューを横並びで比較できます。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#simulator"
              className="flex items-center gap-2 rounded-sm bg-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark"
            >
              <Calculator className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              滞在費を計算する
            </Link>
            <Link
              href="#museums"
              className="flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-ink hover:border-forest hover:text-forest"
            >
              施設を比較する
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12">
        <section>
          <SectionHeading
            id="museums"
            icon={Library}
            title="全国の恐竜博物館・レビュー一覧"
            lead="エリアと条件で絞り込み。評価は展示・発掘体験・グルメ・子連れ快適度の独自5段階です。"
          />
          <MuseumExplorer museums={liveMuseums} />
        </section>

        <section>
          <SectionHeading
            id="simulator"
            icon={Calculator}
            title="クイック滞在費シミュレーター"
            lead="施設を選び、人数・体験・食べたいメニュー・お土産を入れるだけで合計金額を表示します。"
          />
          <p className="mb-4 text-xs text-slate-500">入館料は各館の公式サイトから6時間ごとに自動で取得しています。</p>
          <QuickSimulator museums={liveMuseums} specialActive={specialActive} />
        </section>

        <section>
          <SectionHeading
            id="events"
            icon={CalendarDays}
            title="特別展・化石イベント情報"
            lead="注目イベントと、恐竜展・化石関連の最新ニュースをまとめています。"
          />
          <EventsSection data={events} />
          <Link
            href="/events"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline underline-offset-4"
          >
            イベント情報をすべて見る
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </Link>
        </section>

        <section>
          <SectionHeading
            id="checklist"
            icon={ClipboardCheck}
            title="お出かけ前チェックリスト"
            lead="チェック内容はブラウザに保存されるので、当日まで何度でも見返せます。"
          />
          <Checklist />
        </section>
      </div>
    </>
  );
}
