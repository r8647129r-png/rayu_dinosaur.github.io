import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AFFILIATE_IDS } from "@/config/affiliates";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "恐竜博物館 滞在費ガイド｜入館料・館内グルメ・お土産まで現地費用を計算",
    template: "%s｜恐竜博物館 滞在費ガイド",
  },
  description:
    "全国の恐竜博物館の入館料・化石発掘体験・館内レストランのメニュー価格・お土産予算から、家族の現地滞在費をリアルタイムで計算。施設ごとの本音レビューと攻略メモも掲載。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white font-sans">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        {AFFILIATE_IDS.valuecommerceLinkSwitchPid && (
          <>
            {/* バリューコマース LinkSwitch：提携済み広告主へのリンクを自動でアフィリエイト化 */}
            <Script id="vc-linkswitch-pid" strategy="afterInteractive">
              {`var vc_pid = "${AFFILIATE_IDS.valuecommerceLinkSwitchPid}";`}
            </Script>
            <Script src="https://aml.valuecommerce.com/vcdal.js" strategy="afterInteractive" />
          </>
        )}
      </body>
    </html>
  );
}
