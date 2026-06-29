import { fireEvent, render, screen, within } from "@testing-library/react";

import { DictionaryProvider, getDictionary } from "@/shared/i18n";

import { IngredientCopySheet } from "../index";

const writeText = jest.fn().mockResolvedValue(undefined);
Object.assign(navigator, { clipboard: { writeText } });

const enRecipe = {
  title: "Pasta",
  servings: 1,
  ingredients: [
    { id: "a", name: "Olive oil", quantity: "3", unit: "tablespoon", price: 0 },
  ],
} as never;

const koRecipe = {
  title: "파스타",
  servings: 1,
  ingredients: [{ id: "a", name: "양파", quantity: "1", unit: "개", price: 0 }],
} as never;

const renderSheet = (locale: "ko" | "en", recipe: never) =>
  render(
    <DictionaryProvider dict={getDictionary(locale)}>
      <IngredientCopySheet
        isOpen
        onOpenChange={() => {}}
        recipe={recipe}
        currentServings={1}
        servingRatio={1}
        onServingsChange={() => {}}
        ownedIndices={new Set()}
        locale={locale}
      />
    </DictionaryProvider>
  );

describe("IngredientCopySheet amount formatting", () => {
  beforeEach(() => writeText.mockClear());

  it("T-C5: en 화면 amount '3 tbsp'", () => {
    renderSheet("en", enRecipe);
    const chip = screen.getByRole("button", { name: /Olive oil 3 tbsp/ });
    expect(within(chip).getByText(/3 tbsp/)).toBeInTheDocument();
  });

  it("T-C6: en 복사 텍스트에 '3 tbsp' 포함", () => {
    renderSheet("en", enRecipe);
    // 메인 복사 버튼 라벨 = format("Copy {n} ingredients") → "Copy 1 ingredients"
    fireEvent.click(
      screen.getByRole("button", { name: /Copy \d+ ingredients/ })
    );
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("3 tbsp"));
  });

  it("T-C8: ko 화면 amount '1개'", () => {
    renderSheet("ko", koRecipe);
    const chip = screen.getByRole("button", { name: /양파 1개/ });
    expect(within(chip).getByText(/1개/)).toBeInTheDocument();
  });
});
