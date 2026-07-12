import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

jest.mock("@/entities/cart/api", () => ({
  ...jest.requireActual("@/entities/cart/api"),
  getCart: jest.fn(),
  deleteCartItem: jest.fn(),
  deleteCartItemsBulk: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("next/navigation", () => ({ usePathname: () => "/cart" }));

import { ApiError } from "@/shared/api/client";
import { useToastStore } from "@/shared/ui/toast";

import {
  deleteCartItem,
  deleteCartItemsBulk,
  getCart,
} from "@/entities/cart/api";
import { cartFixture } from "@/entities/cart/model/__tests__/fixtures";
import { CART_QUERY_KEYS } from "@/entities/cart/model/queryKeys";

import { useDeleteCartItems } from "../useDeleteCartItems";

const getCartMock = getCart as jest.Mock;
const deleteOneMock = deleteCartItem as jest.Mock;
const deleteBulkMock = deleteCartItemsBulk as jest.Mock;

beforeEach(() => {
  getCartMock.mockReset();
  deleteOneMock.mockReset();
  deleteBulkMock.mockReset();
  getCartMock.mockResolvedValue(cartFixture);
  useToastStore.setState({ toastList: [] });
});

describe("useDeleteCartItems", () => {
  it("T-18: 삭제 실패 시 캐시가 원복되고 에러 토스트가 뜬다", async () => {
    deleteOneMock.mockRejectedValue(new ApiError(500, "Server Error"));
    const qc = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    qc.setQueryData(CART_QUERY_KEYS.byLang("ko"), cartFixture);
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeleteCartItems(), { wrapper });

    await act(async () => {
      result.current.mutate({ cartItemIds: ["c8Ab7XyZ"] });
    });

    await waitFor(() => {
      expect(qc.getQueryData(CART_QUERY_KEYS.byLang("ko"))).toEqual(
        cartFixture
      );
      expect(
        useToastStore.getState().toastList.map((t) => t.message)
      ).toContain("삭제에 실패했어요");
    });
  });
});
