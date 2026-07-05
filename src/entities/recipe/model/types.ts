import { PageResponse, SliceResponse } from "@/shared/api/types";

import { Comment } from "@/entities/comment";
import { IngredientItem, IngredientPayload } from "@/entities/ingredient";
import { User } from "@/entities/user";

export type Visibility = "PUBLIC" | "PRIVATE" | "RESTRICTED";
export type RecipeSource = "USER" | "AI" | "YOUTUBE" | "REELS";

export type RecipeYoutubeMeta = {
  url: string;
  channelName?: string;
  videoTitle?: string;
  thumbnailUrl?: string;
  channelProfileUrl?: string;
  subscriberCount?: number;
  channelId?: string;
};
export type CreatorCountryTag = "KR" | "JP" | "US" | "OTHER";
export type ImageStatus = "PENDING" | "READY" | "FAILED";

export type IngredientCalculationSummary = {
  totalCalories: number;
  totalIngredientCost: number;
  totalCarbohydrate?: number;
  totalProtein?: number;
  totalFat?: number;
  totalSugar?: number;
  totalSodium?: number;
  mappedCount: number;
  partialCount: number;
  unresolvedCount: number;
  customCount: number;
  calculatedCount: number;
  pendingCount: number;
};

export type BaseRecipesApiResponse = SliceResponse<BaseRecipeGridItem>;
export type DetailedRecipesApiResponse = SliceResponse<DetailedRecipeGridItem>;
export type StaticDetailedRecipesApiResponse =
  SliceResponse<StaticDetailedRecipeGridItem>;
export type IngredientRecipesApiResponse =
  PageResponse<IngredientRecipeGridItem>;

export type TrendingYoutubeRecipe = {
  title: string;
  videoId: string;
  channelName: string;
  thumbnailUrl: string;
  viewCount: number;
  videoUrl: string;
};

export type BaseRecipeGridItem = {
  id: string;
  title: string;
  imageUrl: string;
  authorName: string;
  authorId: string;
  profileImage: string;
  cookingTime?: number;
  createdAt: string;
  favoriteByCurrentUser: boolean;
  visibility?: Visibility;
  source?: RecipeSource;
};

export type DetailedRecipeGridItem = BaseRecipeGridItem & {
  avgRating: number;
  ratingCount: number;
  marketPrice?: number;
  ingredientCost?: number;
  youtubeChannelName?: string;
  favoriteCount?: number;
  youtubeVideoViewCount?: number;
  tags?: string[];
  youtubeExtractorId?: string;
  youtubeExtractorName?: string;
  youtubeExtractorProfileImage?: string;
  creatorCountryTag?: CreatorCountryTag | null;
  isRemix?: boolean;
};

export type StaticDetailedRecipeGridItem = Omit<
  DetailedRecipeGridItem,
  "favoriteByCurrentUser"
>;

export type IngredientRecipeGridItem = DetailedRecipeGridItem & {
  matchedIngredients: string[];
};

// ========== My Fridge Page Types ==========

// my-fridge 전용 페이지 응답 (Spring Boot Page 구조)
export type MyFridgePageResponse<T> = {
  content: T[];
  number: number;
  size: number;
  last: boolean;
};

// 빠진 재료 타입
export type MissingIngredient = {
  name: string;
  coupangLink?: string;
};

// my-fridge 레시피 아이템 (빠진 재료 포함)
export type MyFridgeRecipeItem = IngredientRecipeGridItem & {
  missingIngredients: MissingIngredient[];
};

export type Recipe = {
  id: string;
  title: string;
  dishType: string;
  description: string;
  cookingTime: number;
  imageUrl: string;
  youtube?: RecipeYoutubeMeta;
  extractorId?: string | null;
  cookingTools: string[];
  servings: number;
  totalIngredientCost: number;
  marketPrice: number;
  imageKey?: string | null;
  ratingInfo: RatingInfo;
  ingredients: Omit<IngredientItem, "inFridge">[];
  steps: RecipeStep[];
  tags: string[];
  comments: Comment[];
  author: User;
  likeCount: number;
  likedByCurrentUser: boolean;
  favoriteByCurrentUser: boolean;
  visibility?: Visibility;
  source: RecipeSource;
  creatorCountryTag?: CreatorCountryTag | null;
  ingredientCalculationSummary?: IngredientCalculationSummary;
  totalCalories: number;
  createdAt?: string;
  nutrition: Nutrition;
  cookingTips?: string;
  favoriteCount?: number;
  youtubeVideoViewCount?: number;
  fineDiningInfo?: {
    components: RecipeComponent[];
    plating: {
      vessel: string;
      guide: string;
    };
  };
  isCloneable: boolean;
  isIndexed?: boolean;
};

export type RawRecipeResponse = Omit<Recipe, "source" | "youtube"> & {
  source?: RecipeSource;
  youtubeUrl?: string;
  youtubeChannelName?: string;
  youtubeVideoTitle?: string;
  youtubeThumbnailUrl?: string;
  youtubeChannelProfileUrl?: string;
  youtubeSubscriberCount?: number;
  youtubeChannelId?: string;
};

export type RecipeComponent = {
  role: "Main" | "Sauce" | "Garnish" | "Accent" | "Crunch" | "Pickle/Gel";
  name?: string;
  description?: string;
};

export type Nutrition = {
  protein: number;
  carbohydrate: number;
  fat: number;
  sugar: number;
  sodium: number;
};

export type RatingInfo = {
  avgRating: number;
  myRating: number;
  ratingCount: number;
};

export type RecipeStep = {
  stepNumber: number;
  instruction: string;
  stepImageUrl: string;
  action?: string;
  timeline?: string;
  ingredients?: IngredientItem[];
  stepImageKey?: string | null;
};

export const defaultRecipeKeys = [
  "id",
  "ingredients",
  "steps",
  "totalIngredientCost",
  "marketPrice",
  "youtubeUrl",
  "author",
  "likeCount",
  "likedByCurrentUser",
  "favoriteByCurrentUser",
  "ratingInfo",
  "comments",
  "imageUrl",
  "imageKey",
  "totalCalories",
  "nutrition",
  "isCloneable",
] as const;

export type RecipePayload = Omit<
  Recipe,
  (typeof defaultRecipeKeys)[number] | "youtube" | "source"
> & {
  ingredients: IngredientPayload[];
  steps: RecipeStepPayload[];
  cookingTime: number;
  servings: number;
  imageKey?: string | null;
  originRecipeId?: string;
  youtubeUrl?: string;
  source?: RecipeSource;
};

export type RecipeStepPayload = Omit<
  RecipeStep,
  "stepImageUrl" | "action" | "ingredients" | "imageKey"
> & {
  ingredients: IngredientPayload[];
  imageKey?: string;
};

export type NutritionRangeParams = {
  minCalories?: number;
  maxCalories?: number;
  minCarb?: number;
  maxCarb?: number;
  minProtein?: number;
  maxProtein?: number;
  minFat?: number;
  maxFat?: number;
  minSugar?: number;
  maxSugar?: number;
  minSodium?: number;
  maxSodium?: number;
};

export type RecipeQueryParams = NutritionRangeParams & {
  page?: number;
  size?: number;
  sort: string;
  q?: string;
  dishType?: string | null;
  tags?: string[] | null;
  isAiGenerated?: boolean;
  types?: string[];
  maxCost?: number;
  minCost?: number;
  period?: "weekly" | "monthly";
  pageParam?: number;
  ingredientIds?: string[];
  creatorCountryTags?: CreatorCountryTag[];
  lang?: "ja" | "en";
};

export type RecipeItemsQueryParams = NutritionRangeParams & {
  key: string;
  page?: number;
  sort?: string;
  isAiGenerated?: boolean;
  tags?: string[];
  q?: string;
  dishType?: string | null;
  maxCost?: number;
  minCost?: number;
  period?: "weekly" | "monthly";
  recipeId?: string;
  types?: string[];
  ingredientIds?: string[];
  creatorCountryTags?: CreatorCountryTag[];
  lang?: "ja" | "en";
};

export type StaticRecipe = Omit<
  Recipe,
  "likeCount" | "likedByCurrentUser" | "favoriteByCurrentUser" | "comments"
> & {
  comments: Omit<Comment, "likedByCurrentUser" | "likeCount">[];
};

export type RecipeStatus = {
  likeCount: number;
  favoriteCount?: number;
  likedByCurrentUser: boolean;
  favoriteByCurrentUser: boolean;
  myRating: number | null;
  comments: Array<{
    id: string;
    likedByCurrentUser: boolean;
    likeCount: number;
  }>;
  ingredientIdsInFridge: string[];
  clonedByMe: boolean;
  remixCount: number;
};

export type RecipeListItemStatus = {
  likedByCurrentUser: boolean;
  favoriteByCurrentUser: boolean;
};

export type RecipesStatusResponse = Record<string, RecipeListItemStatus>;

export type StaticRecipeListResponse = {
  content: StaticDetailedRecipeGridItem[];
};

export type CookedPopularResponse = StaticRecipeListResponse;

export type CookedAgainResponse = StaticRecipeListResponse;

export type SameIngredientResponse = StaticRecipeListResponse & {
  ingredientName: string | null;
};

export type TitleKeywordResponse = StaticRecipeListResponse & {
  keyword: string | null;
};

export type FridgeIngredientPopularResponse = SameIngredientResponse;

export type CountryPopularCode = "US" | "JP";

export type CountryPopularResponse = StaticRecipeListResponse & {
  countryCode: CountryPopularCode;
  countryName: string;
};

export type SeasonalPopularResponse = StaticRecipeListResponse & {
  seasonalIngredientName: string | null;
};

export type QuickPopularResponse = StaticRecipeListResponse & {
  maxCookingTime: number;
};

export type CategoryCode =
  | "RICE"
  | "NOODLE"
  | "MEAT"
  | "SEAFOOD"
  | "SOUP"
  | "DESSERT";

export type CategoryPopularResponse = StaticRecipeListResponse & {
  categoryCode: CategoryCode;
};

export type YoutubeVerifiedResponse = StaticRecipeListResponse;

export type MyRecipeListItem = {
  id: string;
  title: string;
  imageUrl: string;
  dishType: string;
  type: RecipeSource;
  createdAt: string;
  likedByCurrentUser: boolean;
  visibility?: Visibility;
  imageStatus?: ImageStatus;
};

export type MyRecipesPageResponse = SliceResponse<MyRecipeListItem>;
