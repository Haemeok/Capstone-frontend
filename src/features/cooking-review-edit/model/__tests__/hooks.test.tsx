import type { PropsWithChildren } from "react";

import {
  type InfiniteData,
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import { api } from "@/shared/api/client";

import {
  COOKING_REVIEW_QUERY_KEYS,
  type MyCookingReviewsResponse,
  type PublicCookingReviewsResponse,
} from "@/entities/cooking-review";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe";

import { useEditCookingReview } from "../hooks";

jest.mock("@/shared/api/client", () => ({
  api: {
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

const patchMock = jest.mocked(api.patch);

const createDeferred = <T,>() => {
  let resolveValue: (value: T) => void = () => undefined;
  const promise = new Promise<T>((resolve) => {
    resolveValue = resolve;
  });
  return { promise, resolve: resolveValue };
};

it("수정은 후기 캐시를 먼저 첫 페이지로 줄이고 두 활성 목록의 첫 페이지만 갱신할 때까지 pending입니다", async () => {
  expect(COOKING_RECORD_QUERY_KEYS).toBeDefined();
  patchMock.mockResolvedValue({ message: "updated" });
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false, staleTime: Infinity },
    },
  });
  const publicKey = COOKING_REVIEW_QUERY_KEYS.publicList(
    "recipe-edit-cache",
    true,
    20
  );
  const myKey = COOKING_REVIEW_QUERY_KEYS.myList(20, "ko");
  const recipeKey = ["recipe", "recipe-edit-cache"] as const;
  const recordDetailKey = COOKING_RECORD_QUERY_KEYS.detail(
    "record-edit-cache",
    "ko"
  );
  const recordListKey = COOKING_RECORD_QUERY_KEYS.list({
    size: 30,
    locale: "ko",
  });
  const firstPublicPage: PublicCookingReviewsResponse = {
    totalCount: 2,
    items: [],
    hasNext: true,
  };
  const secondPublicPage: PublicCookingReviewsResponse = {
    totalCount: 2,
    items: [],
    hasNext: false,
  };
  const firstMyPage: MyCookingReviewsResponse = {
    items: [],
    hasNext: true,
  };
  const secondMyPage: MyCookingReviewsResponse = {
    items: [],
    hasNext: false,
  };
  queryClient.setQueryData<InfiniteData<PublicCookingReviewsResponse, number>>(
    publicKey,
    {
      pages: [firstPublicPage, secondPublicPage],
      pageParams: [0, 1],
    }
  );
  queryClient.setQueryData<InfiniteData<MyCookingReviewsResponse, number>>(
    myKey,
    { pages: [firstMyPage, secondMyPage], pageParams: [0, 1] }
  );
  queryClient.setQueryData(recipeKey, {
    id: "recipe-edit-cache",
  });
  queryClient.setQueryData(recordDetailKey, {
    recordId: "record-edit-cache",
  });
  queryClient.setQueryData(recordListKey, { groups: [] });
  const publicRefetch = createDeferred<PublicCookingReviewsResponse>();
  const myRefetch = createDeferred<MyCookingReviewsResponse>();
  const publicPagesRequested: number[] = [];
  const myPagesRequested: number[] = [];
  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(
    () => {
      useInfiniteQuery({
        queryKey: publicKey,
        queryFn: ({ pageParam }) => {
          publicPagesRequested.push(pageParam);
          return publicRefetch.promise;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) =>
          lastPage.hasNext ? pages.length : undefined,
      });
      useInfiniteQuery({
        queryKey: myKey,
        queryFn: ({ pageParam }) => {
          myPagesRequested.push(pageParam);
          return myRefetch.promise;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) =>
          lastPage.hasNext ? pages.length : undefined,
      });
      return useEditCookingReview();
    },
    { wrapper: Wrapper }
  );

  act(() => {
    result.current.mutate({
      reviewId: "review-edit-cache",
      recipeId: "recipe-edit-cache",
      sourceRecordId: "record-edit-cache",
      content: "수정",
      currentReview: { content: "기존", imageUrl: null },
    });
  });

  await waitFor(() => {
    expect(publicPagesRequested).toEqual([0]);
    expect(myPagesRequested).toEqual([0]);
  });
  expect(result.current.isPending).toBe(true);
  expect(
    queryClient.getQueryData<
      InfiniteData<PublicCookingReviewsResponse, number>
    >(publicKey)
  ).toEqual({ pages: [firstPublicPage], pageParams: [0] });
  expect(
    queryClient.getQueryData<InfiniteData<MyCookingReviewsResponse, number>>(
      myKey
    )
  ).toEqual({ pages: [firstMyPage], pageParams: [0] });
  expect(queryClient.getQueryState(publicKey)?.isInvalidated).toBe(true);
  expect(queryClient.getQueryState(myKey)?.isInvalidated).toBe(true);
  expect(queryClient.getQueryState(recipeKey)?.isInvalidated).toBe(true);
  expect(queryClient.getQueryState(recordDetailKey)?.isInvalidated).toBe(true);
  expect(queryClient.getQueryState(recordListKey)?.isInvalidated).toBe(true);

  act(() => {
    publicRefetch.resolve({ totalCount: 1, items: [], hasNext: true });
  });
  await waitFor(() =>
    expect(queryClient.getQueryState(publicKey)?.fetchStatus).toBe("idle")
  );
  expect(result.current.isPending).toBe(true);

  act(() => {
    myRefetch.resolve({ items: [], hasNext: true });
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(publicPagesRequested).toEqual([0]);
  expect(myPagesRequested).toEqual([0]);
});
