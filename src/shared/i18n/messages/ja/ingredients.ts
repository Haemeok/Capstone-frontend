import type { IngredientsDict } from "../../types";

export const ingredients: IngredientsDict = {
  headerLoggedIn: "{nickname}さんの冷蔵庫",
  headerLoggedOut: "ログインして冷蔵庫を管理しましょう",
  fabFindRecipes: "冷蔵庫の食材でレシピを探す",
  actions: {
    delete: "削除",
    addIngredient: "食材を追加",
    selectAll: "すべて選択",
    cancel: "キャンセル",
    done: "完了",
  },
  deleteFab: {
    one: "{count}件選択 · 食材を削除",
    other: "{count}件選択 · 食材を削除",
  },
  error: { prefix: "エラーが発生しました", unknown: "不明なエラー" },
  empty: {
    heading: "登録された食材がありません",
    bodyLine1: "冷蔵庫に食材を追加して",
    bodyLine2: "おすすめレシピを受け取りましょう",
    cta: "食材を追加する",
  },
  loginCta: {
    aiHeading: "AIがレシピをおすすめします",
    aiBody: "冷蔵庫に残った食材で、AIと一緒におすすめレシピを作成できます",
    searchHeading: "食材からレシピを検索",
    searchBody:
      "冷蔵庫の食材を登録すると、手持ちの食材で作れるレシピが見つかります",
    loginButton: "ログインして始める",
    signupNote: "登録すると毎日無料のAIレシピ作成チケットがもらえます",
    searchAlt: "レシピ検索",
  },
  itemAria: { select: "{name}を選択", detail: "{name}の詳細を見る" },
};
