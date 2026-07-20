import { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { getRecipeHistory } from "@/entities/recipe/model/api";
import type { User } from "@/entities/user";
import { getUserStreak } from "@/entities/user/model/api";
import { useUserStore } from "@/entities/user/model/store";

import { useRecipeHistoryQuery, useUserStreakQuery } from "../hooks";

jest.mock("@/entities/recipe/model/api", () => ({
  ...jest.requireActual("@/entities/recipe/model/api"),
  getRecipeHistory: jest.fn(),
}));

jest.mock("@/entities/user/model/api", () => ({
  ...jest.requireActual("@/entities/user/model/api"),
  getUserStreak: jest.fn(),
}));

const mockedGetHistory = getRecipeHistory as jest.Mock;
const mockedGetStreak = getUserStreak as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const HISTORY_PARAMS = { year: 2026, month: 7 };

beforeEach(() => {
  mockedGetHistory.mockReset().mockResolvedValue({ dailySummaries: [] });
  mockedGetStreak.mockReset().mockResolvedValue({ current: 0 });
});

it("비로그인이면 streak·calendar를 호출하지 않는다 (T-12)", () => {
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
    isAuthReady: true,
  });
  renderHook(() => useUserStreakQuery(), { wrapper: createWrapper() });
  renderHook(() => useRecipeHistoryQuery(HISTORY_PARAMS), {
    wrapper: createWrapper(),
  });
  expect(mockedGetStreak).not.toHaveBeenCalled();
  expect(mockedGetHistory).not.toHaveBeenCalled();
});

it("로그인이면 streak·calendar를 각 1회 호출한다 (T-18)", async () => {
  useUserStore.setState({
    user: { id: "u1" } as User,
    isAuthenticated: true,
    isAuthReady: true,
  });
  renderHook(() => useUserStreakQuery(), { wrapper: createWrapper() });
  renderHook(() => useRecipeHistoryQuery(HISTORY_PARAMS), {
    wrapper: createWrapper(),
  });
  await waitFor(() => expect(mockedGetStreak).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockedGetHistory).toHaveBeenCalledTimes(1));
});
