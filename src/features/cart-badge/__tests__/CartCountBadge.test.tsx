import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/entities/cart/api", () => ({
  ...jest.requireActual("@/entities/cart/api"),
  getCart: jest.fn(),
}));

import { CART_QUERY_KEYS } from "@/entities/cart";
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

beforeEach(() => {
  getCartMock.mockReset();
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
    qc.setQueryData(CART_QUERY_KEYS.all, { ...cartFixture, totalItemCount: 6 });
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
