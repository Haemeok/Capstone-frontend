import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/entities/cart/api", () => ({
  ...jest.requireActual("@/entities/cart/api"),
  addCartItems: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/features/auth/ui/LoginDialog", () => ({
  __esModule: true,
  default: () => null,
}));

import { useToastStore } from "@/shared/ui/toast";

import { addCartItems } from "@/entities/cart/api";
import { useUserStore } from "@/entities/user";

import { AddToCartButton } from "../AddToCartButton";

const addMock = addCartItems as jest.Mock;

const wrapper = ({ children }: React.PropsWithChildren) => {
  const qc = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

const recipeRef = {
  recipeId: "r7KpQ2mA",
  title: "김치찌개",
  imageUrl: "https://example.com/main.webp",
};

beforeEach(() => {
  addMock.mockReset();
  useToastStore.setState({ toastList: [] });
  useUserStore.setState({ user: { id: "u1" } as never, isAuthReady: true });
});

it("T-01: 로그인 유저가 담기 버튼을 누르면 POST + 토스트 + 체크 전환", async () => {
  addMock.mockResolvedValue({
    addedCount: 1,
    skippedCount: 0,
    cartItemIds: ["c8Ab7XyZ"],
  });

  render(
    <AddToCartButton
      recipeIngredientId="ri8AbKcQ"
      name="배추김치"
      quantity="100"
      unit="g"
      servingRatio={1}
      recipe={recipeRef}
    />,
    { wrapper }
  );

  await userEvent.click(
    screen.getByRole("button", { name: "장바구니에 담기" })
  );

  await waitFor(() => {
    expect(addMock).toHaveBeenCalledTimes(1);
    expect(addMock).toHaveBeenCalledWith({
      items: [{ recipeIngredientId: "ri8AbKcQ" }],
    });
    expect(useToastStore.getState().toastList.map((t) => t.message)).toContain(
      "장바구니에 담았어요"
    );
    expect(screen.getByTestId("cart-added-check")).toBeInTheDocument();
  });
});
