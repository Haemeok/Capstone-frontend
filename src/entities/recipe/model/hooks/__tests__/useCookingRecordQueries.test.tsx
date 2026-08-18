import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import {
  getCookingRecord,
  getCookingRecordCalendarDate,
  getCookingRecordCalendarMonth,
  getCookingRecords,
  getStickerBookBackgrounds,
} from "../../recordApi";
import { useCookingRecordCalendarDateQuery } from "../useCookingRecordCalendarDateQuery";
import { useCookingRecordCalendarMonthQuery } from "../useCookingRecordCalendarMonthQuery";
import { useCookingRecordDetailQuery } from "../useCookingRecordDetailQuery";
import { useCookingRecordsInfiniteQuery } from "../useCookingRecordsInfiniteQuery";
import { useStickerBookBackgroundsQuery } from "../useStickerBookBackgroundsQuery";

jest.mock("../../recordApi", () => ({
  getCookingRecord: jest.fn(),
  getCookingRecordCalendarDate: jest.fn(),
  getCookingRecordCalendarMonth: jest.fn(),
  getCookingRecords: jest.fn(),
  getStickerBookBackgrounds: jest.fn(),
}));

jest.mock("@/shared/i18n", () => ({
  useUserPagesLocale: () => "ko",
}));

const mockedList = jest.mocked(getCookingRecords);
const mockedDetail = jest.mocked(getCookingRecord);
const mockedMonth = jest.mocked(getCookingRecordCalendarMonth);
const mockedDate = jest.mocked(getCookingRecordCalendarDate);
const mockedBackgrounds = jest.mocked(getStickerBookBackgrounds);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const createRetryingWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 1, retryDelay: 1 } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

beforeEach(() => {
  mockedList
    .mockReset()
    .mockResolvedValue({ background: null, groups: [], hasNext: false });
  mockedDetail.mockReset().mockResolvedValue({
    recordId: "record-A",
    recipeId: "recipe-A",
    displayTitle: "제목",
    recordMemo: null,
    originalImageUrl: null,
    stickerImageUrl: null,
    stickerStatus: "NONE",
    cookedAt: null,
    sourceType: "RECIPE",
    reviewId: null,
    recipeAvailable: true,
    ingredientCost: null,
    marketPrice: null,
    nutrition: null,
    calories: null,
    savings: null,
    visibility: null,
    isRemix: false,
    createdAt: "2026-08-17T10:00:00+09:00",
  });
  mockedMonth
    .mockReset()
    .mockResolvedValue({ dailySummaries: [], monthlyTotalSavings: 0 });
  mockedDate.mockReset().mockResolvedValue([]);
  mockedBackgrounds.mockReset().mockResolvedValue({ items: [] });
});

it("배경 목록은 선택창이 열릴 때만 조회합니다", async () => {
  const { rerender } = renderHook(
    ({ enabled }) => useStickerBookBackgroundsQuery({ enabled }),
    { initialProps: { enabled: false }, wrapper: createWrapper() }
  );

  expect(mockedBackgrounds).not.toHaveBeenCalled();

  rerender({ enabled: true });

  await waitFor(() => expect(mockedBackgrounds).toHaveBeenCalledTimes(1));
});

it("인증 게이트가 닫히면 기록 목록·상세·캘린더를 호출하지 않습니다", () => {
  renderHook(
    () => {
      useCookingRecordsInfiniteQuery({ enabled: false });
      useCookingRecordDetailQuery({ recordId: "record-A", enabled: false });
      useCookingRecordCalendarMonthQuery({
        year: 2026,
        month: 8,
        enabled: false,
      });
      useCookingRecordCalendarDateQuery({
        date: "2026-08-17",
        enabled: false,
      });
    },
    { wrapper: createWrapper() }
  );

  expect(mockedList).not.toHaveBeenCalled();
  expect(mockedDetail).not.toHaveBeenCalled();
  expect(mockedMonth).not.toHaveBeenCalled();
  expect(mockedDate).not.toHaveBeenCalled();
});

it("hasNext인 목록은 pageParam만 1 증가시켜 다음 페이지를 조회합니다", async () => {
  mockedList
    .mockResolvedValueOnce({
      background: null,
      groups: [{ date: "2026-08-17", records: [] }],
      hasNext: true,
    })
    .mockResolvedValueOnce({
      background: null,
      groups: [{ date: "2026-08-16", records: [] }],
      hasNext: false,
    });

  const { result } = renderHook(
    () => useCookingRecordsInfiniteQuery({ enabled: true, size: 30 }),
    { wrapper: createWrapper() }
  );

  await waitFor(() => expect(mockedList).toHaveBeenCalledTimes(1));
  await act(async () => {
    await result.current.fetchNextPage();
  });

  expect(mockedList).toHaveBeenNthCalledWith(1, {
    sourceTypes: undefined,
    page: 0,
    size: 30,
    locale: "ko",
  });
  expect(mockedList).toHaveBeenNthCalledWith(2, {
    sourceTypes: undefined,
    page: 1,
    size: 30,
    locale: "ko",
  });
});

it("신규 기록 조회 훅은 전역 설정과 무관하게 실패 요청을 재시도하지 않습니다", async () => {
  jest.useFakeTimers();
  mockedList.mockRejectedValue(new Error("failed"));
  mockedDetail.mockRejectedValue(new Error("failed"));
  mockedMonth.mockRejectedValue(new Error("failed"));
  mockedDate.mockRejectedValue(new Error("failed"));

  const { unmount } = renderHook(
    () => {
      useCookingRecordsInfiniteQuery({ enabled: true });
      useCookingRecordDetailQuery({ recordId: "record-A", enabled: true });
      useCookingRecordCalendarMonthQuery({
        year: 2026,
        month: 8,
        enabled: true,
      });
      useCookingRecordCalendarDateQuery({
        date: "2026-08-17",
        enabled: true,
      });
    },
    { wrapper: createRetryingWrapper() }
  );

  await act(async () => {
    await jest.runAllTimersAsync();
  });

  expect(mockedList).toHaveBeenCalledTimes(1);
  expect(mockedDetail).toHaveBeenCalledTimes(1);
  expect(mockedMonth).toHaveBeenCalledTimes(1);
  expect(mockedDate).toHaveBeenCalledTimes(1);
  unmount();
  jest.useRealTimers();
});
