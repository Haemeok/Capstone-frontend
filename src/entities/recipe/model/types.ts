import { PageResponse } from "@/shared/api/types";

import { Comment } from "@/entities/comment";
import { IngredientItem, IngredientPayload } from "@/entities/ingredient";
import { User } from "@/entities/user";

// Dev V3 (2026-05-03 swagger reference) 신규 enum.
// listingStatus / lifecycleStatus는 백엔드 실수로 응답에 들어오지만 프론트는 사용 안 함.
export type Visibility = "PUBLIC" | "PRIVATE" | "RESTRICTED";
export type RecipeSource = "USER" | "AI" | "YOUTUBE" | "REELS";
export type ImageStatus = "PENDING" | "READY" | "FAILED";

// R01 신규 객체. legacy youtube*/extractor* 필드보다 우선해서 표시.
export type YoutubeInfo = {
  videoId: string;
  youtubeUrl: string;
  channelName?: string;
  videoTitle?: string;
  thumbnailUrl?: string;
  channelProfileUrl?: string;
  subscriberCount?: number;
  channelId?: string;
  videoViewCount?: number;
  extractorId?: string | null;
};

export type ExtractionEvidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export type ExtractionInfo = {
  hasSubtitle: boolean;
  hasDescriptionIngredient: boolean;
  hasCommentIngredient: boolean;
  usedGeminiAnalysis: boolean;
  evidenceLevel: ExtractionEvidenceLevel | string;
  tokenCost: number;
};

export type IngredientCalculationSummary = {
  totalCalories: number;
  totalIngredientCost: number;
  mappedCount: number;
  partialCount: number;
  unresolvedCount: number;
  customCount: number;
  calculatedCount: number;
  pendingCount: number;
};

export type BaseRecipesApiResponse = PageResponse<BaseRecipeGridItem>;
export type DetailedRecipesApiResponse = PageResponse<DetailedRecipeGridItem>;
export type StaticDetailedRecipesApiResponse =
  PageResponse<StaticDetailedRecipeGridItem>;
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
  likeCount: number;
  likedByCurrentUser: boolean;
  favoriteByCurrentUser: boolean;
  visibility?: Visibility;
  source?: RecipeSource;
};

export type DetailedRecipeGridItem = BaseRecipeGridItem & {
  avgRating: number;
  ratingCount: number;
  marketPrice?: number;
  ingredientCost?: number;
  isYoutube?: boolean;
  isAiGenerated?: boolean;
  youtubeChannelName?: string;
  favoriteCount?: number;
  youtubeVideoViewCount?: number;
};

export type StaticDetailedRecipeGridItem = Omit<
  DetailedRecipeGridItem,
  "likedByCurrentUser" | "favoriteByCurrentUser"
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
  youtubeUrl?: string;
  youtubeChannelName?: string;
  youtubeVideoTitle?: string;
  youtubeThumbnailUrl?: string;
  youtubeChannelProfileUrl?: string;
  youtubeSubscriberCount?: number;
  youtubeChannelId?: string;
  extractorId?: string | null;
  cookingTools: string[];
  servings: number;
  totalIngredientCost: number;
  marketPrice: number;
  imageKey: string | null | undefined;
  ratingInfo: RatingInfo;
  ingredients: Omit<IngredientItem, "inFridge">[];
  steps: RecipeStep[];
  tags: string[];
  comments: Comment[];
  author: User;
  likeCount: number;
  likedByCurrentUser: boolean;
  favoriteByCurrentUser: boolean;
  /**
   * @deprecated Dev V3에서 visibility로 대체 예정. 백엔드가 호환 동안 같이 보냄.
   * 신규 코드는 `visibility` 또는 `isPrivateRecipe(recipe)` helper 사용.
   */
  private: boolean;
  visibility?: Visibility;
  source?: RecipeSource;
  imageGenerationModel?: string | null;
  youtubeInfo?: YoutubeInfo | null;
  extractionInfo?: ExtractionInfo | null;
  ingredientCalculationSummary?: IngredientCalculationSummary;
  aiGenerated: boolean;
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
  components?: RecipeComponent[];
  isCloneable: boolean;
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
  stepImageKey: string | null | undefined;
};

const defaultRecipeKeys = [
  "id",
  "ingredients",
  "steps",
  "totalIngredientCost",
  "marketPrice",
  "youtubeUrl",
  "imageURL",
  "author",
  "likeCount",
  "likedByCurrentUser",
  "favoriteByCurrentUser",
  "ratingInfo",
  "comments",
  "imageUrl",
  "imageKey",
  "private",
  "aiGenerated",
  "totalCalories",
  "nutrition",
  "isCloneable",
] as const;

export type RecipePayload = Omit<Recipe, (typeof defaultRecipeKeys)[number]> & {
  ingredients: IngredientPayload[];
  steps: RecipeStepPayload[];
  cookingTime: number;
  servings: number;
  imageKey?: string | null;
  originRecipeId?: string;
  youtubeUrl?: string;
};

export type RecipeStepPayload = Omit<
  RecipeStep,
  "stepImageUrl" | "action" | "ingredients" | "imageKey"
> & {
  ingredients: IngredientPayload[];
  imageKey?: string;
};

export type RecipeQueryParams = {
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
  ingredientIds?: string[];
};

export type RecipeItemsQueryParams = {
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
  ingredientIds?: string[];
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

// 2026-05-08 신규: 실제 /me/recipes 응답에 맞춘 타입.
// 레거시 DetailedRecipeGridItem과 점진 마이그레이션 중 — 신규 코드만 사용.
export type MyRecipeListItem = {
  id: string;
  title: string;
  imageUrl: string;
  dishType: string;
  type: "YOUTUBE" | "USER" | "AI" | string;
  createdAt: string;
  likedByCurrentUser: boolean;
  aiGenerated: boolean;
  /**
   * @deprecated Dev V3에서 visibility로 대체 예정. 신규 코드는 `visibility` 사용.
   */
  private: boolean;
  visibility?: Visibility;
  source?: RecipeSource;
  imageStatus?: ImageStatus;
};

export type MyRecipesPageResponse = {
  content: MyRecipeListItem[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
