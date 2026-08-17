import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import { ApiError } from "@/shared/api/errors";

import type {
  CookingRecordCreateResponse,
  ManualCookingRecordCreateInput,
} from "@/entities/recipe/model/record";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe/model/recordQueryKeys";

import {
  type ManualCookingRecordDraft,
  postManualCookingRecord,
  prepareManualCookingRecord,
} from "../api";
import { useCreateManualCookingRecord } from "../hooks";

jest.mock("../api", () => ({
  prepareManualCookingRecord: jest.fn(),
  postManualCookingRecord: jest.fn(),
}));

const prepareRecord = jest.mocked(prepareManualCookingRecord);
const postRecord = jest.mocked(postManualCookingRecord);

const createDeferred = <T,>() => {
  let resolve = (_value: T) => {};
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });
  return { promise, resolve };
};

const manualDraft: ManualCookingRecordDraft = {
  sourceType: "MANUAL",
  recordTitle: "제목",
  images: [
    {
      file: new File(["image"], "record.jpg", { type: "image/jpeg" }),
      purpose: "ORIGINAL",
    },
  ],
};

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

it("이미지 준비 중부터 최종 생성 완료까지 pending을 유지합니다", async () => {
  jest.useRealTimers();
  const deferredPrepare = createDeferred<ManualCookingRecordCreateInput>();
  const deferredFinal = createDeferred<CookingRecordCreateResponse>();
  prepareRecord.mockReturnValue(deferredPrepare.promise);
  postRecord.mockReturnValue(deferredFinal.promise);
  const { Wrapper } = createHarness();
  const { result } = renderHook(() => useCreateManualCookingRecord(), {
    wrapper: Wrapper,
  });

  let createPromise: Promise<unknown> | undefined;
  act(() => {
    createPromise = result.current.createRecord(manualDraft);
  });
  await waitFor(() => expect(result.current.isPending).toBe(true));
  expect(result.current.status).toBe("pending");
  expect(result.current.isIdle).toBe(false);
  expect(result.current.isSuccess).toBe(false);
  expect(postRecord).not.toHaveBeenCalled();

  deferredPrepare.resolve({
    sourceType: "MANUAL",
    recordTitle: "제목",
    image: { originalKey: "image-original" },
  });
  await waitFor(() => expect(postRecord).toHaveBeenCalledTimes(1));
  expect(result.current.isPending).toBe(true);

  deferredFinal.resolve({ recordId: "record-A", message: "created" });
  await act(async () => {
    await createPromise;
  });
  await waitFor(() => expect(result.current.isPending).toBe(false));
});

it("이미지 준비 실패를 hook error 상태로 노출하고 최종 생성을 호출하지 않습니다", async () => {
  jest.useRealTimers();
  const prepareError = new Error("prepare failed");
  prepareRecord.mockRejectedValue(prepareError);
  const { Wrapper } = createHarness();
  const { result } = renderHook(() => useCreateManualCookingRecord(), {
    wrapper: Wrapper,
  });

  let createPromise: Promise<unknown> | undefined;
  act(() => {
    createPromise = result.current.createRecord(manualDraft);
  });
  await expect(createPromise).rejects.toBe(prepareError);

  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(result.current.error).toBe(prepareError);
  expect(postRecord).not.toHaveBeenCalled();
});

it("이전 성공 뒤 이미지 준비가 실패해도 error와 success를 동시에 노출하지 않습니다", async () => {
  jest.useRealTimers();
  postRecord.mockResolvedValue({ recordId: "record-A", message: "created" });
  const prepareError = new Error("prepare failed");
  const { Wrapper } = createHarness();
  const { result } = renderHook(() => useCreateManualCookingRecord(), {
    wrapper: Wrapper,
  });

  await act(async () => {
    await result.current.createRecord(manualDraft);
  });
  await waitFor(() => expect(result.current.status).toBe("success"));
  expect(result.current.isSuccess).toBe(true);

  prepareRecord.mockRejectedValueOnce(prepareError);
  await act(async () => {
    await expect(result.current.createRecord(manualDraft)).rejects.toBe(
      prepareError
    );
  });
  await waitFor(() => expect(result.current.status).toBe("error"));
  expect(result.current.isError).toBe(true);
  expect(result.current.isSuccess).toBe(false);
  expect(result.current.isIdle).toBe(false);

  act(() => result.current.reset());
  await waitFor(() => expect(result.current.status).toBe("idle"));
  expect(result.current.isIdle).toBe(true);
  expect(result.current.isError).toBe(false);
  expect(result.current.isSuccess).toBe(false);
  expect(result.current.error).toBeNull();
});
