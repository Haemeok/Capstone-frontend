import { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";

import { getMyIngredientIds } from "../api";
import { useMyIngredientIds } from "../hooks";

jest.mock("../api", () => ({
  ...jest.requireActual("../api"),
  getMyIngredientIds: jest.fn(),
}));

const mockedGetIds = getMyIngredientIds as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const DISABLED = { enabled: false };

it("게이트가 닫히면 재료 id 목록을 호출하지 않는다 (T-15)", () => {
  mockedGetIds.mockResolvedValue(["i1"]);
  renderHook(() => useMyIngredientIds(DISABLED), {
    wrapper: createWrapper(),
  });
  expect(mockedGetIds).not.toHaveBeenCalled();
});
