import { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { getRecipeBookDetail } from "@/entities/recipe-book/api";

import { useRecipeBookDetail } from "../useRecipeBookDetail";

jest.mock("@/entities/recipe-book/api", () => ({
  ...jest.requireActual("@/entities/recipe-book/api"),
  getRecipeBookDetail: jest.fn(),
}));

const mockedGetDetail = getRecipeBookDetail as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const ENABLED = { enabled: true };
const DISABLED = { enabled: false };

beforeEach(() => {
  mockedGetDetail.mockReset();
  mockedGetDetail.mockResolvedValue({ content: [] });
});

it("게이트가 닫히면 bookId가 있어도 호출하지 않는다 (T-11)", () => {
  renderHook(() => useRecipeBookDetail("b1", undefined, DISABLED), {
    wrapper: createWrapper(),
  });
  expect(mockedGetDetail).not.toHaveBeenCalled();
});

it("게이트가 열려도 bookId가 비면 호출하지 않는다 (T-11)", () => {
  renderHook(() => useRecipeBookDetail("", undefined, ENABLED), {
    wrapper: createWrapper(),
  });
  expect(mockedGetDetail).not.toHaveBeenCalled();
});

it("게이트 열림 ∧ bookId 있음이면 호출한다 (T-11)", async () => {
  renderHook(() => useRecipeBookDetail("b1", undefined, ENABLED), {
    wrapper: createWrapper(),
  });
  await waitFor(() => expect(mockedGetDetail).toHaveBeenCalledTimes(1));
});
