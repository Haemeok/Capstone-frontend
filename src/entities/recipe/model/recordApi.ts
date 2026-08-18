import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";

import type {
  CookingRecordCalendarDateItem,
  CookingRecordCalendarMonthResponse,
  CookingRecordDetailResponse,
  CookingRecordListParams,
  CookingRecordListResponse,
  LegacyRecipeHistoryResponse,
  RecipeHistoryDetailResponse,
  RecordTimelineResponse,
  StickerBookBackgroundListResponse,
} from "./record";

const DEFAULT_RECORD_LIST_SIZE = 30;
const MAX_RECORD_LIST_SIZE = 60;

type CookingRecordDetailWireResponse = Omit<
  CookingRecordDetailResponse,
  "recordId" | "recipeId" | "reviewId"
> & {
  id: string | number;
  recipeId: string | number | null;
  reviewId: string | number | null;
};

type CookingRecordCalendarDateWireItem = Omit<
  CookingRecordCalendarDateItem,
  | "originalImageUrl"
  | "savings"
  | "ingredientCost"
  | "marketPrice"
  | "nutrition"
  | "calories"
> & {
  imageUrl?: string | null;
  savings?: number | null;
  ingredientCost?: number | null;
  marketPrice?: number | null;
  nutrition?: CookingRecordCalendarDateItem["nutrition"];
  calories?: number | null;
  recipeAvailable?: boolean;
};

const toNullableResourceId = (
  resourceId: string | number | null
): string | null => (resourceId === null ? null : String(resourceId));

const normalizeCookingRecordDetail = ({
  id,
  recipeId,
  reviewId,
  ...detail
}: CookingRecordDetailWireResponse): CookingRecordDetailResponse => ({
  ...detail,
  recordId: String(id),
  recipeId: toNullableResourceId(recipeId),
  reviewId: toNullableResourceId(reviewId),
});

const toFiniteNumberOrNull = (value?: number | null): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const normalizeCookingRecordCalendarDateItem = ({
  imageUrl,
  savings,
  ingredientCost,
  marketPrice,
  nutrition,
  calories,
  recipeAvailable: _recipeAvailable,
  ...item
}: CookingRecordCalendarDateWireItem): CookingRecordCalendarDateItem => ({
  ...item,
  originalImageUrl: imageUrl ?? null,
  savings: toFiniteNumberOrNull(savings),
  ingredientCost: toFiniteNumberOrNull(ingredientCost),
  marketPrice: toFiniteNumberOrNull(marketPrice),
  nutrition: nutrition ?? null,
  calories: toFiniteNumberOrNull(calories),
});

export const getCookingRecords = async ({
  sourceTypes,
  page = 0,
  size = DEFAULT_RECORD_LIST_SIZE,
  locale,
}: CookingRecordListParams): Promise<CookingRecordListResponse> => {
  if (size < 1 || size > MAX_RECORD_LIST_SIZE) {
    throw new Error("기록 목록 size는 1 이상 60 이하여야 합니다.");
  }
  if (page < 0) {
    throw new Error("기록 목록 page는 0 이상이어야 합니다.");
  }
  return api.get<CookingRecordListResponse>(END_POINTS.MY_RECORDS, {
    params: {
      ...(sourceTypes === undefined
        ? {}
        : { sourceTypes: sourceTypes.join(",") }),
      page,
      size,
      lang: locale,
    },
  });
};

export const getCookingRecord = async (
  recordId: string,
  locale: Locale
): Promise<CookingRecordDetailResponse> => {
  const detail = await api.get<CookingRecordDetailWireResponse>(
    END_POINTS.MY_RECORD(recordId),
    {
      params: { lang: locale },
    }
  );
  return normalizeCookingRecordDetail(detail);
};

export const getStickerBookBackgrounds =
  async (): Promise<StickerBookBackgroundListResponse> =>
    api.get<StickerBookBackgroundListResponse>(
      END_POINTS.STICKER_BOOK_BACKGROUNDS
    );

export const getCookingRecordCalendarMonth = async ({
  year,
  month,
  locale,
}: {
  year: number;
  month: number;
  locale: Locale;
}): Promise<CookingRecordCalendarMonthResponse> =>
  api.get<CookingRecordCalendarMonthResponse>(END_POINTS.RECIPE_HISTORY, {
    params: { year, month, lang: locale },
  });

export const getCookingRecordCalendarDate = async ({
  date,
  locale,
}: {
  date: string;
  locale: Locale;
}): Promise<CookingRecordCalendarDateItem[]> => {
  const items = await api.get<CookingRecordCalendarDateWireItem[]>(
    END_POINTS.RECIPE_HISTORY,
    {
      params: { date, lang: locale },
    }
  );
  return items.map(normalizeCookingRecordCalendarDateItem);
};

export const getRecipeHistory = async ({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<LegacyRecipeHistoryResponse> =>
  api.get<LegacyRecipeHistoryResponse>(END_POINTS.RECIPE_HISTORY, {
    params: { year, month },
  });

export const getRecipeHistoryItems = async (
  date: string,
  lang: Locale
): Promise<RecipeHistoryDetailResponse[]> =>
  api.get<RecipeHistoryDetailResponse[]>(END_POINTS.RECIPE_HISTORY, {
    params: { date, lang },
  });

export const getRecordsTimeline = async ({
  page,
  size,
  lang,
}: {
  page: number;
  size: number;
  lang: Locale;
}): Promise<RecordTimelineResponse> =>
  api.get<RecordTimelineResponse>(END_POINTS.RECORDS_TIMELINE, {
    params: { page, size, sort: "createdAt,desc", lang },
  });
