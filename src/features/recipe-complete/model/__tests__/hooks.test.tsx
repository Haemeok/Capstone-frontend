import type { ReactNode } from "react";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

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
  const watchedKeys: readonly (readonly unknown[])[] = [
    COOKING_RECORD_QUERY_KEYS.calendarMonth(2026, 8, "ko"),
    ["recipeHistory", 2026, 8],
    ["myInfo"],
    ["recipeHistoryItems", "2026-08-17", "ko"],
    ["userStreak"],
    ["recordsTimeline", 20, "ko"],
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
