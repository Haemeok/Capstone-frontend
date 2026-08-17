import * as recipeEntity from "../..";

type AssertFalse<Value extends false> = Value;
type HasFeatureRecordMutations =
  | ("createManualCookingRecord" extends keyof typeof recipeEntity
      ? true
      : false)
  | ("postManualCookingRecord" extends keyof typeof recipeEntity ? true : false)
  | ("prepareManualCookingRecord" extends keyof typeof recipeEntity
      ? true
      : false)
  | ("patchCookingRecordImage" extends keyof typeof recipeEntity ? true : false)
  | ("prepareCookingRecordImage" extends keyof typeof recipeEntity
      ? true
      : false)
  | ("replaceCookingRecordImage" extends keyof typeof recipeEntity
      ? true
      : false)
  | ("updateCookingRecordMetadata" extends keyof typeof recipeEntity
      ? true
      : false)
  | ("deleteCookingRecord" extends keyof typeof recipeEntity ? true : false)
  | ("useCreateManualCookingRecord" extends keyof typeof recipeEntity
      ? true
      : false)
  | ("useReplaceCookingRecordImage" extends keyof typeof recipeEntity
      ? true
      : false)
  | ("useUpdateCookingRecordMetadata" extends keyof typeof recipeEntity
      ? true
      : false)
  | ("useDeleteCookingRecord" extends keyof typeof recipeEntity ? true : false);

export type RecipeEntityRecordPublicApiGate = [
  typeof recipeEntity.getCookingRecords,
  typeof recipeEntity.getCookingRecord,
  typeof recipeEntity.getCookingRecordCalendarMonth,
  typeof recipeEntity.getCookingRecordCalendarDate,
  typeof recipeEntity.useCookingRecordsInfiniteQuery,
  typeof recipeEntity.useCookingRecordDetailQuery,
  typeof recipeEntity.useCookingRecordCalendarMonthQuery,
  typeof recipeEntity.useCookingRecordCalendarDateQuery,
  typeof recipeEntity.COOKING_RECORD_QUERY_KEYS,
  recipeEntity.CookingRecordListParams,
  recipeEntity.CookingRecordListResponse,
  recipeEntity.CookingRecordDetailResponse,
  recipeEntity.CookingRecordCalendarMonthResponse,
  recipeEntity.CookingRecordCalendarDateItem,
  recipeEntity.RecordSourceType,
];

export type RecipeEntityFeatureMutationBoundaryGate =
  AssertFalse<HasFeatureRecordMutations>;
