import type { ReferralDict } from "../../types";

export const referral: ReferralDict = {
  giftAria: "友だち招待キャンペーン",
  adFreeLabel: "広告なしで利用中",
  adFreeUntil: "{date}まで",
  daysLeft: { one: "残り{n}日", other: "残り{n}日" },
  endsToday: "本日まで",
  sheetTitle: "友だち招待キャンペーン",
  sheetTitleWithMonth: "{month}月 友だち招待キャンペーン",
  description:
    "友だちを招待すると、お二人とも1か月間広告なしでRecipioをお使いいただけます。招待した友だちが多いほど特典が増えていきます。",
  myCodeLabel: "あなたの招待コード",
  copyAria: "招待コードをコピー",
  copyAction: "コピー",
  copiedToast: "招待コードをコピーしました。",
  inputLabel: "友だちの招待コードを入力",
  inputPlaceholder: "招待コード",
  inputAria: "友だちの招待コード",
  applyAction: "適用",
  loadError: "情報を読み込めませんでした。",
  retry: "再試行",
  referredBy: "{nickname}さんの紹介で登録しました。",
  rewardLimit:
    "今回のキャンペーンでの追加特典はすべて受け取り済みですが、友だちは引き続き特典を受け取れます。",
  redeemSuccessToast: "広告の非表示が{date}まで適用されました。",
  status: {
    ALREADY_REDEEMED: "すでに紹介者を入力済みです。",
    NOT_ELIGIBLE_OLD_USER:
      "キャンペーン開始後にご登録された方のみ入力できます。",
    REDEEM_WINDOW_EXPIRED: "紹介者の入力期間が終了しました。",
    NO_ACTIVE_CAMPAIGN: "現在開催中の招待キャンペーンはありません。",
  },
};
