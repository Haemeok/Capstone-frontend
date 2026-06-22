import type { CommonDict } from "../../types";

export const common: CommonDict = {
  readMore: "続きを読む",
  collapse: "閉じる",
  readMoreAria: "本文をすべて表示",
  collapseAria: "本文を折りたたむ",
  loginRequired: "ログインが必要です。",
  actions: {
    save: "保存",
    unsave: "保存を解除",
    like: "いいね",
    unlike: "いいねを取り消す",
    share: "シェア",
    shareLabel: "シェア",
    close: "閉じる",
    back: "戻る",
    edit: "編集",
    remix: "アレンジ",
    editRecipeAria: "レシピを編集",
    remixRecipeAria: "レシピをアレンジ",
    recipeOptions: "レシピのオプション",
  },
  modal: {
    delete: {
      description: "削除すると元に戻せません。",
      cancel: "キャンセル",
      confirm: "削除",
    },
    unsavedChanges: {
      title: "保存せずに移動しますか？",
      description: "編集中の内容は保存されません。",
      cancel: "キャンセル",
      leave: "破棄して移動",
    },
  },
  sort: { title: "並び替え", reset: "リセット", apply: "完了" },
  toast: {
    logout: {
      pending: "ログアウト中...",
      error: "ログアウトに失敗しました: {message}",
    },
    deleteAccount: {
      pending: "アカウントを削除中...",
      success: "アカウントを削除しました。",
      error: "アカウントの削除に失敗しました: {message}",
    },
  },
  errors: { unknown: "不明なエラーが発生しました。" },
};
