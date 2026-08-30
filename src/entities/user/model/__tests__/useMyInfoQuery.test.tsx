import type { PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";

import { api } from "@/shared/api/client";
import { ApiError } from "@/shared/api/errors";

import { useMyInfoQuery } from "../hooks";
import { useUserStore } from "../store";
import type { User } from "../types";

jest.mock("@/shared/api/client", () => ({
  api: {
    get: jest.fn(),
  },
}));

const getMock = jest.mocked(api.get);

const signedInUser: User = {
  id: "user-1",
  nickname: "recipio",
  profileImage: "",
  hasFirstRecord: false,
  remainingAiQuota: 0,
  remainingYoutubeQuota: 0,
};

const makeWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { gcTime: Infinity } },
  });

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return Wrapper;
};

describe("useMyInfoQuery", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    getMock.mockReset();
    useUserStore.setState({
      user: signedInUser,
      isAuthenticated: true,
      isAuthReady: true,
      isLoggingOut: false,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("T-AUTH-01: 일시적인 /me 실패는 확인된 로그인 상태를 지우지 않습니다", async () => {
    getMock.mockRejectedValue(
      new ApiError(408, "Request Timeout", "Request timed out")
    );

    const { result } = renderHook(() => useMyInfoQuery(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await jest.runAllTimersAsync();
    });

    expect(result.current.isError).toBe(true);
    expect(useUserStore.getState()).toMatchObject({
      user: signedInUser,
      isAuthenticated: true,
      isAuthReady: true,
    });
  });

  it("T-AUTH-02: /me의 401 응답은 기존 로그인 상태를 비웁니다", async () => {
    getMock.mockRejectedValue(new ApiError(401, "Unauthorized"));

    const { result } = renderHook(() => useMyInfoQuery(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await jest.runAllTimersAsync();
    });

    expect(result.current.isError).toBe(true);
    expect(useUserStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
      isAuthReady: true,
    });
  });
});
