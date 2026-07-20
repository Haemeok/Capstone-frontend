import { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { getIngredients } from "@/entities/ingredient";
import type { User } from "@/entities/user";
import { useUserStore } from "@/entities/user/model/store";

import { useInfiniteIngredients } from "../useInfiniteIngredients";

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

jest.mock("@/entities/ingredient", () => ({
  ...jest.requireActual("@/entities/ingredient"),
  getIngredients: jest.fn(),
}));

const mockedGetIngredients = getIngredients as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const PARAMS = { category: "전체", sort: "asc" } as const;

beforeEach(() => {
  mockedGetIngredients.mockReset().mockResolvedValue({
    content: [],
    page: { totalElements: 0, number: 0, totalPages: 1 },
  });
});

it("비로그인이면 내 냉장고 재료를 호출하지 않는다 (T-17)", () => {
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
    isAuthReady: true,
  });
  renderHook(() => useInfiniteIngredients(PARAMS), {
    wrapper: createWrapper(),
  });
  expect(mockedGetIngredients).not.toHaveBeenCalled();
});

it("로그인이면 isMine:true로 호출한다 (T-17)", async () => {
  useUserStore.setState({
    user: { id: "u1" } as User,
    isAuthenticated: true,
    isAuthReady: true,
  });
  renderHook(() => useInfiniteIngredients(PARAMS), {
    wrapper: createWrapper(),
  });
  await waitFor(() =>
    expect(mockedGetIngredients).toHaveBeenCalledWith(
      expect.objectContaining({ isMine: true })
    )
  );
});
