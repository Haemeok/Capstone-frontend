import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";

import { ApiError } from "@/shared/api/errors";

import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe/model/recordQueryKeys";

import { postManualCookingRecord, prepareManualCookingRecord } from "../api";
import { useCreateManualCookingRecord } from "../hooks";

jest.mock("../api", () => ({
  prepareManualCookingRecord: jest.fn(),
  postManualCookingRecord: jest.fn(),
}));

const prepareRecord = jest.mocked(prepareManualCookingRecord);
const postRecord = jest.mocked(postManualCookingRecord);

const createHarness = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, Wrapper };
};

beforeEach(() => {
  jest.useFakeTimers();
  prepareRecord.mockReset().mockResolvedValue({
    sourceType: "MANUAL",
    recordTitle: "제목",
    image: { originalKey: "image-original" },
  });
  postRecord.mockReset();
});

afterEach(() => {
  jest.useRealTimers();
});

it("409/807만 2초 고정 간격으로 최초 요청 뒤 최대 세 번 재시도합니다", async () => {
  postRecord.mockRejectedValue(
    new ApiError(409, "Conflict", { code: 807, message: "not ready" })
  );
  const { Wrapper } = createHarness();
  const { result } = renderHook(() => useCreateManualCookingRecord(), {
    wrapper: Wrapper,
  });

  let promise: Promise<unknown> | undefined;
  await act(async () => {
    promise = result.current.createRecord({
      sourceType: "MANUAL",
      recordTitle: "제목",
      images: [
        {
          file: new File(["image"], "record.jpg", { type: "image/jpeg" }),
          purpose: "ORIGINAL",
        },
      ],
    });
    await Promise.resolve();
  });
  const rejection = expect(promise).rejects.toMatchObject({ status: 409 });
  expect(postRecord).toHaveBeenCalledTimes(1);

  for (let retryIndex = 0; retryIndex < 3; retryIndex += 1) {
    await act(async () => {
      await jest.advanceTimersByTimeAsync(1999);
    });
    expect(postRecord).toHaveBeenCalledTimes(retryIndex + 1);
    await act(async () => {
      await jest.advanceTimersByTimeAsync(1);
    });
    expect(postRecord).toHaveBeenCalledTimes(retryIndex + 2);
  }

  await rejection;
  expect(prepareRecord).toHaveBeenCalledTimes(1);
});

it("409/806은 재시도하지 않습니다", async () => {
  postRecord.mockRejectedValue(
    new ApiError(409, "Conflict", { code: 806, message: "invalid key" })
  );
  const { Wrapper } = createHarness();
  const { result } = renderHook(() => useCreateManualCookingRecord(), {
    wrapper: Wrapper,
  });

  await expect(
    result.current.createRecord({
      sourceType: "MANUAL",
      recordTitle: "제목",
      images: [
        {
          file: new File(["image"], "record.jpg", { type: "image/jpeg" }),
          purpose: "ORIGINAL",
        },
      ],
    })
  ).rejects.toMatchObject({ status: 409 });
  await act(async () => {
    await jest.runAllTimersAsync();
  });

  expect(postRecord).toHaveBeenCalledTimes(1);
});

it("생성 후 무한 목록을 첫 페이지로 줄이고 목록·캘린더를 무효화합니다", async () => {
  postRecord.mockResolvedValue({ recordId: "record-A", message: "created" });
  const { queryClient, Wrapper } = createHarness();
  const listKey = COOKING_RECORD_QUERY_KEYS.list({
    size: 30,
    locale: "ko",
  });
  const calendarKey = COOKING_RECORD_QUERY_KEYS.calendarMonth(2026, 8, "ko");
  queryClient.setQueryData(listKey, {
    pages: [
      { groups: [{ date: "2026-08-17", records: [] }], hasNext: true },
      { groups: [{ date: "2026-08-16", records: [] }], hasNext: false },
    ],
    pageParams: [0, 1],
  });
  queryClient.setQueryData(calendarKey, {
    dailySummaries: [],
    monthlyTotalSavings: 0,
  });
  const { result } = renderHook(() => useCreateManualCookingRecord(), {
    wrapper: Wrapper,
  });

  await act(async () => {
    await result.current.createRecord({
      sourceType: "MANUAL",
      recordTitle: "제목",
      images: [
        {
          file: new File(["image"], "record.jpg", { type: "image/jpeg" }),
          purpose: "ORIGINAL",
        },
      ],
    });
  });

  expect(queryClient.getQueryData(listKey)).toMatchObject({
    pages: [{ hasNext: true }],
    pageParams: [0],
  });
  expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
  expect(queryClient.getQueryState(calendarKey)?.isInvalidated).toBe(true);
});
