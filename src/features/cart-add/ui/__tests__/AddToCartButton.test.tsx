import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
  unstable_cache: (fn: unknown) => fn,
}));
jest.mock("@/entities/cart/api", () => ({
  ...jest.requireActual("@/entities/cart/api"),
  addCartItems: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("next/navigation", () => ({ usePathname: () => "/cart" }));

import { ApiError } from "@/shared/api/errors";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

import { CART_MAX_ITEMS, useGuestCartStore } from "@/entities/cart";
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
  jest.mocked(triggerHaptic).mockClear();
  localStorage.clear();
  useToastStore.setState({ toastList: [] });
  useGuestCartStore.setState({ items: [], isHydrated: true });
  useUserStore.setState({ user: { id: "u1" } as never, isAuthReady: true });
});

const renderButton = () =>
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

it.each([
  [
    "중복",
    { addedCount: 0, skippedCount: 1, cartItemIds: [] },
    "이미 담긴 재료예요",
  ],
  [
    "추가 없음",
    { addedCount: 0, skippedCount: 0, cartItemIds: [] },
    "담기에 실패했어요. 잠시 후 다시 시도해 주세요",
  ],
])("회원 %s 결과는 성공 표시 없이 안내한다", async (_, response, message) => {
  addMock.mockResolvedValue(response);
  renderButton();
  await userEvent.click(
    screen.getByRole("button", { name: "장바구니에 담기" })
  );
  await waitFor(() =>
    expect(
      useToastStore.getState().toastList.map((toast) => toast.message)
    ).toContain(message)
  );
  expect(triggerHaptic).not.toHaveBeenCalledWith("Success");
  expect(screen.queryByTestId("cart-added-check")).not.toBeInTheDocument();
});

it.each([
  [
    new ApiError(400, "Bad Request", { code: "1403" }),
    "장바구니가 가득 찼어요",
  ],
  [new Error("network"), "담기에 실패했어요. 잠시 후 다시 시도해 주세요"],
])(
  "회원 요청 실패를 안내하고 버튼을 다시 활성화한다",
  async (error, message) => {
    addMock.mockRejectedValue(error);
    renderButton();
    await userEvent.click(
      screen.getByRole("button", { name: "장바구니에 담기" })
    );
    await waitFor(() =>
      expect(
        useToastStore.getState().toastList.map((toast) => toast.message)
      ).toContain(message)
    );
    expect(
      screen.getByRole("button", { name: "장바구니에 담기" })
    ).toBeEnabled();
    expect(triggerHaptic).not.toHaveBeenCalledWith("Success");
  }
);

it("비회원 장바구니가 가득 차면 서버 요청 없이 한도를 안내한다", async () => {
  useUserStore.setState({ user: null });
  useGuestCartStore.setState({
    items: Array.from({ length: CART_MAX_ITEMS }, (_, index) => ({
      recipeIngredientId: `existing-${index}`,
      name: "당근",
      quantity: "1",
      unit: "개",
      recipe: recipeRef,
    })),
  });
  renderButton();
  await userEvent.click(
    screen.getByRole("button", { name: "장바구니에 담기" })
  );
  await waitFor(() =>
    expect(
      useToastStore.getState().toastList.map((toast) => toast.message)
    ).toContain("장바구니가 가득 찼어요")
  );
  expect(addMock).not.toHaveBeenCalled();
  expect(useGuestCartStore.getState().items).toHaveLength(CART_MAX_ITEMS);
});

it("요청 중에는 버튼을 비활성화하고 완료 후 성공 표시를 한다", async () => {
  let finish = () => {};
  addMock.mockReturnValue(
    new Promise((resolve) => {
      finish = () =>
        resolve({ addedCount: 1, skippedCount: 0, cartItemIds: ["item"] });
    })
  );
  renderButton();
  expect(addMock).not.toHaveBeenCalled();
  const button = screen.getByRole("button", { name: "장바구니에 담기" });
  await userEvent.click(button);
  await waitFor(() => expect(button).toBeDisabled());
  await userEvent.click(button);
  expect(addMock).toHaveBeenCalledTimes(1);
  await act(async () => finish());
  await waitFor(() =>
    expect(screen.getByTestId("cart-added-check")).toBeInTheDocument()
  );
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
    expect(addMock).toHaveBeenCalledWith(
      {
        items: [{ recipeIngredientId: "ri8AbKcQ", quantity: "100", unit: "g" }],
      },
      "ko"
    );
    expect(useToastStore.getState().toastList.map((t) => t.message)).toContain(
      "장바구니에 담았어요"
    );
    expect(screen.getByTestId("cart-added-check")).toBeInTheDocument();
  });
});

it("T-28: 비로그인 담기는 게스트 store에 저장하고 POST를 부르지 않는다", async () => {
  useUserStore.setState({ user: null, isAuthReady: true });
  useGuestCartStore.setState({ items: [], isHydrated: true });

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

  expect(addMock).not.toHaveBeenCalled();
  const items = useGuestCartStore.getState().items;
  expect(items).toEqual([
    {
      recipeIngredientId: "ri8AbKcQ",
      name: "배추김치",
      quantity: "100",
      unit: "g",
      recipe: {
        recipeId: "r7KpQ2mA",
        title: "김치찌개",
        imageUrl: "https://example.com/main.webp",
      },
    },
  ]);
  expect(useToastStore.getState().toastList.map((t) => t.message)).toContain(
    "장바구니에 담았어요"
  );
  expect(triggerHaptic).toHaveBeenCalledWith("Success");
  expect(screen.getByTestId("cart-added-check")).toBeInTheDocument();
});

it("T-28: 게스트 중복 담기는 skip 안내가 뜬다", async () => {
  useUserStore.setState({ user: null, isAuthReady: true });
  useGuestCartStore.setState({
    items: [
      {
        recipeIngredientId: "ri8AbKcQ",
        name: "배추김치",
        quantity: "100",
        unit: "g",
        recipe: { recipeId: "r7KpQ2mA", title: "김치찌개", imageUrl: null },
      },
    ],
    isHydrated: true,
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

  expect(addMock).not.toHaveBeenCalled();
  expect(useGuestCartStore.getState().items).toHaveLength(1);
  expect(useToastStore.getState().toastList.map((t) => t.message)).toContain(
    "이미 담긴 재료예요"
  );
  expect(screen.queryByTestId("cart-added-check")).not.toBeInTheDocument();
});
