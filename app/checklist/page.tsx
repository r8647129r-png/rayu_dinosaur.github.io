import type { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import Checklist from "@/components/Checklist";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "恐竜博物館 お出かけ前チェックリスト",
  description: "チケット予約・発掘体験の予約・持ち物など、恐竜博物館へ行く前の準備をチェックできます。",
};

export default function ChecklistPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        icon={ClipboardCheck}
        title="お出かけ前チェックリスト"
        lead="チェック状態はこのブラウザに保存されます。"
      />
      <Checklist />
    </div>
  );
}
