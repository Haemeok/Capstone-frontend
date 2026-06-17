import { render, screen } from "@testing-library/react";

import { format, getDictionary } from "@/shared/i18n";

import type { IngredientItem as IngredientItemType } from "@/entities/ingredient/model/types";

import IngredientItem from "../IngredientItem";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

const ingredient: IngredientItemType = {
  id: "i1",
  name: "鶏肉",
  imageUrl: "",
  category: "고기",
  unit: "",
  inFridge: true,
  calories: 0,
};

const jaAria = getDictionary("ja").ingredients.itemAria;

describe("IngredientItem aria i18n", () => {
  it("T-10: /ja에서 상세 보기 aria-label이 일본어 + name 치환으로 표시된다", () => {
    mockPathname.mockReturnValue("/ja/ingredients");
    render(
      <IngredientItem
        ingredient={ingredient}
        isDeleteMode={false}
        setSelectedIngredientIds={() => {}}
        isSelected={false}
      />
    );
    expect(
      screen.getByLabelText(format(jaAria.detail, { name: ingredient.name }))
    ).toBeInTheDocument();
  });

  it("T-10: /ja 삭제 모드에서 선택 aria-label이 일본어로 표시된다", () => {
    mockPathname.mockReturnValue("/ja/ingredients");
    render(
      <IngredientItem
        ingredient={ingredient}
        isDeleteMode={true}
        setSelectedIngredientIds={() => {}}
        isSelected={false}
      />
    );
    expect(
      screen.getByLabelText(format(jaAria.select, { name: ingredient.name }))
    ).toBeInTheDocument();
  });
});
