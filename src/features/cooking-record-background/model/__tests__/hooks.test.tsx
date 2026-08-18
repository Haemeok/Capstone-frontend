import type { ReactNode } from "react";

import type { InfiniteData } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";

import { dispatchForceLogoutEvent } from "@/shared/api/auth";
import { ApiError } from "@/shared/api/errors";

import type {
  CookingRecordListResponse,
  StickerBookBackgroundListResponse,
} from "@/entities/recipe";
import { COOKING_RECORD_QUERY_KEYS } from "@/entities/recipe";

import { updateStickerBookBackground } from "../api";
import { useUpdateStickerBookBackground } from "../hooks";

jest.mock("../api", () => ({ updateStickerBookBackground: jest.fn() }));
jest.mock("@/shared/api/auth", () => ({ dispatchForceLogoutEvent: jest.fn() }));

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

it("변경 성공 응답으로 모든 기록 페이지의 배경과 목록 선택 상태를 갱신합니다", async () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  const recordKey = COOKING_RECORD_QUERY_KEYS.list({
    size: 30,
    locale: "ko",
  });
  const recordPage: CookingRecordListResponse = {
    background: { backgroundKey: "DEFAULT", imageUrl: null },
    groups: [],
    hasNext: false,
  };
  queryClient.setQueryData<InfiniteData<CookingRecordListResponse, number>>(
    recordKey,
    { pages: [recordPage, recordPage], pageParams: [0, 1] }
  );
  queryClient.setQueryData<StickerBookBackgroundListResponse>(
    COOKING_RECORD_QUERY_KEYS.backgrounds,
    {
      items: [
        { backgroundKey: "DEFAULT", imageUrl: null, selected: true },
        {
          backgroundKey: "PAPER_BEIGE",
          imageUrl: "https://cdn.example.com/paper-beige.webp",
          selected: false,
        },
      ],
    }
  );
  jest.mocked(updateStickerBookBackground).mockResolvedValue({
    backgroundKey: "PAPER_BEIGE",
    imageUrl: "https://cdn.example.com/paper-beige.webp",
  });

  const { result } = renderHook(() => useUpdateStickerBookBackground(), {
    wrapper: createWrapper(queryClient),
  });

  await act(async () => {
    await result.current.mutateAsync({ backgroundKey: "PAPER_BEIGE" });
  });

  const records =
    queryClient.getQueryData<InfiniteData<CookingRecordListResponse, number>>(
      recordKey
    );
  expect(records?.pages.map((page) => page.background)).toEqual([
    {
      backgroundKey: "PAPER_BEIGE",
      imageUrl: "https://cdn.example.com/paper-beige.webp",
    },
    {
      backgroundKey: "PAPER_BEIGE",
      imageUrl: "https://cdn.example.com/paper-beige.webp",
    },
  ]);
  expect(
    queryClient
      .getQueryData<StickerBookBackgroundListResponse>(
        COOKING_RECORD_QUERY_KEYS.backgrounds
      )
      ?.items.map(({ backgroundKey, selected }) => ({
        backgroundKey,
        selected,
      }))
  ).toEqual([
    { backgroundKey: "DEFAULT", selected: false },
    { backgroundKey: "PAPER_BEIGE", selected: true },
  ]);
});

it("선택할 수 없는 배경 오류면 배경 목록만 다시 조회합니다", async () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  const refetchQueries = jest
    .spyOn(queryClient, "refetchQueries")
    .mockResolvedValue();
  jest
    .mocked(updateStickerBookBackground)
    .mockRejectedValue(new ApiError(400, "Bad Request", { code: 901 }));
  const { result } = renderHook(() => useUpdateStickerBookBackground(), {
    wrapper: createWrapper(queryClient),
  });

  await act(async () => {
    await expect(
      result.current.mutateAsync({ backgroundKey: "INACTIVE" })
    ).rejects.toBeInstanceOf(ApiError);
  });

  expect(refetchQueries).toHaveBeenCalledWith({
    queryKey: COOKING_RECORD_QUERY_KEYS.backgrounds,
  });
});

it("사용자를 찾을 수 없는 오류면 인증 상태를 강제로 정리합니다", async () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  jest
    .mocked(updateStickerBookBackground)
    .mockRejectedValue(new ApiError(404, "Not Found", { code: 101 }));
  const { result } = renderHook(() => useUpdateStickerBookBackground(), {
    wrapper: createWrapper(queryClient),
  });

  await act(async () => {
    await expect(
      result.current.mutateAsync({ backgroundKey: "DEFAULT" })
    ).rejects.toBeInstanceOf(ApiError);
  });

  expect(dispatchForceLogoutEvent).toHaveBeenCalledWith("USER_NOT_FOUND");
});
