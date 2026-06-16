import type {
  ErrorsDict,
  MetaDict,
  NotFoundDict,
  SearchDict,
} from "../../types";

export const search: SearchDict = {
  lastPage: "レシピをすべて見ました。",
  noResults: "レシピが見つかりませんでした。",
};

export const meta: MetaDict = {
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
};

export const errors: ErrorsDict = {
  sectionGeneric: "このセクションを読み込めませんでした",
  video: "動画を読み込めませんでした",
  comments: "コメントを読み込めませんでした",
  ingredients: "材料情報を読み込めませんでした",
  steps: "調理手順を読み込めませんでした",
  searchResults: "検索結果を表示できませんでした",
  heading: "問題が発生しました",
  retry: "再試行",
  goHome: "ホームへ",
  goBack: "戻る",
  sectionMessage: "この部分を読み込めませんでした",
  sectionRetry: "再試行",
  context: {
    recipe: "レシピを読み込めませんでした",
    search: "検索結果を読み込めませんでした",
    ingredients: "食材情報を読み込めませんでした",
    edit: "レシピ編集ページを読み込めませんでした",
    calendar: "カレンダーを読み込めませんでした",
    generic: "しばらくしてからもう一度お試しください",
  },
};

export const notFound: NotFoundDict = {
  message: "レシピが見つかりませんでした。",
  searchCta: "レシピを探す",
  goBack: "戻る",
  goHome: "ホームへ",
  recipe: {
    title: "存在しないレシピです",
    description:
      "レシピが削除されたか、存在しません。別のレシピを探してみませんか？",
  },
  generic: {
    title: "ページが見つかりません",
    description: "お探しのページは存在しません。",
  },
};
