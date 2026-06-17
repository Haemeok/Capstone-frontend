import { render, screen } from "@testing-library/react";

import { recipeDetail as recipeDetailJa } from "@/shared/i18n/messages/ja/recipeDetail";
import { recipeDetail as recipeDetailKo } from "@/shared/i18n/messages/ko/recipeDetail";
import type { Locale } from "@/shared/i18n/types";

import { IngredientsFilter } from "../IngredientsFilter";

const mockLocale = jest.fn<Locale, []>();
jest.mock("@/shared/i18n", () => ({
  useChromeLocale: () => mockLocale(),
}));

jest.mock("../../model/useIngredientsFilter", () => ({
  useIngredientsFilter: () => [["tomato", "egg"], jest.fn()],
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: () => ({ data: undefined }),
}));

jest.mock("next/dynamic", () => () => () => null);

describe("IngredientsFilter i18n counter", () => {
  it("ko 칩은 카운트에 '개' 접미사를 유지한다", () => {
    mockLocale.mockReturnValue("ko");
    render(<IngredientsFilter />);
    expect(screen.getByText(/재료 \d+개/)).toBeInTheDocument();
  });

  it("ja 칩은 접미사 없이 카운트만 표시한다", () => {
    mockLocale.mockReturnValue("ja");
    render(<IngredientsFilter />);
    expect(
      screen.getByText(`${recipeDetailJa.ingredientsHeader} 2`)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        new RegExp(`${recipeDetailKo.ingredientsHeader} \\d+개`)
      )
    ).not.toBeInTheDocument();
  });
});
