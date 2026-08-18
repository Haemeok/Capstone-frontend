import { act, renderHook, waitFor } from "@testing-library/react";

import { useCookingRecordsInfiniteQuery } from "@/entities/recipe";

import { useMonthlyCookingRecords } from "../_components/useMonthlyCookingRecords";

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock("@/entities/recipe", () => ({
  useCookingRecordsInfiniteQuery: jest.fn(),
}));

const mockedQuery = jest.mocked(useCookingRecordsInfiniteQuery);
const fetchNextPage = jest.fn();
const refetch = jest.fn();

describe("useMonthlyCookingRecords", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("선택 월 경계를 확인할 때까지 다음 페이지를 자동으로 불러옵니다", async () => {
    mockedQuery.mockReturnValue({
      data: {
        pages: [
          {
            background: null,
            groups: [{ date: "2026-08-18", records: [] }],
            hasNext: true,
          },
        ],
      },
      hasNextPage: true,
      fetchNextPage,
      isFetchingNextPage: false,
      isPending: false,
      isError: false,
      refetch,
    } as never);

    const { result, rerender } = renderHook(() =>
      useMonthlyCookingRecords({
        enabled: true,
        monthKey: "2026-08",
        locale: "ko",
      })
    );

    expect(result.current.isMonthComplete).toBe(false);
    await waitFor(() => expect(fetchNextPage).toHaveBeenCalledTimes(1));

    mockedQuery.mockReturnValue({
      data: {
        pages: [
          {
            background: null,
            groups: [{ date: "2026-08-18", records: [] }],
            hasNext: true,
          },
          {
            background: null,
            groups: [{ date: "2026-07-31", records: [] }],
            hasNext: true,
          },
        ],
      },
      hasNextPage: true,
      fetchNextPage,
      isFetchingNextPage: false,
      isPending: false,
      isError: false,
      refetch,
    } as never);
    rerender();

    expect(result.current.isMonthComplete).toBe(true);
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("누끼 처리 중에는 2초마다 다시 조회하고 준비되면 멈춥니다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-08-18T12:00:00+09:00"));
    mockedQuery.mockReturnValue(
      createQueryResult(createRecord("PROCESSING")) as never
    );

    const { rerender } = renderHook(() =>
      useMonthlyCookingRecords({
        enabled: true,
        monthKey: "2026-08",
        locale: "ko",
      })
    );

    act(() => jest.advanceTimersByTime(2000));
    expect(refetch).toHaveBeenCalledTimes(1);

    mockedQuery.mockReturnValue(
      createQueryResult(createRecord("READY")) as never
    );
    rerender();
    act(() => jest.advanceTimersByTime(4000));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("누끼 처리가 계속되면 30초 뒤 자동 재조회를 멈춥니다", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-08-18T12:00:00+09:00"));
    mockedQuery.mockReturnValue(
      createQueryResult(createRecord("PROCESSING")) as never
    );

    renderHook(() =>
      useMonthlyCookingRecords({
        enabled: true,
        monthKey: "2026-08",
        locale: "ko",
      })
    );

    act(() => jest.advanceTimersByTime(30_000));
    const callsAtTimeout = refetch.mock.calls.length;
    expect(callsAtTimeout).toBeGreaterThan(0);

    act(() => jest.advanceTimersByTime(10_000));
    expect(refetch).toHaveBeenCalledTimes(callsAtTimeout);
  });
});

const createRecord = (stickerStatus: "PROCESSING" | "READY") => ({
  recordId: "record-processing",
  recipeId: null,
  displayTitle: "계란말이",
  ingredientCost: null,
  marketPrice: null,
  nutrition: null,
  calories: null,
  imageUrl: "/records/original.webp",
  visibility: null,
  stickerImageUrl: stickerStatus === "READY" ? "/records/sticker.webp" : null,
  stickerStatus,
  cookedAt: "2026-08-18",
  createdAt: "2026-08-18T03:00:00Z",
  sourceType: "MANUAL" as const,
  reviewId: null,
  recipeAvailable: false,
  savings: null,
  isRemix: null,
});

const createQueryResult = (record: ReturnType<typeof createRecord>) => ({
  data: {
    pages: [
      {
        background: null,
        groups: [{ date: "2026-08-18", records: [record] }],
        hasNext: false,
      },
    ],
  },
  hasNextPage: false,
  fetchNextPage,
  isFetchingNextPage: false,
  isPending: false,
  isError: false,
  isFetching: false,
  refetch,
});
