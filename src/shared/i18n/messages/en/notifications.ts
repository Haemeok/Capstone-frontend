import type { NotificationsDict } from "../../types";

export const notifications: NotificationsDict = {
  title: "Notifications",
  deleteAll: "Delete all",
  empty: "No notifications.",
  allLoaded: "You're all caught up.",
  loadingMore: "Loading more...",
  deleteAria: "Delete notification",
  profileAlt: "{name}'s profile",
  templates: {
    NEW_COMMENT: "{actor} commented on your recipe.",
    NEW_REPLY: "{actor} replied to your comment.",
    AI_RECIPE_DONE: "Your AI recipe is ready.",
    NEW_FAVORITE: "{actor} saved your recipe.",
    NEW_RECIPE_LIKE: "{actor} liked your recipe.",
    NEW_COMMENT_LIKE: "{actor} liked your comment.",
    NEW_RECIPE_RATING: "{actor} rated your recipe.",
    REFERRAL_REWARD_GRANTED: "You earned ad-free time from a referral.",
  },
  genericMessage: "You have a new notification.",
};
