import { createRef } from "react";

import { act, render, screen } from "@testing-library/react";

import { DictionaryProvider, format, getDictionary } from "@/shared/i18n";
import { localizeActivityName } from "@/shared/i18n/activityNameOverlay";
import { ScrollContext } from "@/shared/lib/ScrollContext";

import RecipeIngredientsSection from "../RecipeIngredientsSection";

const HANGUL = /[가-힣]/;

jest.mock("@/shared/lib/gsap", () => ({
  gsap: {
    registerPlugin: jest.fn(),
    context: jest.fn(() => ({ revert: jest.fn() })),
  },
  ScrollTrigger: {},
}));
jest.mock("@/features/recipe-status", () => ({
  useRecipeStatus: () => ({ status: { ingredientIdsInFridge: [] } }),
}));
jest.mock("@/shared/lib/recipe", () => ({
  ...jest.requireActual("@/shared/lib/recipe"),
  getRandomActivity: () => ({ name: "가볍게 달리기", met: 8.0 }),
}));

const baseRecipe = {
  servings: 2,
  totalCalories: 600,
  totalIngredientCost: 8000,
  marketPrice: 20000,
  nutrition: { carb: 0, protein: 0, fat: 0, sugar: 0, sodium: 0 },
  ingredients: [
    { id: "a", name: "양파", quantity: "1", unit: "개", price: 3000 },
  ],
} as never;

const renderSection = (locale: "ko" | "ja" | "en") =>
  render(
    <ScrollContext.Provider value={{ motionRef: createRef() }}>
      <DictionaryProvider dict={getDictionary(locale)}>
        <RecipeIngredientsSection recipe={baseRecipe} locale={locale} />
      </DictionaryProvider>
    </ScrollContext.Provider>
  );

describe("RecipeIngredientsSection i18n", () => {
  it("T-01: ja -> per-ingredient 가격 미표시", () => {
    const { baseElement } = renderSection("ja");
    expect(baseElement.textContent).not.toContain("3,000");
    expect(baseElement.textContent).not.toContain("원");
  });

  it("T-02: ja & 영양 off -> cost/savings 배너 미렌더", () => {
    const { baseElement } = renderSection("ja");
    const t = getDictionary("ja");
    expect(baseElement.textContent).not.toContain(t.recipeDetail.costPrefix);
    expect(baseElement.textContent).not.toContain("원");
  });

  it("T-03b: ja & 영양 on -> 활동 배너 번역명 + 시간 단위, 한글 없음", () => {
    jest.useFakeTimers();
    const ja = getDictionary("ja");
    const { baseElement } = renderSection("ja");
    act(() => {
      screen.getByText(ja.recipeDetail.nutritionHeader).click();
    });
    act(() => {
      jest.advanceTimersByTime(4600);
    });
    expect(baseElement.textContent).toContain(
      localizeActivityName("가볍게 달리기", "ja")
    );
    expect(baseElement.textContent).toContain(
      format(ja.recipeDetail.cookingTimeValue, { n: "" }).trim()
    );
    expect(HANGUL.test(baseElement.textContent ?? "")).toBe(false);
    jest.useRealTimers();
  });

  it("T-05(anchor): ko -> 가격·cost 배너·활동 한글 표시", () => {
    const { baseElement } = renderSection("ko");
    expect(baseElement.textContent).toContain("3,000원");
    expect(baseElement.textContent).toContain(
      getDictionary("ko").recipeDetail.costPrefix
    );
  });
});
