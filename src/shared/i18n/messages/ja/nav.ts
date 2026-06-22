import type { NavDict } from "../../types";

export const nav: NavDict = {
  home: "ホーム",
  search: "検索",
  fridge: "冷蔵庫",
  aiRecipe: "AIレシピ",
  my: "マイページ",
  recipeSearch: "レシピ検索",
  youtubeRecipe: "YouTubeレシピ",
  login: "ログイン",
  install: "アプリインストール",
  installAria: "アプリをインストール",
  shareAria: "シェア",
  notificationsAria: "通知ページへ移動",
  notificationsUnreadAria: {
    one: "通知ページへ移動（未読{count}件）",
    other: "通知ページへ移動（未読{count}件）",
  },
  unreadBadgeAria: {
    one: "未読の通知{count}件",
    other: "未読の通知{count}件",
  },
  savedBooksAria: "保存したレシピブック",
  savedBooksToast: "保存したレシピブックを見てみましょう！",
  profile: "プロフィール",
  footer: {
    sectionService: "サービス",
    sectionSupport: "カスタマーサポート",
    tagline:
      "AIによるレシピ提案サービス。冷蔵庫の食材だけで美味しい料理を作りましょう。",
    businessInfoToggleAria: "事業者情報を開く",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    reportError: "不具合の報告",
    adInquiry: "広告・提携のお問い合わせ",
    copyrightReport: "著作権侵害の報告・削除依頼",
    ceoLabel: "代表",
    csLabel: "カスタマーセンター",
    adLabel: "広告のお問い合わせ",
  },
};
