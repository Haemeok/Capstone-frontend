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
import {
  cartFixture,
  sameIngredientCartFixture,
} from "@/entities/cart/model/__tests__/fixtures";

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

const singleItemCart = ({
  name,
  quantity,
  unit,
}: {
  name: string;
  quantity: string;
  unit: string;
}): CartResponse => ({
  totalItemCount: 1,
  recipes: [
    {
      recipeId: "r-single",
      title: "한 그릇 레시피",
      imageUrl: null,
      itemCount: 1,
      deleted: false,
    },
  ],
  groups: [],
  unmatchedItems: [
    {
      cartItemId: "c-single",
      name,
      quantity,
      unit,
      recipe: {
        recipeId: "r-single",
        title: "한 그릇 레시피",
        deleted: false,
      },
    },
  ],
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

it("T-43: 단일 출처는 재료와 출처에 양을 표시하고 썸네일 없이 이동한다", async () => {
  renderContent();

  const ingredient = screen.getByTestId("cart-ingredient-배추김치");
  expect(
    within(ingredient).getByRole("heading", { name: "배추김치" })
  ).toHaveClass("text-lg", "font-bold");
  expect(within(ingredient).getAllByText("100g")).toHaveLength(2);
  expect(within(ingredient).queryByRole("img")).not.toBeInTheDocument();
  expect(
    within(ingredient).queryByText("레시피별 수량")
  ).not.toBeInTheDocument();
  const sourceLink = within(ingredient).getByRole("link", {
    name: "김치찌개 100g 레시피 보기",
  });
  expect(sourceLink).toHaveAttribute("href", "/recipes/r7KpQ2mA");
  expect(
    within(sourceLink).getByTestId("recipe-source-chevron")
  ).toBeInTheDocument();
  expect(
    within(ingredient).getAllByRole("button", { name: "배추김치 삭제" })
  ).toHaveLength(1);

  sourceLink.addEventListener("click", (event) => event.preventDefault(), {
    once: true,
  });
  await userEvent.click(sourceLink);

  expect(triggerHapticMock).not.toHaveBeenCalled();
});

it("T-44: 복수 출처는 출처별 양과 합산 총량을 한 구조로 보여준다", () => {
  renderContent(sameIngredientCartFixture);

  const ingredient = screen.getByTestId("cart-ingredient-신김치");
  expect(
    within(ingredient).getByRole("heading", { name: "신김치" })
  ).toBeInTheDocument();
  expect(within(ingredient).getByText("총 300g")).toHaveClass("text-base");
  const jjigaeSource = within(ingredient).getByRole("link", {
    name: "김치찌개 200g 레시피 보기",
  });
  const jeonSource = within(ingredient).getByRole("link", {
    name: "김치전 100g 레시피 보기",
  });
  expect(within(jjigaeSource).getByText("200g")).toBeInTheDocument();
  expect(within(jeonSource).getByText("100g")).toBeInTheDocument();
  expect(within(ingredient).queryByRole("img")).not.toBeInTheDocument();
  expect(
    within(ingredient).queryByText("레시피별 수량")
  ).not.toBeInTheDocument();
});

it("T-45: 삭제된 레시피 출처는 양을 남기고 링크와 chevron을 제거한다", () => {
  renderContent();

  const ingredient = screen.getByTestId("cart-ingredient-김치");
  expect(within(ingredient).getByText("김치볶음밥")).toBeInTheDocument();
  expect(within(ingredient).getAllByText("1큰술")).toHaveLength(2);
  expect(
    within(ingredient).queryByRole("link", {
      name: "김치볶음밥 레시피 보기",
    })
  ).not.toBeInTheDocument();
  expect(
    within(ingredient).queryByTestId("recipe-source-chevron")
  ).not.toBeInTheDocument();
});

it("T-46: 자유 텍스트가 섞이면 총량 없이 출처별 원래 양을 유지한다", () => {
  const cart: CartResponse = {
    totalItemCount: 2,
    recipes: [
      {
        recipeId: "r-one",
        title: "김치찌개",
        imageUrl: null,
        itemCount: 1,
        deleted: false,
      },
      {
        recipeId: "r-two",
        title: "김치전",
        imageUrl: null,
        itemCount: 1,
        deleted: false,
      },
    ],
    groups: [
      {
        coupangInfo: {
          coupangName: "간장",
          landingUrl: "",
          lastCollectedAt: "2026-08-15T00:00:00+09:00",
          products: [],
        },
        items: [
          {
            cartItemId: "c-one",
            name: "간장",
            quantity: "약간",
            unit: "",
            recipe: {
              recipeId: "r-one",
              title: "김치찌개",
              deleted: false,
            },
          },
          {
            cartItemId: "c-two",
            name: "간장",
            quantity: "1",
            unit: "큰술",
            recipe: {
              recipeId: "r-two",
              title: "김치전",
              deleted: false,
            },
          },
        ],
      },
    ],
    unmatchedItems: [],
  };
  renderContent(cart);

  const ingredient = screen.getByTestId("cart-ingredient-간장");
  expect(within(ingredient).queryByText(/^총 /)).not.toBeInTheDocument();
  const jjigaeSource = within(ingredient).getByRole("link", {
    name: "김치찌개 약간 레시피 보기",
  });
  const jeonSource = within(ingredient).getByRole("link", {
    name: "김치전 1큰술 레시피 보기",
  });
  expect(within(jjigaeSource).getByText("약간")).toBeInTheDocument();
  expect(within(jeonSource).getByText("1큰술")).toBeInTheDocument();
});

it("T-46: 수량이 비어 있으면 단위가 있어도 누락 수량으로 표시한다", () => {
  renderContent(singleItemCart({ name: "후추", quantity: "", unit: "g" }));

  const ingredient = screen.getByTestId("cart-ingredient-후추");
  expect(
    within(ingredient).getAllByText("양 정보가 없어요 · 다시 담아주세요")
  ).toHaveLength(2);
  expect(
    within(ingredient).getByRole("link", {
      name: "한 그릇 레시피 양 정보가 없어요 · 다시 담아주세요 레시피 보기",
    })
  ).toBeInTheDocument();
  expect(within(ingredient).queryByText("g")).not.toBeInTheDocument();
});

it("T-46: 수량과 단위의 바깥 공백을 제거해 표시한다", () => {
  renderContent(singleItemCart({ name: "소금", quantity: " 2 ", unit: " g " }));

  const ingredient = screen.getByTestId("cart-ingredient-소금");
  expect(within(ingredient).getAllByText("2g")).toHaveLength(2);
  expect(
    within(ingredient).getByRole("link", {
      name: "한 그릇 레시피 2g 레시피 보기",
    })
  ).toBeInTheDocument();
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
