import type { PropsWithChildren } from "react";

import {
  QueryClient,
  type QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import { api } from "@/shared/api/client";

import { useMyCookingReviews, useRecipeCookingReviews } from "../hooks";

jest.mock("@/shared/api/client", () => ({
  api: {
    get: jest.fn(),
  },
}));

const getMock = jest.mocked(api.get);

const makeWrapper = (config?: QueryClientConfig) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
    ...config,
  });

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { Wrapper, queryClient };
};

describe("cooking-review infinite query hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hasNext가 true이면 다음 pageParam으로 다음 페이지를 요청합니다", async () => {
    getMock
      .mockResolvedValueOnce({ totalCount: 2, items: [], hasNext: true })
      .mockResolvedValueOnce({ totalCount: 2, items: [], hasNext: false });
    const { Wrapper, queryClient } = makeWrapper();
    const { result } = renderHook(
      () =>
        useRecipeCookingReviews({
          recipeId: "recipe-page",
          photoOnly: false,
          size: 20,
          locale: "ko",
          enabled: true,
        }),
      { wrapper: Wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(getMock).toHaveBeenNthCalledWith(2, "/recipes/recipe-page/reviews", {
      params: { page: 1, size: 20, photoOnly: false },
    });
    await waitFor(() =>
      expect(
        queryClient.getQueryData([
          "cooking-review",
          "public",
          "recipe-page",
          false,
          20,
        ])
      ).toMatchObject({ pages: [{ hasNext: true }, { hasNext: false }] })
    );
  });

  it("공개 후기는 호출 화면이 비활성화되거나 locale이 KO가 아니면 요청하지 않습니다", async () => {
    const { Wrapper } = makeWrapper();
    const first = renderHook(
      () =>
        useRecipeCookingReviews({
          recipeId: "recipe-gate",
          locale: "ko",
          enabled: false,
        }),
      { wrapper: Wrapper }
    );
    first.unmount();
    renderHook(
      () =>
        useRecipeCookingReviews({
          recipeId: "recipe-gate",
          locale: "ja",
          enabled: true,
        }),
      { wrapper: Wrapper }
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getMock).not.toHaveBeenCalled();
  });

  it("내 후기는 인증 gate가 활성화되고 locale이 KO일 때만 요청합니다", async () => {
    getMock.mockResolvedValue({ items: [], hasNext: false });
    const disabled = makeWrapper();
    const first = renderHook(
      () => useMyCookingReviews({ size: 20, locale: "ko", enabled: false }),
      { wrapper: disabled.Wrapper }
    );
    first.unmount();
    const translated = makeWrapper();
    const second = renderHook(
      () => useMyCookingReviews({ size: 20, locale: "en", enabled: true }),
      { wrapper: translated.Wrapper }
    );
    second.unmount();
    expect(getMock).not.toHaveBeenCalled();

    const enabled = makeWrapper();
    const { result } = renderHook(
      () => useMyCookingReviews({ size: 20, locale: "ko", enabled: true }),
      { wrapper: enabled.Wrapper }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith("/me/reviews", {
      params: { page: 0, size: 20 },
    });
  });
});
