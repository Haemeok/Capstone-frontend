import { PageResponse } from "@/shared/api/types";

import { Comment } from "@/entities/comment";
import { IngredientItem, IngredientPayload } from "@/entities/ingredient";
import { User } from "@/entities/user";

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
  "likedByCurrentUser"
>;

export type IngredientRecipeGridItem = DetailedRecipeGridItem & {
  matchedIngredients: string[];
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
  private: boolean;
  aiGenerated: boolean;
  totalCalories: number;
  createdAt?: string;
  nutrition: Nutrition;
  cookingTips?: string;
  fineDiningInfo?: {
    components: RecipeComponent[];
    plating: {
      vessel: string;
      guide: string;
    };
  };
  components?: RecipeComponent[];
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
] as const;

export type RecipePayload = Omit<Recipe, (typeof defaultRecipeKeys)[number]> & {
  ingredients: IngredientPayload[];
  steps: RecipeStepPayload[];
  cookingTime: number;
  servings: number;
  imageKey?: string | null;
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
  sort?: "desc" | "asc";
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
  likedByCurrentUser: boolean;
  favoriteByCurrentUser: boolean;
  myRating: number | null;
  comments: Array<{
    id: string;
    likedByCurrentUser: boolean;
    likeCount: number;
  }>;
};

export type RecipeListItemStatus = {
  likedByCurrentUser: boolean;
};

export type RecipesStatusResponse = Record<string, RecipeListItemStatus>;
