import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { getEvents } from "@/lib/events";
import EventsSection from "@/components/EventsSection";
import SectionHeading from "@/components/SectionHeading";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "全国の恐竜展・化石イベント情報",
  description: "全国の恐竜展・特別展・化石発掘体験イベントの開催期間、会場、エリアを一覧で確認できます。",
};

export default async function EventsPage() {
  const events = await getEvents(20);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        icon={CalendarDays}
        title="全国の恐竜展・化石イベント情報"
        lead="会期・料金は変更される場合があります。お出かけ前に公式サイトでご確認ください。"
      />
      <EventsSection data={events} newsLimit={20} />
    </div>
  );
}
