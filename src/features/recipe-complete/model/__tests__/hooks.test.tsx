import type { ReactNode } from "react";

import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import type { PublicCookingReviewsResponse } from "@/entities/cooking-review";
import { COOKING_REVIEW_QUERY_KEYS } from "@/entities/cooking-review";
import type { RecordTimelineResponse } from "@/entities/recipe/model/record";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe/model/recordQueryKeys";

import { createRecipeRecord } from "../api";
import { useCreateRecipeCookingRecordMutation } from "../hooks";

jest.mock("../api", () => ({
  createRecipeRecord: jest.fn(),
}));

const createRecord = jest.mocked(createRecipeRecord);

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

const reviewPages: PublicCookingReviewsResponse[] = [
  { totalCount: 2, items: [], hasNext: true },
  { totalCount: 2, items: [], hasNext: false },
];

it("RECIPE 생성은 기록·legacy·recipe detail과 발행 후기 캐시를 갱신합니다", async () => {
  createRecord.mockResolvedValue({
    recordId: "record-A",
    reviewId: "review-A",
    message: "created",
  });
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const listKey = COOKING_RECORD_QUERY_KEYS.list({ size: 30, locale: "ko" });
  const timelineKey = ["recordsTimeline", 20, "ko"];
  const watchedKeys: readonly (readonly unknown[])[] = [
    COOKING_RECORD_QUERY_KEYS.calendarMonth(2026, 8, "ko"),
    ["recipeHistory", 2026, 8],
    ["myInfo"],
    ["recipeHistoryItems", "2026-08-17", "ko"],
    ["userStreak"],
    timelineKey,
    ["recipe", "recipe-A"],
    ["cooking-review", "list", "recipe-A"],
  ];
  queryClient.setQueryData(listKey, {
    pages: [
      { groups: [{ date: "2026-08-17", records: [] }], hasNext: true },
      { groups: [{ date: "2026-08-16", records: [] }], hasNext: false },
    ],
    pageParams: [0, 1],
  });
  watchedKeys.forEach((queryKey) => queryClient.setQueryData(queryKey, {}));
  queryClient.setQueryData(timelineKey, {
    pages: timelinePages,
    pageParams: [0, 1],
  });
  const { result } = renderHook(() => useCreateRecipeCookingRecordMutation(), {
    wrapper: Wrapper,
  });

  await act(async () => {
    await result.current.mutateAsync({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
      publishReview: true,
      reviewContent: "맛있어요",
    });
  });

  expect(queryClient.getQueryData(listKey)).toMatchObject({
    pages: [{ hasNext: true }],
    pageParams: [0],
  });
  expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
  watchedKeys.forEach((queryKey) => {
    expect(queryClient.getQueryState(queryKey)?.isInvalidated).toBe(true);
  });
});

it("RECIPE 생성은 recipe detail refetch가 끝날 때까지 mutation pending을 유지합니다", async () => {
  createRecord.mockResolvedValue({ recordId: "record-A", message: "created" });
  const deferredRecipe = createDeferred<{ id: string }>();
  const recipeQueryFn = jest.fn(() => deferredRecipe.promise);
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const recipeKey = ["recipe", "recipe-A"];
  const { result } = renderHook(
    () => {
      useQuery({
        queryKey: recipeKey,
        queryFn: recipeQueryFn,
        initialData: { id: "recipe-A" },
        staleTime: Infinity,
      });
      return useCreateRecipeCookingRecordMutation();
    },
    { wrapper: Wrapper }
  );

  let mutationPromise: Promise<unknown> | undefined;
  act(() => {
    mutationPromise = result.current.mutateAsync({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
    });
  });
  await waitFor(() => expect(recipeQueryFn).toHaveBeenCalledTimes(1));
  expect(result.current.isPending).toBe(true);

  deferredRecipe.resolve({ id: "recipe-A" });
  await act(async () => {
    await mutationPromise;
  });
  await waitFor(() => expect(result.current.isPending).toBe(false));
});

it("RECIPE 생성은 timeline을 첫 페이지로 줄인 뒤 page 0만 다시 요청합니다", async () => {
  createRecord.mockResolvedValue({ recordId: "record-A", message: "created" });
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
      return useCreateRecipeCookingRecordMutation();
    },
    { wrapper: Wrapper }
  );

  let mutationPromise: Promise<unknown> | undefined;
  act(() => {
    mutationPromise = result.current.mutateAsync({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
    });
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

it("후기 발행 RECIPE 생성은 후기 목록을 첫 페이지로 줄인 뒤 page 0만 다시 요청합니다", async () => {
  createRecord.mockResolvedValue({
    recordId: "record-A",
    reviewId: "review-A",
    message: "created",
  });
  const deferredReview = createDeferred<PublicCookingReviewsResponse>();
  const reviewQueryFn = jest.fn(
    (_context: { pageParam: number }) => deferredReview.promise
  );
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const reviewKey = COOKING_REVIEW_QUERY_KEYS.publicList("recipe-A", false, 20);
  const { result } = renderHook(
    () => {
      useInfiniteQuery({
        queryKey: reviewKey,
        queryFn: reviewQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => undefined,
        initialData: { pages: reviewPages, pageParams: [0, 1] },
        staleTime: Infinity,
      });
      return useCreateRecipeCookingRecordMutation();
    },
    { wrapper: Wrapper }
  );

  let mutationPromise: Promise<unknown> | undefined;
  act(() => {
    mutationPromise = result.current.mutateAsync({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
      publishReview: true,
      reviewContent: "맛있어요",
    });
  });
  await waitFor(() => expect(reviewQueryFn).toHaveBeenCalledTimes(1));

  expect(queryClient.getQueryData(reviewKey)).toMatchObject({
    pages: [reviewPages[0]],
    pageParams: [0],
  });
  expect(reviewQueryFn.mock.calls[0]?.[0].pageParam).toBe(0);
  deferredReview.resolve(reviewPages[0]);
  await act(async () => {
    await mutationPromise;
  });
});

it("T-06: 공개 후기 등록은 상세 미리보기와 전체 후기 목록을 함께 갱신합니다", async () => {
  createRecord.mockResolvedValue({
    recordId: "record-A",
    reviewId: "review-A",
    message: "created",
  });
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const summaryKey = COOKING_REVIEW_QUERY_KEYS.publicList("recipe-A", false, 1);
  const photoKey = COOKING_REVIEW_QUERY_KEYS.publicList("recipe-A", true, 3);
  const listKey = COOKING_REVIEW_QUERY_KEYS.publicList("recipe-A", false, 20);
  const summaryQueryFn = jest.fn().mockResolvedValue(reviewPages[0]);
  const photoQueryFn = jest.fn().mockResolvedValue(reviewPages[0]);
  const listQueryFn = jest.fn().mockResolvedValue(reviewPages[0]);

  const { result } = renderHook(
    () => {
      useInfiniteQuery({
        queryKey: summaryKey,
        queryFn: summaryQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => undefined,
        initialData: { pages: reviewPages, pageParams: [0, 1] },
        staleTime: Infinity,
      });
      useInfiniteQuery({
        queryKey: photoKey,
        queryFn: photoQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => undefined,
        initialData: { pages: reviewPages, pageParams: [0, 1] },
        staleTime: Infinity,
      });
      useInfiniteQuery({
        queryKey: listKey,
        queryFn: listQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => undefined,
        initialData: { pages: reviewPages, pageParams: [0, 1] },
        staleTime: Infinity,
      });
      return useCreateRecipeCookingRecordMutation();
    },
    { wrapper: Wrapper }
  );

  await act(async () => {
    await result.current.mutateAsync({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
      publishReview: true,
      reviewContent: "맛있어요",
    });
  });

  expect(summaryQueryFn).toHaveBeenCalledTimes(1);
  expect(photoQueryFn).toHaveBeenCalledTimes(1);
  expect(listQueryFn).toHaveBeenCalledTimes(1);
  [summaryKey, photoKey, listKey].forEach((queryKey) => {
    expect(queryClient.getQueryData(queryKey)).toMatchObject({
      pages: [reviewPages[0]],
      pageParams: [0],
    });
  });
});

it("T-08: 비공개 요리 기록은 공개 후기 목록을 갱신하지 않습니다", async () => {
  createRecord.mockResolvedValue({
    recordId: "record-A",
    message: "created",
  });
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const reviewKey = COOKING_REVIEW_QUERY_KEYS.publicList("recipe-A", false, 20);
  const reviewQueryFn = jest.fn().mockResolvedValue(reviewPages[0]);

  const { result } = renderHook(
    () => {
      useInfiniteQuery({
        queryKey: reviewKey,
        queryFn: reviewQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => undefined,
        initialData: { pages: reviewPages, pageParams: [0, 1] },
        staleTime: Infinity,
      });
      return useCreateRecipeCookingRecordMutation();
    },
    { wrapper: Wrapper }
  );

  await act(async () => {
    await result.current.mutateAsync({
      sourceType: "RECIPE",
      recipeId: "recipe-A",
      publishReview: false,
      recordMemo: "나만 보는 기록",
    });
  });

  expect(reviewQueryFn).not.toHaveBeenCalled();
  expect(queryClient.getQueryState(reviewKey)?.isInvalidated).toBe(false);
  expect(queryClient.getQueryData(reviewKey)).toMatchObject({
    pages: reviewPages,
    pageParams: [0, 1],
  });
});
