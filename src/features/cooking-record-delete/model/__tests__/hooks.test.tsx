import type { ReactNode } from "react";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe/model/recordQueryKeys";

import { deleteCookingRecord } from "../api";
import { useDeleteCookingRecord } from "../hooks";

jest.mock("../api", () => ({
  deleteCookingRecord: jest.fn(),
}));

const deleteRecord = jest.mocked(deleteCookingRecord);

const createDeferred = <T,>() => {
  let resolve = (_value: T) => {};
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });
  return { promise, resolve };
};

it("DELETE는 전역 mutation retry 설정과 무관하게 한 번만 요청합니다", async () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: 3, retryDelay: 1 } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  deleteRecord.mockRejectedValue(new Error("failed"));
  const { result } = renderHook(() => useDeleteCookingRecord(), {
    wrapper: Wrapper,
  });

  await act(async () => {
    await expect(result.current.mutateAsync("record-A")).rejects.toThrow(
      "failed"
    );
  });

  expect(deleteRecord).toHaveBeenCalledTimes(1);
});

it("삭제 성공은 detail을 제거하고 list·calendar·timeline·내 후기 연결을 갱신합니다", async () => {
  deleteRecord.mockResolvedValue({ message: "deleted" });
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const detailKey = COOKING_RECORD_QUERY_KEYS.detail("record-A", "ko");
  const listKey = COOKING_RECORD_QUERY_KEYS.list({ size: 30, locale: "ko" });
  const calendarKey = COOKING_RECORD_QUERY_KEYS.calendarMonth(2026, 8, "ko");
  const timelineKey: readonly unknown[] = ["recordsTimeline", 20, "ko"];
  const myReviewKey: readonly unknown[] = ["cooking-review", "my", "ko"];
  queryClient.setQueryData(detailKey, { recordId: "record-A" });
  queryClient.setQueryData(listKey, {
    pages: [
      { groups: [{ date: "2026-08-17", records: [] }], hasNext: true },
      { groups: [{ date: "2026-08-16", records: [] }], hasNext: false },
    ],
    pageParams: [0, 1],
  });
  queryClient.setQueryData(calendarKey, {});
  queryClient.setQueryData(timelineKey, {});
  queryClient.setQueryData(myReviewKey, {});
  const { result } = renderHook(() => useDeleteCookingRecord(), {
    wrapper: Wrapper,
  });

  await act(async () => {
    await result.current.mutateAsync("record-A");
  });

  expect(queryClient.getQueryState(detailKey)).toBeUndefined();
  expect(queryClient.getQueryData(listKey)).toMatchObject({
    pages: [{ hasNext: true }],
    pageParams: [0],
  });
  expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
  expect(queryClient.getQueryState(calendarKey)?.isInvalidated).toBe(true);
  expect(queryClient.getQueryState(timelineKey)?.isInvalidated).toBe(true);
  expect(queryClient.getQueryState(myReviewKey)?.isInvalidated).toBe(true);
});

it("삭제는 calendar refetch가 끝날 때까지 mutation pending을 유지합니다", async () => {
  deleteRecord.mockResolvedValue({ message: "deleted" });
  const deferredCalendar = createDeferred<{ monthlyTotalSavings: number }>();
  const calendarQueryFn = jest.fn(() => deferredCalendar.promise);
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const calendarKey = COOKING_RECORD_QUERY_KEYS.calendarMonth(2026, 8, "ko");
  const { result } = renderHook(
    () => {
      useQuery({
        queryKey: calendarKey,
        queryFn: calendarQueryFn,
        initialData: { monthlyTotalSavings: 0 },
        staleTime: Infinity,
      });
      return useDeleteCookingRecord();
    },
    { wrapper: Wrapper }
  );

  let mutationPromise: Promise<unknown> | undefined;
  act(() => {
    mutationPromise = result.current.mutateAsync("record-A");
  });
  await waitFor(() => expect(calendarQueryFn).toHaveBeenCalledTimes(1));
  expect(result.current.isPending).toBe(true);

  deferredCalendar.resolve({ monthlyTotalSavings: 0 });
  await act(async () => {
    await mutationPromise;
  });
  await waitFor(() => expect(result.current.isPending).toBe(false));
});
