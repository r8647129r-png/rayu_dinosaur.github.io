import { NextResponse } from "next/server";
import { getEvents } from "@/lib/events";

// ISR: 1時間ごとにキャッシュを再生成
export const revalidate = 3600;

export async function GET() {
  try {
    const data = await getEvents(20);
    return NextResponse.json(data);
  } catch {
    const { FALLBACK_EVENTS } = await import("@/data/events");
    return NextResponse.json({
      curated: FALLBACK_EVENTS,
      news: [],
      newsStatus: "fallback",
      fetchedAt: new Date().toISOString(),
    });
  }
}
