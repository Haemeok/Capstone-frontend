import type { IngredientsDict } from "../../types";

export const ingredients: IngredientsDict = {
  title: "マイ冷蔵庫",
  ownedCount: "{count}品の食材を保管しています",
  ownedCountLoading: "食材数を読み込んでいます",
  ownedCountUnavailable: "食材数を読み込めませんでした",
  addEntry: "食材を検索して追加しましょう",
  categoryGroup: "食材カテゴリー",
  fabFindRecipes: "冷蔵庫の食材でレシピを探す",
  actions: {
    manage: "管理",
    delete: "削除",
    addIngredient: "食材を追加",
    selectAll: "すべて選択",
    cancel: "キャンセル",
    done: "完了",
  },
  deleteFab: {
    one: "{count}品選択 · 食材を削除",
    other: "{count}品選択 · 食材を削除",
  },
  error: { prefix: "エラーが発生しました", unknown: "不明なエラー" },
  empty: {
    heading: "登録された食材がありません",
    bodyLine1: "冷蔵庫に食材を追加して",
    bodyLine2: "おすすめレシピを受け取りましょう",
    cta: "食材を追加する",
  },
  loginCta: {
    title: "マイ冷蔵庫",
    body: "ログインすると、食材をまとめて管理して冷蔵庫に合うレシピを探せます。",
    loginButton: "ログインして始める",
  },
  itemAria: { select: "{name}を選択", detail: "{name}の詳細を見る" },
};
