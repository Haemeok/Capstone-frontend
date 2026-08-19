import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import {
  getCookingRecord,
  getCookingRecordCalendarDate,
  getCookingRecordCalendarMonth,
  getCookingRecords,
  getStickerBookBackgrounds,
} from "../recordApi";
import { COOKING_RECORD_QUERY_KEYS } from "../recordQueryKeys";

jest.mock("@/shared/api/client", () => ({
  api: { get: jest.fn() },
}));

const apiGet = jest.mocked(api.get);

beforeEach(() => {
  apiGet.mockReset();
});

it("목록 필터를 단일 sourceTypes 값으로 직렬화하고 금지 파라미터를 보내지 않습니다", async () => {
  apiGet.mockResolvedValue({ groups: [], hasNext: false });

  await getCookingRecords({
    sourceTypes: ["RECIPE", "MANUAL"],
    page: 2,
    size: 60,
    locale: "ja",
  });

  expect(apiGet).toHaveBeenCalledWith(END_POINTS.MY_RECORDS, {
    params: {
      sourceTypes: "RECIPE,MANUAL",
      page: 2,
      size: 60,
      lang: "ja",
    },
  });
  const options = apiGet.mock.calls[0]?.[1];
  if (options === undefined) {
    throw new Error("목록 조회 options가 없습니다.");
  }
  expect(options.params).not.toHaveProperty("scope");
  expect(options.params).not.toHaveProperty("sort");
});

it("목록 기본값은 첫 페이지와 날짜 그룹 30개입니다", async () => {
  apiGet.mockResolvedValue({ groups: [], hasNext: false });

  await getCookingRecords({ locale: "ko" });

  expect(apiGet).toHaveBeenCalledWith(END_POINTS.MY_RECORDS, {
    params: { page: 0, size: 30, lang: "ko" },
  });
});

it("배경 선택창용 활성 배경 목록을 전용 경로에서 조회합니다", async () => {
  const response = {
    items: [
      {
        backgroundKey: "DEFAULT",
        backgroundType: "PRESET",
        imageUrl: null,
        selected: true,
      },
      {
        backgroundKey: "PAPER_BEIGE",
        backgroundType: "PRESET",
        imageUrl: "https://cdn.example.com/paper-beige.webp",
        selected: false,
      },
    ],
  };
  apiGet.mockResolvedValue(response);

  await expect(getStickerBookBackgrounds()).resolves.toEqual(response);
  expect(apiGet).toHaveBeenCalledWith(END_POINTS.STICKER_BOOK_BACKGROUNDS);
});

it("목록 크기 60을 초과하면 요청 전에 거부합니다", async () => {
  await expect(getCookingRecords({ size: 61, locale: "ko" })).rejects.toThrow(
    "60"
  );
  expect(apiGet).not.toHaveBeenCalled();
});

it("상세와 월·날짜 캘린더를 계약 경로와 파라미터로 조회합니다", async () => {
  apiGet.mockResolvedValue([]);

  await getCookingRecord("record-A", "ja");
  await getCookingRecordCalendarMonth({ year: 2026, month: 8, locale: "ko" });
  await getCookingRecordCalendarDate({ date: "2026-08-17", locale: "ja" });

  expect(apiGet).toHaveBeenNthCalledWith(1, END_POINTS.MY_RECORD("record-A"), {
    params: { lang: "ja" },
  });
  expect(apiGet).toHaveBeenNthCalledWith(2, END_POINTS.RECIPE_HISTORY, {
    params: { year: 2026, month: 8, lang: "ko" },
  });
  expect(apiGet).toHaveBeenNthCalledWith(3, END_POINTS.RECIPE_HISTORY, {
    params: { date: "2026-08-17", lang: "ja" },
  });
});

it("날짜 캘린더의 imageUrl과 생략된 MANUAL 수치를 화면용 nullable 필드로 정규화합니다", async () => {
  apiGet.mockResolvedValue([
    {
      recordId: "lJxxrEJA",
      sourceType: "MANUAL",
      displayTitle: "쿠키",
      cookedAt: "2026-08-18T12:22:00+09:00",
      recipeId: null,
      recipeAvailable: false,
      imageUrl: "https://cdn.example.com/cookie.webp",
      ingredientCost: null,
      marketPrice: null,
      nutrition: null,
      calories: null,
      visibility: null,
      isRemix: false,
    },
  ]);

  await expect(
    getCookingRecordCalendarDate({ date: "2026-08-18", locale: "ko" })
  ).resolves.toEqual([
    {
      recordId: "lJxxrEJA",
      sourceType: "MANUAL",
      displayTitle: "쿠키",
      cookedAt: "2026-08-18T12:22:00+09:00",
      recipeId: null,
      originalImageUrl: "https://cdn.example.com/cookie.webp",
      savings: null,
      ingredientCost: null,
      marketPrice: null,
      nutrition: null,
      calories: null,
      visibility: null,
      isRemix: false,
    },
  ]);
});

it("상세 응답의 id를 프론트 문자열 ID 필드로 정규화합니다", async () => {
  apiGet.mockResolvedValue({
    id: 87,
    recipeId: null,
    reviewId: 91,
    displayTitle: "동파육",
    recordMemo: null,
    originalImageUrl: null,
    stickerImageUrl: null,
    stickerStatus: "NONE",
    cookedAt: null,
    sourceType: "RECIPE",
    recipeAvailable: false,
    ingredientCost: null,
    marketPrice: null,
    nutrition: null,
    calories: null,
    savings: null,
    visibility: null,
    isRemix: null,
    createdAt: "2026-08-18T10:00:00+09:00",
  });

  const detail = await getCookingRecord("87", "ko");

  expect(detail).toMatchObject({
    recordId: "87",
    recipeId: null,
    reviewId: "91",
  });
  expect(detail).not.toHaveProperty("id");
});

it("목록 query key는 sourceTypes 순서를 정규화하고 페이지 번호를 제외합니다", () => {
  const first = COOKING_RECORD_QUERY_KEYS.list({
    sourceTypes: ["RECIPE", "MANUAL"],
    size: 30,
    locale: "ko",
  });
  const second = COOKING_RECORD_QUERY_KEYS.list({
    sourceTypes: ["MANUAL", "RECIPE"],
    size: 30,
    locale: "ko",
  });

  expect(first).toEqual(second);
  expect(first).toEqual([
    "cooking-record",
    "list",
    { sourceTypes: ["MANUAL", "RECIPE"], size: 30, locale: "ko" },
  ]);
});
