import React from "react";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("next/navigation", () => ({ usePathname: () => "/cart" }));
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
  unstable_cache: (fn: unknown) => fn,
}));

import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartResponse } from "@/entities/cart";
import { cartFixture } from "@/entities/cart/model/__tests__/fixtures";

import { CartContent, type CartHandlers } from "../ui/CartContent";

const onDeleteItemsMock = jest.fn();
const handlers: CartHandlers = { onDeleteItems: onDeleteItemsMock };
const triggerHapticMock = jest.mocked(triggerHaptic);

beforeEach(() => {
  triggerHapticMock.mockReset();
  onDeleteItemsMock.mockReset();
});

const renderContent = (cart: CartResponse = cartFixture) =>
  render(<CartContent cart={cart} handlers={handlers} />);

const product = (
  rank: number,
  name: string,
  price: number,
  deliveryType: "ROCKET" | "ROCKET_FRESH" | "STANDARD"
) => ({
  rank,
  name,
  price,
  imageUrl: `https://example.com/${rank}.jpg`,
  url: `https://link.coupang.com/${rank}`,
  deliveryType,
  freeShipping: false,
});

it("T-40: 검은 레시피 필터와 흰 재료 흐름이 확정 타이포 위계로 이어진다", () => {
  renderContent();

  expect(screen.getByTestId("cart-content")).toHaveClass(
    "overflow-x-hidden",
    "bg-white"
  );
  expect(screen.getByRole("heading", { name: "장바구니" })).toHaveClass(
    "text-2xl",
    "font-bold"
  );
  expect(screen.getByRole("button", { name: "전체 5" })).toHaveClass(
    "bg-ink",
    "text-white",
    "min-h-11",
    "rounded-full"
  );
  expect(screen.getByRole("button", { name: "전체 5" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  expect(screen.getByRole("button", { name: /김치찌개/ })).toHaveClass(
    "bg-gray-100",
    "text-ink-sub"
  );
  expect(screen.getByRole("button", { name: /김치찌개/ })).toHaveAttribute(
    "aria-pressed",
    "false"
  );
  expect(screen.getByTestId("cart-group-김치")).toHaveClass(
    "border-t-8",
    "border-gray-100",
    "bg-white"
  );
  expect(screen.getByTestId("cart-group-김치")).not.toHaveClass(
    "rounded-xl",
    "rounded-2xl"
  );
  expect(screen.getByText(/쿠팡 파트너스 활동의 일환/)).toHaveClass(
    "text-[11px]",
    "font-normal"
  );
});

it("T-41: 상품은 기존 정렬·정보·링크를 가로 슬라이더에서 유지한다", async () => {
  const [kimchiGroup, ...otherGroups] = cartFixture.groups;
  const cart: CartResponse = {
    ...cartFixture,
    groups: [
      {
        ...kimchiGroup,
        coupangInfo: {
          ...kimchiGroup.coupangInfo,
          products: [
            product(1, "일반 7,900", 7900, "STANDARD"),
            product(2, "로켓 12,900", 12900, "ROCKET"),
            product(3, "프레시 9,000", 9000, "ROCKET_FRESH"),
            product(4, "일반 15,000", 15000, "STANDARD"),
            product(5, "로켓 19,000", 19000, "ROCKET"),
          ],
        },
      },
      ...otherGroups,
    ],
  };
  renderContent(cart);

  const group = screen.getByTestId("cart-group-김치");
  const slider = within(group).getByTestId("coupang-product-slider");
  const scrollByMock = jest.fn();
  slider.scrollBy = scrollByMock;
  const links = within(slider).getAllByRole("link");

  expect(
    within(group).getByText("이 재료로 많이 담는 상품")
  ).toBeInTheDocument();
  expect(slider).toHaveClass("overflow-x-auto");
  expect(links.map((link) => link.textContent)).toEqual([
    expect.stringContaining("프레시 9,000"),
    expect.stringContaining("로켓 12,900"),
    expect.stringContaining("로켓 19,000"),
    expect.stringContaining("일반 7,900"),
    expect.stringContaining("일반 15,000"),
  ]);
  expect(links[0]).toHaveAttribute("href", "https://link.coupang.com/3");
  expect(links[0]).toHaveClass("focus-visible:ring-2");
  const previousButton = within(group).getByRole("button", {
    name: "김치 상품 이전으로",
  });
  const nextButton = within(group).getByRole("button", {
    name: "김치 상품 다음으로",
  });
  expect(previousButton).toHaveClass("size-11");
  expect(nextButton).toHaveClass("size-11");

  await userEvent.click(previousButton);
  await userEvent.click(nextButton);

  expect(scrollByMock).toHaveBeenNthCalledWith(1, {
    left: -280,
    behavior: "smooth",
  });
  expect(scrollByMock).toHaveBeenNthCalledWith(2, {
    left: 280,
    behavior: "smooth",
  });
  expect(triggerHapticMock).toHaveBeenCalledTimes(2);
  expect(triggerHapticMock).toHaveBeenNthCalledWith(1, "Light");
  expect(triggerHapticMock).toHaveBeenNthCalledWith(2, "Light");
});

it("T-42: 상품이 없으면 기존 landingUrl 링크만 유지한다", () => {
  renderContent();

  const group = screen.getByTestId("cart-group-대파");
  expect(
    within(group).queryByTestId("coupang-product-slider")
  ).not.toBeInTheDocument();
  expect(
    within(group).getByRole("link", { name: "쿠팡에서 보기" })
  ).toHaveAttribute("href", "https://link.coupang.com/daepa");
});

it("T-48: 레시피 필터는 선택이 실제로 바뀔 때만 햅틱을 낸다", async () => {
  renderContent();

  const allFilter = screen.getByRole("button", { name: "전체 5" });
  const kimchiFilter = screen.getByRole("button", {
    name: "김치찌개 · 3",
  });
  await userEvent.click(allFilter);
  expect(triggerHapticMock).not.toHaveBeenCalled();

  await userEvent.click(kimchiFilter);
  expect(triggerHapticMock).toHaveBeenCalledTimes(1);
  expect(triggerHapticMock).toHaveBeenCalledWith("Light");

  await userEvent.click(kimchiFilter);
  expect(triggerHapticMock).toHaveBeenCalledTimes(1);
});
