/**
 * SNS 埋め込み設定
 * ------------------------------------------------------------
 * 各SNSの「埋め込み」機能でコピーしたコードを embeds に貼るだけで表示されます。
 *
 * - X（旧Twitter）: 投稿の「…」→「ポストを埋め込む」→ コードをコピー
 * - Instagram: 投稿の「…」→「埋め込み」→ コードをコピー
 *
 * <script> タグは貼ってもかまいません（自動で読み込みます）。
 * accounts には公式アカウントのURLを入れると、フォローボタンとして表示されます。
 */

export interface SocialConfig {
  accounts: { label: string; url: string }[];
  embeds: string[];
}

export const MUSEUM_SOCIAL: Record<string, SocialConfig> = {
  fukui: { accounts: [], embeds: [] },
  kahaku: { accounts: [], embeds: [] },
  gunma: { accounts: [], embeds: [] },
  mukawa: { accounts: [], embeds: [] },
  mifune: { accounts: [], embeds: [] },
  nagasaki: { accounts: [], embeds: [] },
  kanna: { accounts: [], embeds: [] },
  tamba: { accounts: [], embeds: [] },
};

export function getMuseumSocial(id: string): SocialConfig {
  return MUSEUM_SOCIAL[id] ?? { accounts: [], embeds: [] };
}
