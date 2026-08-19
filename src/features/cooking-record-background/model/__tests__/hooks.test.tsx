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

import {
  deleteCustomStickerBookBackground,
  prepareCustomStickerBookBackground,
  registerCustomStickerBookBackground,
  updateStickerBookBackground,
} from "../api";
import {
  useCreateCustomStickerBookBackground,
  useDeleteCustomStickerBookBackground,
  useUpdateStickerBookBackground,
} from "../hooks";

jest.mock("../api", () => ({
  deleteCustomStickerBookBackground: jest.fn(),
  prepareCustomStickerBookBackground: jest.fn(),
  registerCustomStickerBookBackground: jest.fn(),
  updateStickerBookBackground: jest.fn(),
}));
jest.mock("@/shared/api/auth", () => ({ dispatchForceLogoutEvent: jest.fn() }));

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
});

it("등록한 CUSTOM을 목록 앞에 추가하지만 서버 선택 상태는 유지합니다", async () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  queryClient.setQueryData<StickerBookBackgroundListResponse>(
    COOKING_RECORD_QUERY_KEYS.backgrounds,
    {
      items: [
        {
          backgroundKey: "DEFAULT",
          backgroundType: "PRESET",
          imageUrl: null,
          selected: true,
        },
      ],
    }
  );
  jest.mocked(prepareCustomStickerBookBackground).mockResolvedValue({
    imageKey: "images/sticker-book/custom.webp",
  });
  jest.mocked(registerCustomStickerBookBackground).mockResolvedValue({
    backgroundKey: "C_custom1",
    backgroundType: "CUSTOM",
    imageUrl: "https://cdn.example.com/custom.webp",
  });
  const { result } = renderHook(() => useCreateCustomStickerBookBackground(), {
    wrapper: createWrapper(queryClient),
  });
  const file = new File(["image"], "custom.jpg", { type: "image/jpeg" });

  await act(async () => {
    await result.current.createCustomBackground(file);
  });

  expect(prepareCustomStickerBookBackground).toHaveBeenCalledWith(file);
  expect(registerCustomStickerBookBackground).toHaveBeenCalledWith({
    imageKey: "images/sticker-book/custom.webp",
  });
  expect(
    queryClient.getQueryData<StickerBookBackgroundListResponse>(
      COOKING_RECORD_QUERY_KEYS.backgrounds
    )
  ).toEqual({
    items: [
      {
        backgroundKey: "C_custom1",
        backgroundType: "CUSTOM",
        imageUrl: "https://cdn.example.com/custom.webp",
        selected: false,
      },
      {
        backgroundKey: "DEFAULT",
        backgroundType: "PRESET",
        imageUrl: null,
        selected: true,
      },
    ],
  });
});

it("409/807이면 등록만 2초 간격으로 세 번 재시도하고 업로드 준비는 반복하지 않습니다", async () => {
  jest.useFakeTimers();
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  jest.mocked(prepareCustomStickerBookBackground).mockResolvedValue({
    imageKey: "images/sticker-book/custom.webp",
  });
  jest
    .mocked(registerCustomStickerBookBackground)
    .mockRejectedValue(new ApiError(409, "Conflict", { code: 807 }));
  const { result } = renderHook(() => useCreateCustomStickerBookBackground(), {
    wrapper: createWrapper(queryClient),
  });
  let promise: Promise<unknown> | undefined;

  await act(async () => {
    promise = result.current.createCustomBackground(
      new File(["image"], "custom.jpg", { type: "image/jpeg" })
    );
    await Promise.resolve();
  });
  const rejection = expect(promise).rejects.toMatchObject({ status: 409 });
  expect(registerCustomStickerBookBackground).toHaveBeenCalledTimes(1);

  for (let retryIndex = 0; retryIndex < 3; retryIndex += 1) {
    await act(async () => {
      await jest.advanceTimersByTimeAsync(2000);
    });
    expect(registerCustomStickerBookBackground).toHaveBeenCalledTimes(
      retryIndex + 2
    );
  }

  await rejection;
  expect(prepareCustomStickerBookBackground).toHaveBeenCalledTimes(1);
});

it("807 자동 재시도 소진 후 같은 imageKey로 등록만 다시 시도할 수 있습니다", async () => {
  jest.useFakeTimers();
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  jest.mocked(prepareCustomStickerBookBackground).mockResolvedValue({
    imageKey: "images/sticker-book/custom.webp",
  });
  jest
    .mocked(registerCustomStickerBookBackground)
    .mockRejectedValue(new ApiError(409, "Conflict", { code: 807 }));
  const { result } = renderHook(() => useCreateCustomStickerBookBackground(), {
    wrapper: createWrapper(queryClient),
  });
  let promise: Promise<unknown> | undefined;

  await act(async () => {
    promise = result.current.createCustomBackground(
      new File(["image"], "custom.jpg", { type: "image/jpeg" })
    );
    await Promise.resolve();
  });
  const rejection = expect(promise).rejects.toMatchObject({ status: 409 });
  await act(async () => {
    await jest.advanceTimersByTimeAsync(6000);
  });
  await rejection;
  jest.mocked(registerCustomStickerBookBackground).mockResolvedValue({
    backgroundKey: "C_custom1",
    backgroundType: "CUSTOM",
    imageUrl: "https://cdn.example.com/custom.webp",
  });

  await act(async () => {
    await result.current.retryRegistration();
  });

  expect(prepareCustomStickerBookBackground).toHaveBeenCalledTimes(1);
  expect(registerCustomStickerBookBackground).toHaveBeenLastCalledWith({
    imageKey: "images/sticker-book/custom.webp",
  });
});

it("변경 성공 응답으로 모든 기록 페이지의 배경과 목록 선택 상태를 갱신합니다", async () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  const recordKey = COOKING_RECORD_QUERY_KEYS.list({
    size: 30,
    locale: "ko",
  });
  const recordPage: CookingRecordListResponse = {
    background: {
      backgroundKey: "DEFAULT",
      backgroundType: "PRESET",
      imageUrl: null,
    },
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
        {
          backgroundKey: "DEFAULT",
          backgroundType: "PRESET",
          imageUrl: null,
          selected: true,
        },
        {
          backgroundKey: "PAPER_BEIGE",
          backgroundType: "PRESET",
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
      backgroundType: "PRESET",
      imageUrl: "https://cdn.example.com/paper-beige.webp",
    },
    {
      backgroundKey: "PAPER_BEIGE",
      backgroundType: "PRESET",
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

it("미적용 CUSTOM 삭제는 배경 목록에서만 제거합니다", async () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  queryClient.setQueryData<StickerBookBackgroundListResponse>(
    COOKING_RECORD_QUERY_KEYS.backgrounds,
    {
      items: [
        {
          backgroundKey: "C_custom1",
          backgroundType: "CUSTOM",
          imageUrl: "https://cdn.example.com/custom.webp",
          selected: false,
        },
        {
          backgroundKey: "DEFAULT",
          backgroundType: "PRESET",
          imageUrl: null,
          selected: true,
        },
      ],
    }
  );
  const invalidateQueries = jest
    .spyOn(queryClient, "invalidateQueries")
    .mockResolvedValue();
  jest.mocked(deleteCustomStickerBookBackground).mockResolvedValue(undefined);
  const { result } = renderHook(() => useDeleteCustomStickerBookBackground(), {
    wrapper: createWrapper(queryClient),
  });

  await act(async () => {
    await result.current.mutateAsync({
      backgroundKey: "C_custom1",
      wasApplied: false,
    });
  });

  expect(
    queryClient
      .getQueryData<StickerBookBackgroundListResponse>(
        COOKING_RECORD_QUERY_KEYS.backgrounds
      )
      ?.items.map((item) => item.backgroundKey)
  ).toEqual(["DEFAULT"]);
  expect(invalidateQueries).not.toHaveBeenCalled();
});

it("적용 중인 CUSTOM 삭제는 기본 배경 복구를 반영하도록 배경과 기록을 다시 조회합니다", async () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  const invalidateQueries = jest
    .spyOn(queryClient, "invalidateQueries")
    .mockResolvedValue();
  jest.mocked(deleteCustomStickerBookBackground).mockResolvedValue(undefined);
  const { result } = renderHook(() => useDeleteCustomStickerBookBackground(), {
    wrapper: createWrapper(queryClient),
  });

  await act(async () => {
    await result.current.mutateAsync({
      backgroundKey: "C_applied",
      wasApplied: true,
    });
  });

  expect(invalidateQueries).toHaveBeenCalledWith({
    queryKey: COOKING_RECORD_QUERY_KEYS.backgrounds,
  });
  expect(invalidateQueries).toHaveBeenCalledWith({
    queryKey: COOKING_RECORD_QUERY_KEYS.lists,
  });
});

it("이미 사라진 CUSTOM 삭제 오류면 배경 목록을 다시 조회합니다", async () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  const refetchQueries = jest
    .spyOn(queryClient, "refetchQueries")
    .mockResolvedValue();
  jest
    .mocked(deleteCustomStickerBookBackground)
    .mockRejectedValue(new ApiError(404, "Not Found", { code: 808 }));
  const { result } = renderHook(() => useDeleteCustomStickerBookBackground(), {
    wrapper: createWrapper(queryClient),
  });

  await act(async () => {
    await expect(
      result.current.mutateAsync({
        backgroundKey: "C_missing",
        wasApplied: false,
      })
    ).rejects.toBeInstanceOf(ApiError);
  });

  expect(refetchQueries).toHaveBeenCalledWith({
    queryKey: COOKING_RECORD_QUERY_KEYS.backgrounds,
  });
});
