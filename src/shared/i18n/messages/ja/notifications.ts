import type { NotificationsDict } from "../../types";

export const notifications: NotificationsDict = {
  title: "お知らせ",
  deleteAll: "すべて削除",
  empty: "お知らせはありません。",
  allLoaded: "すべてのお知らせを読み込みました。",
  loadingMore: "Loading more...",
  deleteAria: "お知らせを削除",
  profileAlt: "{name} のプロフィール",
  templates: {
    NEW_COMMENT: "{actor}さんがコメントしました。",
    NEW_REPLY: "{actor}さんが返信しました。",
    AI_RECIPE_DONE: "AIレシピの生成が完了しました。",
    NEW_FAVORITE: "{actor}さんが保存しました。",
    NEW_RECIPE_LIKE: "{actor}さんがレシピにいいねしました。",
    NEW_COMMENT_LIKE: "{actor}さんがコメントにいいねしました。",
    NEW_RECIPE_RATING: "{actor}さんがレシピを評価しました。",
    REFERRAL_REWARD_GRANTED: "紹介特典として広告非表示が追加されました。",
  },
  genericMessage: "新しいお知らせがあります。",
};
