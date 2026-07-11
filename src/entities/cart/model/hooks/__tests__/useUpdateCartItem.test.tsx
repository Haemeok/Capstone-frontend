import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

jest.mock("@/entities/cart/api", () => ({
  ...jest.requireActual("@/entities/cart/api"),
  updateCartItem: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

import { useToastStore } from "@/shared/ui/toast";

import { updateCartItem } from "@/entities/cart/api";

import { useUpdateCartItem } from "../useUpdateCartItem";

const updateMock = updateCartItem as jest.Mock;

const wrapper = ({ children }: React.PropsWithChildren) => {
  const qc = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

beforeEach(() => {
  updateMock.mockReset();
  useToastStore.setState({ toastList: [] });
});

describe("useUpdateCartItem", () => {
  it("T-15: '약간' 같은 자유 텍스트를 그대로 전송한다", async () => {
    updateMock.mockResolvedValue(undefined);
    const { result } = renderHook(() => useUpdateCartItem(), { wrapper });

    await act(async () => {
      result.current.mutate({
        cartItemId: "c9Lm2PqA",
        quantity: "약간",
        unit: "",
      });
    });

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith("c9Lm2PqA", {
        quantity: "약간",
        unit: "",
      });
    });
  });

  it("실패 시 수정 실패 토스트를 띄운다", async () => {
    updateMock.mockRejectedValue(new Error("network"));
    const { result } = renderHook(() => useUpdateCartItem(), { wrapper });

    await act(async () => {
      result.current.mutate({
        cartItemId: "c9Lm2PqA",
        quantity: "2",
        unit: "큰술",
      });
    });

    await waitFor(() => {
      const messages = useToastStore.getState().toastList.map((t) => t.message);
      expect(messages).toContain("수정에 실패했어요");
    });
  });
});
