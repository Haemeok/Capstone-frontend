import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

import { recipeFormMessages } from "@/shared/i18n/recipeFormMessages";
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import type { IngredientItem } from "@/entities/ingredient";

import IngredientSelector from "../IngredientSelector";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

type GetIngredientsParams = {
  category: string;
  isMine: boolean;
};

const getIngredientsMock = jest.fn(async (_params: GetIngredientsParams) => ({
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  last: true,
}));

jest.mock("@/entities/ingredient", () => {
  const actual = jest.requireActual("@/entities/ingredient");
  return {
    ...actual,
    getIngredients: (params: GetIngredientsParams) =>
      getIngredientsMock(params),
  };
});

const renderSelector = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <IngredientSelector
        open
        onOpenChange={() => {}}
        onIngredientSelect={() => {}}
        addedIngredientNames={new Set<string>()}
        mapIngredientToPayload={(ingredient: IngredientItem) => ingredient}
      />
    </QueryClientProvider>
  );

describe("IngredientSelector category chips i18n", () => {
  beforeEach(() => {
    getIngredientsMock.mockClear();
  });

  it("ja에서 카테고리 칩이 택소노미/사전 현지화 값으로 표시된다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new");
    renderSelector();

    expect(
      screen.getByRole("button", {
        name: taxonomyMessages.ja.ingredientCategory.ALL,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: taxonomyMessages.ja.ingredientCategory.meat,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: recipeFormMessages.ja.ui.myIngredients,
      })
    ).toBeInTheDocument();
  });

  it("ja에서 현지화된 칩을 눌러도 쿼리에는 ko canonical 카테고리가 전달된다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new");
    renderSelector();

    fireEvent.click(
      screen.getByRole("button", {
        name: taxonomyMessages.ja.ingredientCategory.meat,
      })
    );

    expect(
      getIngredientsMock.mock.calls.some(
        ([params]) => params.category === "고기"
      )
    ).toBe(true);
  });

  it("ja에서 마이 식재료 칩의 쿼리는 ko canonical과 isMine을 유지한다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new");
    renderSelector();

    fireEvent.click(
      screen.getByRole("button", {
        name: recipeFormMessages.ja.ui.myIngredients,
      })
    );

    expect(
      getIngredientsMock.mock.calls.some(
        ([params]) => params.category === "나의 재료" && params.isMine === true
      )
    ).toBe(true);
  });

  it("ko에서는 한글 canonical 라벨을 그대로 쓴다", () => {
    mockPathname.mockReturnValue("/recipes/new");
    renderSelector();

    expect(screen.getByRole("button", { name: "전체" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "고기" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: recipeFormMessages.ko.ui.myIngredients,
      })
    ).toBeInTheDocument();
  });
});
