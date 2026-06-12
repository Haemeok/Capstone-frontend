import type { Dictionary } from "../types";

export const ja: Dictionary = {
  search: {
    lastPage: "レシピをすべて見ました。",
    noResults: "レシピが見つかりませんでした。",
  },
  meta: {
    search: {
      queryNoun: "レシピ",
      pageSuffix: "（{page}ページ目）",
      titleNoQuery: "レシピ検索結果{page} - レシピオ",
      titleWithQuery: {
        one: "{q} {count}件のレシピ{page} - レシピオ",
        other: "{q} {count}件のレシピ{page} - レシピオ",
      },
      descNoQuery:
        "フィルターでお好みのレシピを探せます。食材費・カロリー・調理時間をまとめて比較。",
      descWithQuery: {
        one: "{q} {count}件をまとめてチェック。食材費から栄養成分まで一目で比較できます。",
        other:
          "{q} {count}件をまとめてチェック。食材費から栄養成分まで一目で比較できます。",
      },
    },
  },
  errors: {
    sectionGeneric: "このセクションを読み込めませんでした",
    video: "動画を読み込めませんでした",
    comments: "コメントを読み込めませんでした",
    ingredients: "材料情報を読み込めませんでした",
    steps: "調理手順を読み込めませんでした",
    searchResults: "検索結果を表示できませんでした",
  },
  notFound: {
    message: "レシピが見つかりませんでした。",
    searchCta: "レシピを探す",
  },
  recipeDetail: {
    ingredientsHeader: "材料",
    nutritionHeader: "栄養成分",
    copyAction: "コピー",
    reportAction: "修正提案",
    nutritionSodium: "ナトリウム",
    nutritionCarbs: "炭水化物",
    nutritionProtein: "たんぱく質",
    nutritionFat: "脂質",
    nutritionSugar: "糖質",
    servingsDecrease: "人数を減らす",
    servingsIncrease: "人数を増やす",
    cookingTimeLabel: "調理時間",
    servingsLabel: "人分",
    cookingToolsLabel: "調理器具",
    noInfo: "情報なし",
    aiYoutubeBadge: "YouTubeの動画からAIが抽出したレシピです（Beta）",
    aiAssistedBadge: "AIのサポートにより作成されたレシピです",
    platingGuide: "盛り付けガイド",
    subscriberLabel: "チャンネル登録者",
    subscribeAction: "登録する",
    pinVideo: "動画を固定",
    unpinVideo: "固定を解除",
    originalVideo: "元の動画",
    videoDisclosure:
      "この動画はYouTube公式プレーヤーで再生されます。再生回数と収益は100%オリジナルクリエイターに還元されます。",
    coupangDisclosure:
      "本記事はCoupang Partnersの活動の一環として、所定の手数料を受け取る場合があります。",
    commentsReadMore: "もっと見る",
    commentsWrite: "コメントを書く",
    recommendedTitle: "こんなレシピはいかがですか？",
    recommendedChefTitle: "シェフのレシピをもっと見る",
    remixesTitle: "このレシピのアレンジ",
  },
};
