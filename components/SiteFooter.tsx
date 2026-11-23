import { DISCLOSURE_TEXT } from "@/config/affiliates";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-paper">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-10 text-xs leading-relaxed text-slate-500">
        <p>
          掲載している料金・メニュー・営業時間は調査時点の目安です。改定や特別展の開催により変動するため、
          お出かけ前に必ず各施設の公式サイトでご確認ください。
        </p>
        <p>{DISCLOSURE_TEXT}</p>
        <p className="text-slate-400">&copy; {new Date().getFullYear()} 恐竜博物館 滞在費ガイド</p>
      </div>
    </footer>
  );
}
