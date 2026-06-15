import type { RatingsDict } from "../../types";

export const ratings: RatingsDict = {
  empty: "まだ評価が少なめです。評価を残してみませんか？",
  summary: "{count}人が平均 {value} 点をつけました！",
  form: {
    cancel: "キャンセル",
    title: "評価する",
    prompt: "{recipeName}を作ってみましたか？",
    promptCta: "評価をお願いします！",
    feedbackHint:
      "コミュニティのために、レシピの感想やコツをぜひ共有してください。あなたの経験がきっと誰かの役に立ちます！",
    placeholderExample:
      "例）とても美味しかったです！ハチミツを少し加えたら風味がぐっと良くなりました。",
    submit: "評価を送信",
    successToast: "評価を登録しました。",
    profileAlt: "プロフィール画像",
  },
};
