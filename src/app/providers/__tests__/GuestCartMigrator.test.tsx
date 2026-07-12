import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react";

jest.mock("@/entities/cart/api", () => ({
  ...jest.requireActual("@/entities/cart/api"),
  addCartItems: jest.fn(),
}));
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
  unstable_cache: (fn: unknown) => fn,
}));
const mockPathname = jest.fn(() => "/");
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

import { useToastStore } from "@/shared/ui/toast";

import { CART_QUERY_KEYS, useGuestCartStore } from "@/entities/cart";
import { addCartItems } from "@/entities/cart/api";
import { type User, useUserStore } from "@/entities/user";

import { GuestCartMigrator } from "../GuestCartMigrator";

const addMock = addCartItems as jest.Mock;

const guestItem = (id: string) => ({
  recipeIngredientId: id,
  name: "배추김치",
  quantity: "100",
  unit: "g",
  recipe: { recipeId: "r7KpQ2mA", title: "김치찌개", imageUrl: null },
});

const renderMigrator = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={qc}>
      <GuestCartMigrator />
    </QueryClientProvider>
  );
  return qc;
};

beforeEach(() => {
  addMock.mockReset();
  mockPathname.mockReturnValue("/");
  window.localStorage.clear();
  useToastStore.setState({ toastList: [] });
});

it("T-37: 게스트 항목이 있는 로그인 상태에서 마운트되면 이관·clear·토스트", async () => {
  useGuestCartStore.setState({
    items: [guestItem("ri1"), guestItem("ri2"), guestItem("ri3")],
    isHydrated: true,
  });
  useUserStore.setState({ user: { id: "u1" } as User, isAuthReady: true });
  addMock.mockResolvedValue({
    addedCount: 3,
    skippedCount: 0,
    cartItemIds: [],
  });

  const qc = renderMigrator();
  const invalidateSpy = jest.spyOn(qc, "invalidateQueries");

  await waitFor(() => {
    expect(addMock).toHaveBeenCalledTimes(1);
    expect(addMock).toHaveBeenCalledWith(
      {
        items: [
          { recipeIngredientId: "ri1", quantity: "100", unit: "g" },
          { recipeIngredientId: "ri2", quantity: "100", unit: "g" },
          { recipeIngredientId: "ri3", quantity: "100", unit: "g" },
        ],
      },
      "ko"
    );
    expect(useGuestCartStore.getState().items).toHaveLength(0);
    expect(useToastStore.getState().toastList.map((t) => t.message)).toContain(
      "장바구니 3개를 계정으로 옮겼어요"
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: CART_QUERY_KEYS.all,
    });
  });
});

it("T-11: /ja 경로에서 이관하면 현재 언어 ja로 추가한다", async () => {
  mockPathname.mockReturnValue("/ja/recipes/r7KpQ2mA");
  useGuestCartStore.setState({ items: [guestItem("ri1")], isHydrated: true });
  useUserStore.setState({ user: { id: "u1" } as User, isAuthReady: true });
  addMock.mockResolvedValue({
    addedCount: 1,
    skippedCount: 0,
    cartItemIds: [],
  });

  renderMigrator();

  await waitFor(() => {
    expect(addMock).toHaveBeenCalledWith(expect.anything(), "ja");
  });
});

it("T-38: 이관 실패 시 로컬이 보존된다", async () => {
  useGuestCartStore.setState({ items: [guestItem("ri1")], isHydrated: true });
  useUserStore.setState({ user: { id: "u1" } as User, isAuthReady: true });
  addMock.mockRejectedValue(new Error("network"));

  renderMigrator();

  await waitFor(() => expect(addMock).toHaveBeenCalled());
  expect(useGuestCartStore.getState().items).toHaveLength(1);

  // 실패가 재시도 루프를 만들지 않는다
  await new Promise((r) => setTimeout(r, 50));
  expect(addMock).toHaveBeenCalledTimes(1);
});

it("T-39: 게스트 항목이 없으면 이관을 호출하지 않는다", async () => {
  useGuestCartStore.setState({ items: [], isHydrated: true });
  useUserStore.setState({ user: { id: "u1" } as User, isAuthReady: true });

  renderMigrator();

  await new Promise((r) => setTimeout(r, 50));
  expect(addMock).not.toHaveBeenCalled();
});

it("T-39b: 비로그인 상태에선 이관하지 않는다", async () => {
  useGuestCartStore.setState({ items: [guestItem("ri1")], isHydrated: true });
  useUserStore.setState({ user: null, isAuthReady: true });

  renderMigrator();

  await new Promise((r) => setTimeout(r, 50));
  expect(addMock).not.toHaveBeenCalled();
});
