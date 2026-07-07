import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

import type { RecipeCreateCategoryTab } from "@/shared/config/constants/recipe";
import { ingredientPickerMessages } from "@/shared/i18n/ingredientPickerMessages";
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import type {
  IngredientItem,
  IngredientsApiResponse,
} from "@/entities/ingredient/model/types";

import IngredientPicker, {
  type IngredientPickerQueryConfig,
} from "../IngredientPicker";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

type GetIngredientsParams = {
  category: string | null;
  isMine: boolean;
  q: string;
  pageParam: number;
};

const emptyPage: IngredientsApiResponse = {
  content: [],
  page: {
    size: 20,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  },
};

const getIngredientsMock = jest.fn(
  async (_params: GetIngredientsParams): Promise<IngredientsApiResponse> =>
    emptyPage
);

jest.mock("@/entities/ingredient/model/api", () => ({
  getIngredients: (params: GetIngredientsParams) => getIngredientsMock(params),
}));

const CATEGORIES: readonly RecipeCreateCategoryTab[] = [
  "전체",
  "고기",
  "나의 재료",
];

const queryConfig: IngredientPickerQueryConfig = {
  keyBase: "pickerIngredients",
  getParams: (category) => ({
    category: category === "나의 재료" || category === "전체" ? null : category,
    isMine: category === "나의 재료",
  }),
};

const isAlreadyAdded = (_ingredient: IngredientItem) => false;

const renderPicker = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <IngredientPicker
        open
        onOpenChange={() => {}}
        categories={CATEGORIES}
        queryConfig={queryConfig}
        isAlreadyAdded={isAlreadyAdded}
        onComplete={() => {}}
      />
    </QueryClientProvider>
  );

describe("IngredientPicker i18n", () => {
  beforeEach(() => {
    getIngredientsMock.mockClear();
  });

  it("ja에서 chrome과 카테고리 칩이 현지화된 사전/택소노미 값으로 표시된다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new");
    const { container } = renderPicker();

    expect(
      screen.getByPlaceholderText(ingredientPickerMessages.ja.searchPlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByText(ingredientPickerMessages.ja.title)
    ).toBeInTheDocument();
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
        name: ingredientPickerMessages.ja.myIngredients,
      })
    ).toBeInTheDocument();

    expect(container.textContent).not.toMatch(/[가-힣]/);
  });

  it("ja에서 고기 칩을 눌러도 쿼리에는 ko canonical 카테고리가 전달된다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new");
    renderPicker();

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

  it("ja에서 마이 식재료 칩의 쿼리는 category 없이 isMine만 전달한다", () => {
    mockPathname.mockReturnValue("/ja/recipes/new");
    renderPicker();

    fireEvent.click(
      screen.getByRole("button", {
        name: ingredientPickerMessages.ja.myIngredients,
      })
    );

    expect(
      getIngredientsMock.mock.calls.some(
        ([params]) => params.category === null && params.isMine === true
      )
    ).toBe(true);
  });

  it("ko에서는 한글 canonical 라벨을 그대로 쓴다", () => {
    mockPathname.mockReturnValue("/recipes/new");
    renderPicker();

    expect(screen.getByRole("button", { name: "전체" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "고기" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: ingredientPickerMessages.ko.myIngredients,
      })
    ).toBeInTheDocument();
  });
});
