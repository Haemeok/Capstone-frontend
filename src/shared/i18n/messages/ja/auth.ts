import type { AuthDict } from "../../types";

export const auth: AuthDict = {
  browseWithoutLogin: "ログインせずに見る",
  dialogTitle: "ログイン",
  recentLogin: "前回ログイン",
  loading: "読み込み中...",
  kakaoLabel: "Kakaoで始める",
  naverLabel: "Naverで始める",
  error: {
    title: "ログインに失敗しました",
    description:
      "ソーシャルログインの認証中に問題が発生しました。しばらくしてからもう一度お試しください。",
    retry: "もう一度ログインする",
  },
};
