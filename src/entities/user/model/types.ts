export type User = {
  id: number;
  nickname: string;
  email?: string;
  introduction?: string;
  profileImage: string;
  username?: string;
  bookmarks?: number;
  likes?: number;
};

export type UserStreak = {
  streak: number;
  cookedToday: boolean;
};

export type RecipeHistoryItem = {
  recipeId: number;
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

export type RecipeHistoryDetailResponse = {
  savings: number;
  recipeId: number;
  recipeTitle: string;
  imageUrl: string;
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
