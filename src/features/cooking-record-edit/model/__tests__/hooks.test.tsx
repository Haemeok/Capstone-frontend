import type { ReactNode } from "react";

import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import { ApiError } from "@/shared/api/errors";

import type {
  CookingRecordDetailResponse,
  CookingRecordListResponse,
} from "@/entities/recipe/model/record";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe/model/recordQueryKeys";

import {
  patchCookingRecordImage,
  prepareCookingRecordImage,
  updateCookingRecordMetadata,
} from "../api";
import {
  useReplaceCookingRecordImage,
  useUpdateCookingRecordMetadata,
} from "../hooks";

jest.mock("../api", () => ({
  patchCookingRecordImage: jest.fn(),
  prepareCookingRecordImage: jest.fn(),
  updateCookingRecordMetadata: jest.fn(),
}));

const patchImage = jest.mocked(patchCookingRecordImage);
const prepareImage = jest.mocked(prepareCookingRecordImage);
const updateMetadata = jest.mocked(updateCookingRecordMetadata);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: 3, retryDelay: 1 } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, Wrapper };
};

const createDeferred = <T,>() => {
  let resolve = (_value: T) => {};
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });
  return { promise, resolve };
};

const listPages: CookingRecordListResponse[] = [
  { groups: [{ date: "2026-08-17", records: [] }], hasNext: true },
  { groups: [{ date: "2026-08-16", records: [] }], hasNext: false },
];

const detail: CookingRecordDetailResponse = {
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
};

beforeEach(() => {
  jest.useFakeTimers();
  prepareImage.mockReset().mockResolvedValue({
    recordId: "record-A",
    image: { originalKey: "image-original" },
  });
  patchImage.mockReset();
  updateMetadata.mockReset();
});

afterEach(() => {
  jest.useRealTimers();
});

it("사진 PATCH의 409/807 재시도 중 URL 발급·S3 준비는 반복하지 않습니다", async () => {
  patchImage.mockRejectedValue(
    new ApiError(409, "Conflict", { code: 807, message: "not ready" })
  );
  const { Wrapper } = createWrapper();
  const { result } = renderHook(() => useReplaceCookingRecordImage(), {
    wrapper: Wrapper,
  });

  const promise = result.current.replaceImage({
    recordId: "record-A",
    images: [
      {
        file: new File(["image"], "record.jpg", { type: "image/jpeg" }),
        purpose: "ORIGINAL",
      },
    ],
  });
  const rejection = expect(promise).rejects.toMatchObject({ status: 409 });
  await act(async () => {
    await Promise.resolve();
  });
  expect(patchImage).toHaveBeenCalledTimes(1);

  await act(async () => {
    await jest.advanceTimersByTimeAsync(6000);
  });

  await rejection;
  expect(patchImage).toHaveBeenCalledTimes(4);
  expect(prepareImage).toHaveBeenCalledTimes(1);
});

it("metadata PATCH는 전역 mutation retry 설정과 무관하게 재시도하지 않습니다", async () => {
  updateMetadata.mockRejectedValue(new Error("failed"));
  const { Wrapper } = createWrapper();
  const { result } = renderHook(() => useUpdateCookingRecordMetadata(), {
    wrapper: Wrapper,
  });

  await expect(
    result.current.mutateAsync({
      recordId: "record-A",
      sourceType: "RECIPE",
      recordMemo: "메모",
    })
  ).rejects.toThrow("failed");
  await act(async () => {
    await jest.runAllTimersAsync();
  });

  expect(updateMetadata).toHaveBeenCalledTimes(1);
});

it("metadata 수정은 목록을 첫 페이지로 줄이고 detail·list·calendar를 무효화합니다", async () => {
  updateMetadata.mockResolvedValue({ message: "updated" });
  const { queryClient, Wrapper } = createWrapper();
  const listKey = COOKING_RECORD_QUERY_KEYS.list({ size: 30, locale: "ko" });
  const detailKey = COOKING_RECORD_QUERY_KEYS.detail("record-A", "ko");
  const calendarKey = COOKING_RECORD_QUERY_KEYS.calendarMonth(2026, 8, "ko");
  queryClient.setQueryData(listKey, { pages: listPages, pageParams: [0, 1] });
  queryClient.setQueryData(detailKey, detail);
  queryClient.setQueryData(calendarKey, {
    dailySummaries: [],
    monthlyTotalSavings: 0,
  });
  const { result } = renderHook(() => useUpdateCookingRecordMetadata(), {
    wrapper: Wrapper,
  });

  await act(async () => {
    await result.current.mutateAsync({
      recordId: "record-A",
      sourceType: "RECIPE",
      recordMemo: "수정",
    });
  });

  expect(queryClient.getQueryData(listKey)).toMatchObject({
    pages: [listPages[0]],
    pageParams: [0],
  });
  expect(queryClient.getQueryState(detailKey)?.isInvalidated).toBe(true);
  expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
  expect(queryClient.getQueryState(calendarKey)?.isInvalidated).toBe(true);
});

it("metadata 수정은 detail refetch가 끝날 때까지 mutation pending을 유지합니다", async () => {
  jest.useRealTimers();
  updateMetadata.mockResolvedValue({ message: "updated" });
  const deferredDetail = createDeferred<CookingRecordDetailResponse>();
  const detailQueryFn = jest.fn(() => deferredDetail.promise);
  const { Wrapper } = createWrapper();
  const detailKey = COOKING_RECORD_QUERY_KEYS.detail("record-A", "ko");
  const { result } = renderHook(
    () => {
      useQuery({
        queryKey: detailKey,
        queryFn: detailQueryFn,
        initialData: detail,
        staleTime: Infinity,
      });
      return useUpdateCookingRecordMetadata();
    },
    { wrapper: Wrapper }
  );

  let mutationPromise: Promise<unknown> | undefined;
  act(() => {
    mutationPromise = result.current.mutateAsync({
      recordId: "record-A",
      sourceType: "RECIPE",
      recordMemo: "수정",
    });
  });
  await waitFor(() => expect(detailQueryFn).toHaveBeenCalledTimes(1));
  expect(result.current.isPending).toBe(true);

  deferredDetail.resolve(detail);
  await act(async () => {
    await mutationPromise;
  });
  await waitFor(() => expect(result.current.isPending).toBe(false));
});

it("이미지 수정은 detail refetch를 기다리되 활성 다중-page 목록을 재요청하지 않습니다", async () => {
  jest.useRealTimers();
  prepareImage.mockResolvedValue({
    recordId: "record-A",
    image: { originalKey: "image-original" },
  });
  patchImage.mockResolvedValue({ message: "updated" });
  const deferredDetail = createDeferred<CookingRecordDetailResponse>();
  const listQueryFn = jest.fn(({ pageParam }: { pageParam: number }) =>
    Promise.resolve(listPages[pageParam] ?? listPages[0])
  );
  const detailQueryFn = jest.fn(() => deferredDetail.promise);
  const { Wrapper } = createWrapper();
  const listKey = COOKING_RECORD_QUERY_KEYS.list({ size: 30, locale: "ko" });
  const detailKey = COOKING_RECORD_QUERY_KEYS.detail("record-A", "ko");

  const { result } = renderHook(
    () => {
      useInfiniteQuery({
        queryKey: listKey,
        queryFn: listQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => undefined,
        initialData: { pages: listPages, pageParams: [0, 1] },
        staleTime: Infinity,
      });
      useQuery({
        queryKey: detailKey,
        queryFn: detailQueryFn,
        initialData: detail,
        staleTime: Infinity,
      });
      return useReplaceCookingRecordImage();
    },
    { wrapper: Wrapper }
  );

  let mutationPromise: Promise<unknown> | undefined;
  act(() => {
    mutationPromise = result.current.replaceImage({
      recordId: "record-A",
      images: [
        {
          file: new File(["image"], "record.jpg", { type: "image/jpeg" }),
          purpose: "ORIGINAL",
        },
      ],
    });
  });
  await waitFor(() => expect(detailQueryFn).toHaveBeenCalledTimes(1));

  expect(listQueryFn).not.toHaveBeenCalled();
  expect(result.current.isPending).toBe(true);

  deferredDetail.resolve(detail);
  await act(async () => {
    await mutationPromise;
  });
  await waitFor(() => expect(result.current.isPending).toBe(false));
});
