import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/entities/cart/api", () => ({
  ...jest.requireActual("@/entities/cart/api"),
  getCart: jest.fn(),
  updateCartItem: jest.fn(),
  deleteCartItem: jest.fn(),
  deleteCartItemsBulk: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/shared/ui/shadcn/drawer", () => ({
  Drawer: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div>{children}</div> : null,
  DrawerContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
  unstable_cache: (fn: unknown) => fn,
}));
jest.mock("@/shared/coupang", () => ({
  ...jest.requireActual("@/shared/coupang"),
  getRecipeCoupangProducts: jest.fn(),
}));
jest.mock("@/features/auth/ui/LoginDialog", () => ({
  __esModule: true,
  default: () => null,
}));

import { getRecipeCoupangProducts } from "@/shared/coupang";

import { useGuestCartStore } from "@/entities/cart";
import {
  deleteCartItem,
  deleteCartItemsBulk,
  getCart,
  updateCartItem,
} from "@/entities/cart/api";
import {
  cartFixture,
  emptyCartFixture,
  sameIngredientCartFixture,
} from "@/entities/cart/model/__tests__/fixtures";
import { type User, useUserStore } from "@/entities/user";

import CartView from "../index";

const getCartMock = getCart as jest.Mock;
const updateMock = updateCartItem as jest.Mock;
const deleteOneMock = deleteCartItem as jest.Mock;
const deleteBulkMock = deleteCartItemsBulk as jest.Mock;
const coupangMock = getRecipeCoupangProducts as jest.Mock;

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
  updateMock.mockReset();
  deleteOneMock.mockReset();
  deleteBulkMock.mockReset();
  coupangMock.mockReset();
  // 테스트 픽스처 — CartView는 로그인 여부만 보므로 부분 User로 캐스트
  useUserStore.setState({ user: { id: "u1" } as User, isAuthReady: true });
  useGuestCartStore.setState({ items: [], isHydrated: true });
});

it("T-06: /cart 진입 시 담긴 항목의 이름·수량·단위·출처 레시피가 보인다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  renderCartView();

  expect(await screen.findByText("배추김치")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "배추김치 수량 수정" })
  ).toHaveTextContent(/100\s*g/);
  expect(screen.getAllByText(/김치찌개/).length).toBeGreaterThan(0);
  expect(screen.getByRole("heading", { name: "장바구니" })).toBeInTheDocument();
  expect(screen.getByText("수제 고추기름")).toBeInTheDocument();
  // 쿠팡 그룹명 헤더 제거 — 재료 라벨은 항목당 1번만
  expect(screen.getAllByText("김치")).toHaveLength(1);
});

it("같은 재료를 두 레시피에서 담으면 라벨 1번 + 레시피별 양 + 총량이 보인다", async () => {
  getCartMock.mockResolvedValue(sameIngredientCartFixture);
  renderCartView();

  expect(await screen.findByText("신김치")).toBeInTheDocument();
  expect(screen.getAllByText("신김치")).toHaveLength(1);
  expect(screen.getByText("총 300g")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "김치찌개 신김치 수량 수정" })
  ).toHaveTextContent(/200\s*g/);
  expect(
    screen.getByRole("button", { name: "김치전 신김치 수량 수정" })
  ).toHaveTextContent(/100\s*g/);
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

it("T-13: 빈 장바구니면 헤더는 유지되고 인기 레시피 CTA가 보인다", async () => {
  getCartMock.mockResolvedValue(emptyCartFixture);
  renderCartView();

  expect(
    await screen.findByText(/레시피에서 재료를 담아보세요/)
  ).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "장바구니" })).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /지금 바로 재료 담으러 가기/ })
  ).toHaveAttribute("href", "/search/results");
});

it("T-14: 수량 영역 탭 → 바텀시트에서 수정 → PATCH + 새 값 표시", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  // updateMock 해소 전에 단언 — invalidate 후 refetch가 픽스처(100 g)로 되돌리는 것 방지
  let resolveUpdate: (() => void) | undefined;
  updateMock.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        resolveUpdate = resolve;
      })
  );
  renderCartView();
  await screen.findByText("배추김치");

  await userEvent.click(
    screen.getByRole("button", { name: "배추김치 수량 수정" })
  );
  const quantityInput = await screen.findByLabelText("수량");
  await userEvent.clear(quantityInput);
  await userEvent.type(quantityInput, "300");
  await userEvent.click(screen.getByRole("button", { name: "저장" }));

  await waitFor(() => {
    expect(updateMock).toHaveBeenCalledWith("c8Ab7XyZ", {
      quantity: "300",
      unit: "g",
    });
    expect(
      screen.getByRole("button", { name: "배추김치 수량 수정" })
    ).toHaveTextContent(/300\s*g/);
  });

  await act(async () => {
    resolveUpdate?.();
  });
});

it("T-16: 행 삭제 버튼 → 단건 DELETE + 즉시 제거", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  // 해소 전 단언 — invalidate 후 refetch가 픽스처로 되돌리는 것 방지 (T-14와 동일 패턴)
  let resolveDelete: (() => void) | undefined;
  deleteOneMock.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        resolveDelete = resolve;
      })
  );
  renderCartView();
  await screen.findByText("배추김치");

  await userEvent.click(screen.getByRole("button", { name: "배추김치 삭제" }));

  await waitFor(() => {
    expect(deleteOneMock).toHaveBeenCalledWith("c8Ab7XyZ");
    expect(screen.queryByText("배추김치")).not.toBeInTheDocument();
  });

  await act(async () => {
    resolveDelete?.();
  });
});

it("T-17: 선택 모드에서 2개 선택 삭제 → bulk 1회", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  deleteBulkMock.mockResolvedValue(undefined);
  renderCartView();
  await screen.findByText("배추김치");

  await userEvent.click(screen.getByRole("button", { name: "선택" }));
  await userEvent.click(
    screen.getByRole("checkbox", { name: "배추김치 선택" })
  );
  await userEvent.click(
    screen.getByRole("checkbox", { name: "돼지고기 선택" })
  );
  await userEvent.click(screen.getByRole("button", { name: "2개 삭제" }));

  await waitFor(() => {
    expect(deleteBulkMock).toHaveBeenCalledTimes(1);
    expect(deleteBulkMock).toHaveBeenCalledWith(["c8Ab7XyZ", "c6Rt4MnB"]);
  });
});

const guestItem = {
  recipeIngredientId: "ri8AbKcQ",
  name: "배추김치",
  quantity: "100",
  unit: "g",
  recipe: { recipeId: "r7KpQ2mA", title: "김치찌개", imageUrl: null },
};

it("T-31: 게스트 /cart는 쿠팡 재조회로 로그인과 동일한 그룹 규칙을 보여준다", async () => {
  useUserStore.setState({ user: null, isAuthReady: true });
  useGuestCartStore.setState({ items: [guestItem], isHydrated: true });
  coupangMock.mockResolvedValue({
    recipeId: "r7KpQ2mA",
    items: [
      {
        recipeIngredientId: "ri8AbKcQ",
        coupangName: "김치",
        landingUrl: "https://link.coupang.com/kimchi",
        lastCollectedAt: "2026-07-09T03:20:15+09:00",
        products: [],
      },
    ],
  });

  renderCartView();

  expect(await screen.findByText("배추김치")).toBeInTheDocument();
  expect(screen.getByTestId("cart-group-김치")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /쿠팡에서 보기/ })
  ).toBeInTheDocument();
  expect(getCartMock).not.toHaveBeenCalled();
});

it("T-33: 게스트 /cart 상단에 로그인 배너가 보인다", async () => {
  useUserStore.setState({ user: null, isAuthReady: true });
  useGuestCartStore.setState({ items: [guestItem], isHydrated: true });
  coupangMock.mockResolvedValue({ recipeId: "r7KpQ2mA", items: [] });

  renderCartView();

  expect(
    await screen.findByText(/로그인하면 계정에 저장돼요/)
  ).toBeInTheDocument();
});

it("T-35: 게스트 수량 수정은 API 호출 없이 반영된다", async () => {
  useUserStore.setState({ user: null, isAuthReady: true });
  useGuestCartStore.setState({ items: [guestItem], isHydrated: true });
  coupangMock.mockResolvedValue({ recipeId: "r7KpQ2mA", items: [] });

  renderCartView();
  await screen.findByText("배추김치");

  await userEvent.click(
    screen.getByRole("button", { name: "배추김치 수량 수정" })
  );
  const quantityInput = await screen.findByLabelText("수량");
  await userEvent.clear(quantityInput);
  await userEvent.type(quantityInput, "300");
  await userEvent.click(screen.getByRole("button", { name: "저장" }));

  expect(updateMock).not.toHaveBeenCalled();
  expect(
    useGuestCartStore
      .getState()
      .items.find((i) => i.recipeIngredientId === "ri8AbKcQ")?.quantity
  ).toBe("300");
});

it("T-36: 게스트 삭제는 API 호출 없이 로컬에서 동작한다", async () => {
  useUserStore.setState({ user: null, isAuthReady: true });
  useGuestCartStore.setState({ items: [guestItem], isHydrated: true });
  coupangMock.mockResolvedValue({ recipeId: "r7KpQ2mA", items: [] });

  renderCartView();
  await screen.findByText("배추김치");

  await userEvent.click(screen.getByRole("button", { name: "배추김치 삭제" }));

  expect(deleteOneMock).not.toHaveBeenCalled();
  expect(deleteBulkMock).not.toHaveBeenCalled();
  expect(useGuestCartStore.getState().items).toHaveLength(0);
});
