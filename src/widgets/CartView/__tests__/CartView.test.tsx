import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

jest.mock("@/entities/cart/api", () => ({
  ...jest.requireActual("@/entities/cart/api"),
  getCart: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

import { getCart } from "@/entities/cart/api";
import { cartFixture } from "@/entities/cart/model/__tests__/fixtures";
import { type User, useUserStore } from "@/entities/user";

import CartView from "../index";

const getCartMock = getCart as jest.Mock;

const renderCartView = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <CartView />
    </QueryClientProvider>
  );
};

beforeEach(() => {
  getCartMock.mockReset();
  // 테스트 픽스처 — CartView는 로그인 여부만 보므로 부분 User로 캐스트
  useUserStore.setState({ user: { id: "u1" } as User, isAuthReady: true });
});

it("T-06: /cart 진입 시 담긴 항목의 이름·수량·단위·출처 레시피·개수가 보인다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  renderCartView();

  expect(await screen.findByText("배추김치")).toBeInTheDocument();
  expect(screen.getByText(/100\s*g/)).toBeInTheDocument();
  expect(screen.getAllByText(/김치찌개/).length).toBeGreaterThan(0);
  expect(screen.getByText("5")).toBeInTheDocument();
  expect(screen.getByText("수제 고추기름")).toBeInTheDocument();
});
