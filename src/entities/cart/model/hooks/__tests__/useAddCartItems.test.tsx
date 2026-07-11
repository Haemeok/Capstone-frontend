import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

import { ApiError } from "@/shared/api/errors";

jest.mock("@/entities/cart/api", () => ({
  ...jest.requireActual("@/entities/cart/api"),
  addCartItems: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

import { useToastStore } from "@/shared/ui/toast";

import { addCartItems } from "@/entities/cart/api";

import { useAddCartItems } from "../useAddCartItems";

const addMock = addCartItems as jest.Mock;

const wrapper = ({ children }: React.PropsWithChildren) => {
  const qc = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

beforeEach(() => {
  addMock.mockReset();
  useToastStore.setState({ toastList: [] });
});

describe("useAddCartItems", () => {
  it("T-04: skippedCount만 있으면 '이미 담긴 재료' 안내를 띄운다", async () => {
    addMock.mockResolvedValue({
      addedCount: 0,
      skippedCount: 1,
      cartItemIds: [],
    });
    const { result } = renderHook(() => useAddCartItems(), { wrapper });

    await act(async () => {
      result.current.mutate({ items: [{ recipeIngredientId: "ri8AbKcQ" }] });
    });

    await waitFor(() => {
      const messages = useToastStore.getState().toastList.map((t) => t.message);
      expect(messages).toContain("이미 담긴 재료예요");
      expect(messages).not.toContain("장바구니에 담았어요");
    });
  });

  it("T-05: 에러 1403이면 '가득 찼어요' 안내를 띄운다", async () => {
    addMock.mockRejectedValue(
      new ApiError(400, "Bad Request", { code: "1403", message: "limit" })
    );
    const { result } = renderHook(() => useAddCartItems(), { wrapper });

    await act(async () => {
      result.current.mutate({ items: [{ recipeIngredientId: "ri8AbKcQ" }] });
    });

    await waitFor(() => {
      const messages = useToastStore.getState().toastList.map((t) => t.message);
      expect(messages).toContain("장바구니가 가득 찼어요");
    });
  });
});
