import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/entities/cart/api", () => ({
  ...jest.requireActual("@/entities/cart/api"),
  getCart: jest.fn(),
}));
// cart 배럴 → useGuestCartView → coupang 배럴 → api.server가 next/cache를 로드
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
  unstable_cache: (fn: unknown) => fn,
}));
jest.mock("next/navigation", () => ({ usePathname: () => "/cart" }));

import {
  CART_QUERY_KEYS,
  type GuestCartItem,
  useGuestCartStore,
} from "@/entities/cart";
import { getCart } from "@/entities/cart/api";
import {
  cartFixture,
  emptyCartFixture,
} from "@/entities/cart/model/__tests__/fixtures";
import { type User, useUserStore } from "@/entities/user";

import { CartCountBadge } from "../ui/CartCountBadge";

const getCartMock = getCart as jest.Mock;

const makeClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

const g = (recipeIngredientId: string): GuestCartItem => ({
  recipeIngredientId,
  name: "재료",
  quantity: "1",
  unit: "개",
  recipe: { recipeId: "r7KpQ2mA", title: "김치찌개", imageUrl: null },
});

beforeEach(() => {
  getCartMock.mockReset();
  useGuestCartStore.setState({ items: [], isHydrated: true });
});

it("T-24: 로그인 유저 배지에 totalItemCount가 보이고 배지 2개 마운트에도 getCart는 1회", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  useUserStore.setState({ user: { id: "u1" } as User, isAuthReady: true });

  render(
    <QueryClientProvider client={makeClient()}>
      <CartCountBadge>
        <span>nav</span>
      </CartCountBadge>
      <CartCountBadge>
        <span>header</span>
      </CartCountBadge>
    </QueryClientProvider>
  );

  const badges = await screen.findAllByTestId("cart-count-badge");
  expect(badges).toHaveLength(2);
  badges.forEach((b) => expect(b).toHaveTextContent("5"));
  expect(getCartMock).toHaveBeenCalledTimes(1);
});

it("T-25: 캐시가 갱신되면 배지 숫자가 바뀐다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  useUserStore.setState({ user: { id: "u1" } as User, isAuthReady: true });
  const qc = makeClient();
  render(
    <QueryClientProvider client={qc}>
      <CartCountBadge>
        <span>nav</span>
      </CartCountBadge>
    </QueryClientProvider>
  );
  await screen.findByTestId("cart-count-badge");

  act(() => {
    qc.setQueryData(CART_QUERY_KEYS.byLang("ko"), {
      ...cartFixture,
      totalItemCount: 6,
    });
  });

  await waitFor(() =>
    expect(screen.getByTestId("cart-count-badge")).toHaveTextContent("6")
  );
});

it("T-26: 0개면 배지가 렌더되지 않는다", async () => {
  getCartMock.mockResolvedValue(emptyCartFixture);
  useUserStore.setState({ user: { id: "u1" } as User, isAuthReady: true });
  render(
    <QueryClientProvider client={makeClient()}>
      <CartCountBadge>
        <span>nav</span>
      </CartCountBadge>
    </QueryClientProvider>
  );

  await waitFor(() => expect(getCartMock).toHaveBeenCalled());
  expect(screen.queryByTestId("cart-count-badge")).not.toBeInTheDocument();
});

it("T-32: 게스트 배지는 로컬 항목 개수를 보여준다", () => {
  useUserStore.setState({ user: null, isAuthReady: true });
  useGuestCartStore.setState({
    items: [g("ri1"), g("ri2"), g("ri3")],
    isHydrated: true,
  });
  render(
    <QueryClientProvider client={makeClient()}>
      <CartCountBadge>
        <span>nav</span>
      </CartCountBadge>
    </QueryClientProvider>
  );
  expect(screen.getByTestId("cart-count-badge")).toHaveTextContent("3");
  expect(getCartMock).not.toHaveBeenCalled();
});
