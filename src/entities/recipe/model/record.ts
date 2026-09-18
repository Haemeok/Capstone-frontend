import type { Locale } from "@/shared/i18n";

import type {
  RecordDisplayInput,
  RecordDisplayResponse,
} from "./recordPhoto.types";
import { Nutrition, Visibility } from "./types";

export type RecordSourceType = "RECIPE" | "MANUAL";

export type RecordImagePurpose = "ORIGINAL" | "STICKER";

export type StickerStatus = "NONE" | "PROCESSING" | "READY" | "FAILED";

export type RecordImageUploadFileRequest = {
  contentType: string;
  fileSize: number;
  purpose: RecordImagePurpose;
};

export type RecordImageUploadUrlResponse = {
  presignedUrl: string;
  uploadKey: string;
  imageKey: string;
};

export type RecordImageKeys = {
  originalKey: string;
  stickerKey?: string;
};

export type RecordImageFile = {
  file: File;
  purpose: RecordImagePurpose;
};

export type RecipeCookingRecordCreateInput = RecordDisplayInput & {
  sourceType: "RECIPE";
  recipeId: string;
  image?: RecordImageKeys;
  recordTitle?: string;
  recordMemo?: string;
  reviewContent?: string;
  publishReview?: boolean;
  cookedAt?: never;
};

export type ManualCookingRecordCreateInput = RecordDisplayInput & {
  sourceType: "MANUAL";
  recipeId?: never;
  recordTitle: string;
  image: RecordImageKeys;
  recordMemo?: string;
  cookedAt?: string;
  reviewContent?: never;
  publishReview?: never;
};

export type CookingRecordCreateInput =
  | RecipeCookingRecordCreateInput
  | ManualCookingRecordCreateInput;

export type CookingRecordCreateResponse = {
  recordId: string;
  reviewId?: string;
  message: string;
};

export type CookingRecordListParams = {
  sourceTypes?: RecordSourceType[];
  page?: number;
  size?: number;
  locale: Locale;
};

export type CookingRecordListItem = RecordDisplayResponse & {
  recordId: string;
  recipeId: string | null;
  displayTitle: string;
  ingredientCost: number | null;
  marketPrice: number | null;
  nutrition: Nutrition | null;
  calories: number | null;
  imageUrl: string | null;
  visibility: Visibility | null;
  stickerImageUrl: string | null;
  stickerStatus: StickerStatus;
  cookedAt: string | null;
  createdAt: string;
  sourceType: RecordSourceType;
  reviewId: string | null;
  recipeAvailable: boolean;
  savings: number | null;
  isRemix: boolean | null;
};

export type CookingRecordListGroup = {
  date: string;
  records: CookingRecordListItem[];
};

export type StickerBookBackgroundType = "PRESET" | "CUSTOM";

export type StickerBookBackground = {
  backgroundKey: string;
  backgroundType: StickerBookBackgroundType;
  imageUrl: string | null;
};

export type StickerBookBackgroundOption = StickerBookBackground & {
  selected: boolean;
};

export type StickerBookBackgroundListResponse = {
  items: StickerBookBackgroundOption[];
};

export type StickerBookBackgroundUpdateInput = {
  backgroundKey: string;
};

export type StickerBookBackgroundUpdateResponse = {
  backgroundKey: string;
  imageUrl: string | null;
};

export type StickerBookBackgroundUploadUrlResponse = {
  presignedUrl: string;
  uploadKey: string;
  imageKey: string;
};

export type CustomStickerBookBackgroundCreateInput = {
  imageKey: string;
};

export type CustomStickerBookBackgroundCreateResponse = {
  backgroundKey: string;
  backgroundType: "CUSTOM";
  imageUrl: string;
};

export type CookingRecordListResponse = {
  background: StickerBookBackground | null;
  groups: CookingRecordListGroup[];
  hasNext: boolean;
};

export type CookingRecordDetailResponse = RecordDisplayResponse & {
  imageEdit?: {
    originalKey: string;
    stickerKey: string | null;
    croppedKey: string | null;
  } | null;
  recordId: string;
  recipeId: string | null;
  displayTitle: string;
  recordMemo: string | null;
  originalImageUrl: string | null;
  stickerImageUrl: string | null;
  stickerStatus: StickerStatus;
  cookedAt: string | null;
  sourceType: RecordSourceType;
  reviewId: string | null;
  recipeAvailable: boolean;
  ingredientCost: number | null;
  marketPrice: number | null;
  nutrition: Nutrition | null;
  calories: number | null;
  savings: number | null;
  visibility: Visibility | null;
  isRemix: boolean | null;
  createdAt: string;
};

export type CookingRecordCalendarDailySummary = {
  date: string;
  totalSavings: number;
  totalCount: number;
  firstImageUrl: string | null;
};

export type CookingRecordCalendarMonthResponse = {
  dailySummaries: CookingRecordCalendarDailySummary[];
  monthlyTotalSavings: number;
};

export type LegacyRecipeHistoryResponse = {
  dailySummaries: {
    date: string;
    totalSavings: number;
    totalCount: number;
    firstImageUrl: string;
  }[];
  monthlyTotalSavings: number;
};

export type CookingRecordCalendarDateItem = RecordDisplayResponse & {
  imageUrl?: string | null;
  stickerImageUrl?: string | null;
  recordId: string;
  recipeId: string | null;
  displayTitle: string;
  originalImageUrl: string | null;
  savings: number | null;
  ingredientCost: number | null;
  marketPrice: number | null;
  nutrition: Nutrition | null;
  calories: number | null;
  visibility: Visibility | null;
  isRemix: boolean | null;
  cookedAt: string | null;
  sourceType: RecordSourceType;
};

export type CookingRecordSuccessResponse = {
  message: string;
};

export type CookingRecordMetadataUpdateInput = {
  recordId: string;
  sourceType: RecordSourceType;
  recordTitle?: string | null;
  recordMemo?: string | null;
  cookedAt?: string | null;
};

export type RecipeRecordResponse = {
  message: string;
  recordId: string;
  reviewId?: string;
};

export type RecipeCompletionState = {
  recipeId: string;
  recordId: string;
  savedAmount: number;
  completedAt: string;
};

export type RecipeHistoryDetailResponse = {
  marketPrice: number;
  ingredientCost: number;
  nutrition: Nutrition;
  recipeId: string;
  recipeTitle: string;
  imageUrl: string;
  calories: number;
  visibility?: Visibility | null;
  isRemix?: boolean;
};

export type RecordTimelineItem = {
  recordId: string;
  recipeId: string;
  recipeTitle: string;
  ingredientCost: number;
  marketPrice: number;
  nutrition: Nutrition;
  calories: number;
  imageUrl: string;
  visibility?: Visibility | null;
  isRemix?: boolean;
};

export type RecordTimelineGroup = {
  date: string;
  records: RecordTimelineItem[];
};

export type RecordTimelineResponse = {
  groups: RecordTimelineGroup[];
  hasNext: boolean;
};
