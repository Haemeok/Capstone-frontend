import { fireEvent, render } from "@testing-library/react";

import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import { IngredientCategoryTabs } from "../IngredientCategoryTabs";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

const { usePathname } = jest.requireMock("next/navigation") as {
  usePathname: jest.Mock;
};

const NOOP = () => {};

describe("IngredientCategoryTabs i18n", () => {
  it("T-13: /ja 렌더 시 고기 탭이 ja 라벨로 표시되고 한글이 없다", () => {
    usePathname.mockReturnValue("/ja");
    const { container } = render(
      <IngredientCategoryTabs selected="전체" onSelect={NOOP} />
    );

    const meatJa = taxonomyMessages.ja.ingredientCategory.meat;
    const buttons = container.querySelectorAll("button");
    const meatButton = Array.from(buttons).find(
      (btn) => btn.textContent === meatJa
    );
    expect(meatButton).toBeDefined();

    const text = container.textContent ?? "";
    expect(/[가-힣]/.test(text)).toBe(false);
  });

  it("T-14: /ja에서 고기 탭 클릭 시 onSelect는 ko canonical '고기'로 호출된다", () => {
    usePathname.mockReturnValue("/ja");
    const onSelect = jest.fn();
    const { container } = render(
      <IngredientCategoryTabs selected="전체" onSelect={onSelect} />
    );

    const meatJa = taxonomyMessages.ja.ingredientCategory.meat;
    const buttons = container.querySelectorAll("button");
    const meatButton = Array.from(buttons).find(
      (btn) => btn.textContent === meatJa
    );
    expect(meatButton).toBeDefined();
    fireEvent.click(meatButton!); // as: button is confirmed defined above
    expect(onSelect).toHaveBeenCalledWith("고기");
  });

  it("T-15: ko(/) 렌더 시 고기 탭이 한글 그대로 표시된다", () => {
    usePathname.mockReturnValue("/");
    const { container } = render(
      <IngredientCategoryTabs selected="전체" onSelect={NOOP} />
    );

    const buttons = container.querySelectorAll("button");
    const meatButton = Array.from(buttons).find(
      (btn) => btn.textContent === "고기"
    );
    expect(meatButton).toBeDefined();
  });
});
