import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/entities/cart/api", () => ({
  ...jest.requireActual("@/entities/cart/api"),
  getCart: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
  unstable_cache: (fn: unknown) => fn,
}));

import { getCart } from "@/entities/cart/api";
import {
  cartFixture,
  emptyCartFixture,
} from "@/entities/cart/model/__tests__/fixtures";
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
  expect(
    screen.getByRole("button", { name: "배추김치 수량 수정" })
  ).toHaveTextContent(/100\s*g/);
  expect(screen.getAllByText(/김치찌개/).length).toBeGreaterThan(0);
  expect(
    screen.getByRole("heading", { name: /장바구니\s*5/ })
  ).toBeInTheDocument();
  expect(screen.getByText("수제 고추기름")).toBeInTheDocument();
});

it("T-08: 레시피 탭 클릭 시 해당 항목만 보이고 getCart 재호출이 없다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  renderCartView();
  await screen.findByText("배추김치");

  await userEvent.click(screen.getByRole("tab", { name: /김치찌개/ }));

  expect(screen.getByText("배추김치")).toBeInTheDocument();
  expect(screen.queryByText("수제 고추기름")).not.toBeInTheDocument();
  expect(getCartMock).toHaveBeenCalledTimes(1);
});

it("T-09: 삭제된 레시피 탭은 placeholder 썸네일로 표시된다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  renderCartView();
  await screen.findByText("배추김치");

  const deletedTab = screen.getByRole("tab", { name: /김치볶음밥/ });
  expect(
    deletedTab.querySelector('[data-testid="deleted-recipe-placeholder"]')
  ).toBeInTheDocument();
});

it("T-10: products가 있는 그룹은 상품 카드를 보여준다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  renderCartView();
  await screen.findByText("배추김치");

  expect(screen.getByText("종가집 포기김치 1kg")).toBeInTheDocument();
  expect(screen.getByText("비비고 썰은배추김치 500g")).toBeInTheDocument();
});

it("T-11: products가 비고 landingUrl만 있으면 '쿠팡에서 보기'만 보인다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  renderCartView();
  await screen.findByText("배추김치");

  const daepaSection = screen.getByTestId("cart-group-대파");
  expect(
    within(daepaSection).getByRole("link", { name: /쿠팡에서 보기/ })
  ).toHaveAttribute("href", "https://link.coupang.com/daepa");
  expect(within(daepaSection).queryAllByRole("img")).toHaveLength(0);
});

it("T-12: 미매칭 항목에는 구매 요소가 없다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  renderCartView();
  await screen.findByText("수제 고추기름");

  const unmatched = screen.getByTestId("cart-unmatched-section");
  expect(within(unmatched).queryByRole("link")).not.toBeInTheDocument();
});

it("T-13: 빈 장바구니면 빈 상태 안내와 탐색 CTA가 보인다", async () => {
  getCartMock.mockResolvedValue(emptyCartFixture);
  renderCartView();

  expect(
    await screen.findByText(/레시피에서 재료를 담아보세요/)
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /레시피 구경하기/ })
  ).toBeInTheDocument();
});
