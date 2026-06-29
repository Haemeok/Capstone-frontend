import type { Locale } from "@/shared/i18n/types";

export type User = {
  id: string;
  nickname: string;
  email?: string;
  introduction?: string;
  profileImage: string;
  username?: string;
  bookmarks?: number;
  likes?: number;
  surveyCompleted?: boolean;
  hasFirstRecord: boolean;
  remainingAiQuota: number;
  remainingYoutubeQuota: number;
  preferredLocale?: Locale;
  adStatus?: {
    showAds: boolean;
    adFreeUntil: string | null;
  };
};

export type RawUserResponse = Omit<
  User,
  "remainingAiQuota" | "remainingYoutubeQuota"
> & {
  remainingAiQuota?: number;
  remainingAiGenerationQuota?: number;
  remainingYoutubeQuota?: number;
  remainingYoutubeExtractionCredits?: number;
};

export type UserStreak = {
  streak: number;
  cookedToday: boolean;
};

export type RecipeHistoryItem = {
  recipeId: string;
  recipeTitle: string;
  savings: number;
  imageUrl: string;
};

export type RecipeDailySummary = {
  date: string;
  totalSavings: number;
  totalCount: number;
  firstImageUrl: string;
};

export type PutUserInfoPayload = {
  nickname?: string;
  introduction?: string;
  profileImageKey?: string;
};

export type RecipeHistoryResponse = {
  dailySummaries: RecipeDailySummary[];
  monthlyTotalSavings: number;
};
