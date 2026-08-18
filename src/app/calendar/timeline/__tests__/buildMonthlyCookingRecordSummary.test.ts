import type {
  CookingRecordListGroup,
  CookingRecordListItem,
} from "@/entities/recipe";

import { buildMonthlyCookingRecordSummary } from "../_components/buildMonthlyCookingRecordSummary";
import { getMonthlyCookingRecordItems } from "../_components/cookingRecordPage.lib";

const createRecord = (
  overrides: Partial<CookingRecordListItem>
): CookingRecordListItem => ({
  recordId: "record-default",
  recipeId: "recipe-default",
  displayTitle: "된장찌개",
  ingredientCost: null,
  marketPrice: null,
  nutrition: null,
  calories: null,
  imageUrl: "/records/original.webp",
  visibility: null,
  stickerImageUrl: "/records/sticker.webp",
  stickerStatus: "READY",
  cookedAt: "2026-08-11T12:00:00+09:00",
  createdAt: "2026-08-11T12:00:00+09:00",
  sourceType: "RECIPE",
  reviewId: null,
  recipeAvailable: true,
  savings: null,
  isRemix: null,
  ...overrides,
});

describe("월간 요리 기록 성과", () => {
  it("선택 월의 횟수·요리한 날·절약액·고유 요리를 계산합니다", () => {
    const groups: CookingRecordListGroup[] = [
      {
        date: "2026-08-18",
        records: [
          createRecord({
            recordId: "recipe-1-first",
            recipeId: "recipe-1",
            savings: 4_000,
          }),
          createRecord({
            recordId: "recipe-1-second",
            recipeId: "recipe-1",
            savings: null,
          }),
          createRecord({
            recordId: "manual-1",
            recipeId: null,
            sourceType: "MANUAL",
            displayTitle: "  Kimchi   볶음밥 ",
            savings: 2_500,
          }),
        ],
      },
      {
        date: "2026-08-11",
        records: [
          createRecord({
            recordId: "manual-2",
            recipeId: null,
            sourceType: "MANUAL",
            displayTitle: "kimchi 볶음밥",
            savings: 1_500,
          }),
          createRecord({
            recordId: "recipe-2",
            recipeId: "recipe-2",
            savings: 3_000,
          }),
        ],
      },
      {
        date: "2026-07-31",
        records: [createRecord({ recordId: "other-month", savings: 99_000 })],
      },
    ];

    const items = getMonthlyCookingRecordItems(groups, "2026-08");

    expect(buildMonthlyCookingRecordSummary(items)).toEqual({
      cookingCount: 5,
      cookingDayCount: 2,
      uniqueDishCount: 3,
      savings: {
        value: 11_000,
        isPartial: true,
        isUnavailable: false,
      },
    });
  });

  it("절약액이 전부 없으면 사용할 수 없는 값으로 표시합니다", () => {
    const items = getMonthlyCookingRecordItems(
      [
        {
          date: "2026-08-18",
          records: [
            createRecord({ recordId: "record-1", savings: null }),
            createRecord({ recordId: "record-2", savings: null }),
          ],
        },
      ],
      "2026-08"
    );

    expect(buildMonthlyCookingRecordSummary(items).savings).toEqual({
      value: 0,
      isPartial: false,
      isUnavailable: true,
    });
  });
});
