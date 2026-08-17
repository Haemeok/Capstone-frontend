import type { ReactNode } from "react";

import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import type { MyCookingReviewsResponse } from "@/entities/cooking-review";
import { COOKING_REVIEW_QUERY_KEYS } from "@/entities/cooking-review";
import type { RecordTimelineResponse } from "@/entities/recipe/model/record";
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

const timelinePages: RecordTimelineResponse[] = [
  { groups: [{ date: "2026-08-17", records: [] }], hasNext: true },
  { groups: [{ date: "2026-08-16", records: [] }], hasNext: false },
];

const myReviewPages: MyCookingReviewsResponse[] = [
  { items: [], hasNext: true },
  { items: [], hasNext: false },
];

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
  const myReviewKey = COOKING_REVIEW_QUERY_KEYS.myList(20, "ko");
  queryClient.setQueryData(detailKey, { recordId: "record-A" });
  queryClient.setQueryData(listKey, {
    pages: [
      { groups: [{ date: "2026-08-17", records: [] }], hasNext: true },
      { groups: [{ date: "2026-08-16", records: [] }], hasNext: false },
    ],
    pageParams: [0, 1],
  });
  queryClient.setQueryData(calendarKey, {});
  queryClient.setQueryData(timelineKey, {
    pages: timelinePages,
    pageParams: [0, 1],
  });
  queryClient.setQueryData(myReviewKey, {
    pages: myReviewPages,
    pageParams: [0, 1],
  });
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

it("삭제는 timeline을 첫 페이지로 줄인 뒤 page 0만 다시 요청합니다", async () => {
  deleteRecord.mockResolvedValue({ message: "deleted" });
  const deferredTimeline = createDeferred<RecordTimelineResponse>();
  const timelineQueryFn = jest.fn(
    (_context: { pageParam: number }) => deferredTimeline.promise
  );
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const timelineKey = ["recordsTimeline", 20, "ko"];
  const { result } = renderHook(
    () => {
      useInfiniteQuery({
        queryKey: timelineKey,
        queryFn: timelineQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => undefined,
        initialData: { pages: timelinePages, pageParams: [0, 1] },
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
  await waitFor(() => expect(timelineQueryFn).toHaveBeenCalledTimes(1));

  expect(queryClient.getQueryData(timelineKey)).toMatchObject({
    pages: [timelinePages[0]],
    pageParams: [0],
  });
  expect(timelineQueryFn.mock.calls[0]?.[0].pageParam).toBe(0);
  deferredTimeline.resolve(timelinePages[0]);
  await act(async () => {
    await mutationPromise;
  });
});

it("삭제는 내 후기 목록을 첫 페이지로 줄인 뒤 page 0만 다시 요청합니다", async () => {
  deleteRecord.mockResolvedValue({ message: "deleted" });
  const deferredReviews = createDeferred<MyCookingReviewsResponse>();
  const reviewQueryFn = jest.fn(
    (_context: { pageParam: number }) => deferredReviews.promise
  );
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const reviewKey = COOKING_REVIEW_QUERY_KEYS.myList(20, "ko");
  const { result } = renderHook(
    () => {
      useInfiniteQuery({
        queryKey: reviewKey,
        queryFn: reviewQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => undefined,
        initialData: { pages: myReviewPages, pageParams: [0, 1] },
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
  await waitFor(() => expect(reviewQueryFn).toHaveBeenCalledTimes(1));

  expect(queryClient.getQueryData(reviewKey)).toMatchObject({
    pages: [myReviewPages[0]],
    pageParams: [0],
  });
  expect(reviewQueryFn.mock.calls[0]?.[0].pageParam).toBe(0);
  deferredReviews.resolve(myReviewPages[0]);
  await act(async () => {
    await mutationPromise;
  });
});
