import type { PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

import { CART_QUERY_KEYS } from "@/entities/cart";
import { addCartItems } from "@/entities/cart/api";
import { useUserStore } from "@/entities/user";

import { useAddCartItems } from "../useAddCartItems";

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

it("호출 전에는 요청하지 않고, 실행 결과와 캐시 갱신만 제공한다", async () => {
  jest.mocked(addCartItems).mockResolvedValue({
    addedCount: 1,
    skippedCount: 0,
    cartItemIds: ["cart-item"],
  });
  jest.mocked(addCartItems).mockClear();
  jest.mocked(triggerHaptic).mockClear();
  useToastStore.setState({ toastList: [] });
  useUserStore.setState({ user: { id: "user" } as never, isAuthReady: true });
  const client = new QueryClient();
  const invalidate = jest.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(
    () =>
      useAddCartItems({
        recipeIngredientId: "ingredient",
        name: "당근",
        quantity: "100",
        unit: "g",
        servingRatio: 2,
        recipe: { recipeId: "recipe", title: "카레", imageUrl: null },
      }),
    { wrapper }
  );
  expect(addCartItems).not.toHaveBeenCalled();

  await act(async () => {
    await expect(result.current.handleAddItems()).resolves.toEqual({
      status: "added",
      addedCount: 1,
    });
  });

  expect(addCartItems).toHaveBeenCalledWith(
    {
      items: [{ recipeIngredientId: "ingredient", quantity: "200", unit: "g" }],
    },
    "ko"
  );
  expect(invalidate).toHaveBeenCalledWith({ queryKey: CART_QUERY_KEYS.all });
  expect(triggerHaptic).not.toHaveBeenCalled();
  expect(useToastStore.getState().toastList).toEqual([]);
});
