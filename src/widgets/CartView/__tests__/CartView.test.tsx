import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/entities/cart/api", () => ({
  ...jest.requireActual("@/entities/cart/api"),
  getCart: jest.fn(),
  deleteCartItem: jest.fn(),
  deleteCartItemsBulk: jest.fn(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("next/navigation", () => ({ usePathname: () => "/cart" }));
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
import { triggerHaptic } from "@/shared/lib/bridge";

import { useGuestCartStore } from "@/entities/cart";
import {
  deleteCartItem,
  deleteCartItemsBulk,
  getCart,
} from "@/entities/cart/api";
import {
  cartFixture,
  emptyCartFixture,
  sameIngredientCartFixture,
} from "@/entities/cart/model/__tests__/fixtures";
import { type User, useUserStore } from "@/entities/user";

import CartView from "../index";

const getCartMock = jest.mocked(getCart);
const deleteOneMock = jest.mocked(deleteCartItem);
const deleteBulkMock = jest.mocked(deleteCartItemsBulk);
const coupangMock = jest.mocked(getRecipeCoupangProducts);
const triggerHapticMock = jest.mocked(triggerHaptic);

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
  deleteOneMock.mockReset();
  deleteBulkMock.mockReset();
  coupangMock.mockReset();
  triggerHapticMock.mockReset();
  // 테스트 픽스처 — CartView는 로그인 여부만 보므로 부분 User로 캐스트
  useUserStore.setState({ user: { id: "u1" } as User, isAuthReady: true });
  useGuestCartStore.setState({ items: [], isHydrated: true });
});

it("T-06: /cart 진입 시 담긴 항목의 이름·수량·단위·출처 레시피가 보인다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  renderCartView();

  expect(await screen.findByText("배추김치")).toBeInTheDocument();
  expect(screen.getAllByText("100g").length).toBeGreaterThan(0);
  expect(screen.getAllByText(/김치찌개/).length).toBeGreaterThan(0);
  expect(screen.getByRole("heading", { name: "장바구니" })).toBeInTheDocument();
  expect(screen.getByText("수제 고추기름")).toBeInTheDocument();
  // 쿠팡 그룹명 헤더 제거 — 재료 라벨은 항목당 1번만
  expect(screen.getAllByText("김치")).toHaveLength(1);
  expect(screen.getByText(/쿠팡 파트너스 활동의 일환/)).toBeInTheDocument();
});

it("같은 재료를 두 레시피에서 담으면 라벨 1번 + 레시피별 양 + 총량이 보인다", async () => {
  getCartMock.mockResolvedValue(sameIngredientCartFixture);
  renderCartView();

  expect(await screen.findByText("신김치")).toBeInTheDocument();
  expect(screen.getAllByText("신김치")).toHaveLength(1);
  expect(screen.getByText("총 300g")).toBeInTheDocument();
  expect(screen.getByText("200g")).toBeInTheDocument();
  expect(screen.getByText("100g")).toBeInTheDocument();
});

it("병합된 재료 그룹은 삭제 하나로 전체를 지운다 (T-47)", async () => {
  getCartMock.mockResolvedValue(sameIngredientCartFixture);
  let resolveDelete: (() => void) | undefined;
  deleteBulkMock.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        resolveDelete = resolve;
      })
  );
  renderCartView();
  await screen.findByText("신김치");

  const deleteButtons = screen.getAllByRole("button", { name: /삭제$/ });
  expect(deleteButtons).toHaveLength(1);
  expect(screen.getByRole("button", { name: "신김치 삭제" })).toHaveClass(
    "size-11"
  );

  await userEvent.click(screen.getByRole("button", { name: "신김치 삭제" }));

  expect(triggerHapticMock).toHaveBeenCalledWith("Light");

  await waitFor(() => {
    expect(deleteBulkMock).toHaveBeenCalledWith(["c2Fg6JkL", "c3Hj8PqS"]);
    expect(screen.queryByText("신김치")).not.toBeInTheDocument();
  });

  await act(async () => {
    resolveDelete?.();
  });
});

it("T-08, T-48: 레시피 필터 선택은 해당 항목만 보여주고 getCart를 재호출하지 않는다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  renderCartView();
  await screen.findByText("배추김치");

  const filterGroup = screen.getByRole("group", { name: "레시피 필터" });
  const allFilter = within(filterGroup).getByRole("button", { name: "전체 5" });
  const kimchiFilter = screen.getByRole("button", { name: /김치찌개/ });
  expect(allFilter).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("수제 고추기름")).toBeInTheDocument();
  expect(kimchiFilter).toHaveAttribute("aria-pressed", "false");

  await userEvent.click(kimchiFilter);

  expect(screen.getByText("배추김치")).toBeInTheDocument();
  expect(screen.queryByText("수제 고추기름")).not.toBeInTheDocument();
  expect(kimchiFilter).toHaveAttribute("aria-pressed", "true");
  expect(kimchiFilter).toHaveClass("bg-ink", "text-white", "min-h-11");
  expect(allFilter).toHaveClass("bg-gray-100", "text-ink-sub", "min-h-11");
  expect(getCartMock).toHaveBeenCalledTimes(1);
});

it("T-49: 선택 레시피의 마지막 항목을 지우면 전체 필터와 남은 재료로 돌아간다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  let resolveDelete: (() => void) | undefined;
  deleteOneMock.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        resolveDelete = resolve;
      })
  );
  renderCartView();
  await screen.findByText("수제 고추기름");

  await userEvent.click(screen.getByRole("button", { name: "마라샹궈 · 1" }));
  await userEvent.click(
    screen.getByRole("button", { name: "수제 고추기름 삭제" })
  );

  await waitFor(() => {
    expect(
      screen.queryByRole("button", { name: "마라샹궈 · 1" })
    ).not.toBeInTheDocument();
    expect(
      within(screen.getByRole("group", { name: "레시피 필터" })).getByRole(
        "button",
        { name: "전체 4" }
      )
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("배추김치")).toBeInTheDocument();
  });

  await act(async () => {
    resolveDelete?.();
  });
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
  expect(
    within(unmatched).queryByRole("link", { name: /쿠팡/ })
  ).not.toBeInTheDocument();
});

it("레시피 이름을 누르면 해당 레시피 상세로 이동하고, 삭제된 레시피는 링크가 아니다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  renderCartView();
  await screen.findByText("배추김치");

  expect(
    screen.getAllByRole("link", { name: "김치찌개 100g 레시피 보기" })[0]
  ).toHaveAttribute("href", "/recipes/r7KpQ2mA");
  expect(
    screen.queryByRole("link", { name: "김치볶음밥 레시피 보기" })
  ).not.toBeInTheDocument();
});

it("T-13, T-52: 빈 장바구니면 헤더는 유지되고 인기 레시피 CTA가 보인다", async () => {
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

it("T-16: 행 삭제 버튼 → 단건 DELETE + 즉시 제거", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  // 해소 전 단언 — invalidate 후 refetch가 픽스처로 되돌리는 것 방지
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

it("T-17, T-51: 전체 비우기 확인은 모든 항목을 bulk 삭제한다", async () => {
  getCartMock.mockResolvedValue(cartFixture);
  deleteBulkMock.mockResolvedValue(undefined);
  renderCartView();
  await screen.findByText("배추김치");

  await userEvent.click(screen.getByRole("button", { name: "전체 비우기" }));
  expect(
    await screen.findByText("장바구니를 모두 비울까요?")
  ).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "비우기" }));

  await waitFor(() => {
    expect(deleteBulkMock).toHaveBeenCalledTimes(1);
    expect(deleteBulkMock).toHaveBeenCalledWith([
      "c9Lm2PqA",
      "c8Ab7XyZ",
      "c6Rt4MnB",
      "c5Uv1GhD",
      "c4Qs9NwE",
    ]);
    expect(
      screen.queryByText("장바구니를 모두 비울까요?")
    ).not.toBeInTheDocument();
  });
});

const guestItem = {
  recipeIngredientId: "ri8AbKcQ",
  name: "배추김치",
  quantity: "100",
  unit: "g",
  recipe: { recipeId: "r7KpQ2mA", title: "김치찌개", imageUrl: null },
};

it("T-31, T-53: 게스트 장바구니도 선택된 전체 필터와 같은 그룹 규칙을 보여준다", async () => {
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
  expect(
    screen.getByRole("link", { name: "김치찌개 100g 레시피 보기" })
  ).toHaveAttribute("href", "/recipes/r7KpQ2mA");
  expect(screen.getByRole("button", { name: "전체 1" })).toHaveClass(
    "bg-ink",
    "text-white"
  );
  expect(screen.getByRole("button", { name: "전체 1" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  expect(getCartMock).not.toHaveBeenCalled();
});

it("T-33, T-53: 게스트 로그인 배너의 로그인 버튼은 44px과 visible focus를 제공한다", async () => {
  useUserStore.setState({ user: null, isAuthReady: true });
  useGuestCartStore.setState({ items: [guestItem], isHydrated: true });
  coupangMock.mockResolvedValue({ recipeId: "r7KpQ2mA", items: [] });

  renderCartView();

  expect(
    await screen.findByText(/로그인하면 계정에 저장돼요/)
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "로그인" })).toHaveClass(
    "min-h-11",
    "cursor-pointer",
    "focus-visible:ring-2"
  );
});

it("T-36, T-54: 병합된 게스트 재료 삭제는 두 로컬 항목만 제거한다", async () => {
  const guestItems = [
    {
      ...guestItem,
      recipeIngredientId: "ri8AbKcQ",
      name: "신김치",
      quantity: "200",
    },
    {
      ...guestItem,
      recipeIngredientId: "ri9CdLmR",
      name: "신김치",
      quantity: "100",
    },
  ];
  useUserStore.setState({ user: null, isAuthReady: true });
  useGuestCartStore.setState({ items: guestItems, isHydrated: true });
  coupangMock.mockResolvedValue({
    recipeId: "r7KpQ2mA",
    items: [
      {
        recipeIngredientId: "ri8AbKcQ",
        coupangName: "신김치",
        landingUrl: "https://link.coupang.com/kimchi",
        lastCollectedAt: "2026-08-15T00:00:00+09:00",
        products: [],
      },
      {
        recipeIngredientId: "ri9CdLmR",
        coupangName: "신김치",
        landingUrl: "https://link.coupang.com/kimchi",
        lastCollectedAt: "2026-08-15T00:00:00+09:00",
        products: [],
      },
    ],
  });

  renderCartView();
  await screen.findByText("신김치");

  await userEvent.click(screen.getByRole("button", { name: "신김치 삭제" }));

  expect(deleteOneMock).not.toHaveBeenCalled();
  expect(deleteBulkMock).not.toHaveBeenCalled();
  await waitFor(() => {
    expect(useGuestCartStore.getState().items).toHaveLength(0);
    expect(screen.queryByText("신김치")).not.toBeInTheDocument();
  });
});
