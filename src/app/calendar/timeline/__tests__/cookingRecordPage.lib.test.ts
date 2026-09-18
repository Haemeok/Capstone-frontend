import type {
  CookingRecordListGroup,
  CookingRecordListItem,
} from "@/entities/recipe";

import {
  getSelectedCookingRecordMonth,
  shouldFetchNextCookingRecordPage,
  toMonthlyCookingRecords,
} from "../_components/cookingRecordPage.lib";

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

const groups: CookingRecordListGroup[] = [
  {
    date: "2026-09-02",
    records: [createRecord({ recordId: "record-september" })],
  },
  {
    date: "2026-08-11",
    records: [
      createRecord({ recordId: "record-sticker" }),
      createRecord({
        recordId: "record-original",
        displayTitle: "동파육",
        stickerImageUrl: null,
        stickerStatus: "PROCESSING",
      }),
      createRecord({
        recordId: "record-without-image",
        imageUrl: null,
        stickerImageUrl: null,
      }),
    ],
  },
  {
    date: "2026-07-31",
    records: [createRecord({ recordId: "record-july" })],
  },
];

describe("월별 요리 기록 변환", () => {
  it("선택한 월의 이미지 기록만 스티커로 만들고 완성된 스티커 이미지를 우선합니다", () => {
    const records = toMonthlyCookingRecords(groups, "2026-08", "ko");

    expect(records.map(({ record }) => record.recordId)).toEqual([
      "record-sticker",
      "record-original",
    ]);
    expect(records[0]?.sticker.imageUrl).toBe("/records/sticker.webp");
    expect(records[1]?.sticker.imageUrl).toBe("/records/original.webp");
    expect(records[0]?.sticker.displayRecord).toBe(records[0]?.record);
  });

  it("선택한 월까지 아직 내려가지 못했을 때만 다음 기록 페이지를 요청합니다", () => {
    expect(
      shouldFetchNextCookingRecordPage(groups.slice(0, 2), "2026-08", true)
    ).toBe(true);
    expect(shouldFetchNextCookingRecordPage(groups, "2026-08", true)).toBe(
      false
    );
    expect(shouldFetchNextCookingRecordPage(groups, "2026-08", false)).toBe(
      false
    );
  });
});

describe("요리 기록 월 선택", () => {
  const fallback = new Date(2026, 7, 17);

  it("유효한 month 쿼리는 해당 월의 첫날로 해석합니다", () => {
    expect(getSelectedCookingRecordMonth("2026-04", fallback)).toEqual(
      new Date(2026, 3, 1)
    );
  });

  it("잘못된 month 쿼리는 현재 월로 복구합니다", () => {
    expect(getSelectedCookingRecordMonth("2026-13", fallback)).toEqual(
      new Date(2026, 7, 1)
    );
  });
});
