import { fireEvent, render, screen } from "@testing-library/react";

import { ingredientsMessages } from "@/shared/i18n/ingredientsMessages";
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import IngredientsPageClient from "../IngredientsPageClient";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

const mockUser = jest.fn();
jest.mock("@/entities/user", () => ({
  useUserStore: () => ({ user: mockUser() }),
}));
const mockManager = jest.fn();
jest.mock("../hooks/useIngredientsManager", () => ({
  useIngredientsManager: () => mockManager(),
}));
jest.mock("../hooks/useFridgeDeleteFlow", () => ({
  useFridgeDeleteFlow: () => ({
    isDialogOpen: false,
    setIsDialogOpen: jest.fn(),
    selectedIngredientNames: [],
    isPending: false,
    error: null,
    clearErrorOnIntent: jest.fn(),
    openDialog: jest.fn(),
    confirmDelete: jest.fn(),
  }),
}));
jest.mock("../hooks/useInfiniteIngredients", () => ({
  useInfiniteIngredients: () => ({
    error: null,
    hasNextPage: false,
    isFetchingNextPage: false,
    isPending: false,
    ref: () => {},
    ingredients: [],
    totalCount: 0,
    isTotalCountError: false,
    isTotalCountPending: false,
  }),
}));
const setSelectedCategory = jest.fn();
const defaultManager = {
  mode: "view",
  selectedCategory: "전체",
  setSelectedCategory,
  selectedIngredientIds: new Set<string>(),
  selectedIngredientNames: [],
  enterManageMode: jest.fn(),
  exitManageMode: jest.fn(),
  toggleIngredient: jest.fn(),
  toggleAll: jest.fn(),
};

beforeEach(() => {
  mockManager.mockReturnValue(defaultManager);
  mockUser.mockReturnValue({ nickname: "유저" });
});

describe("IngredientsPageClient i18n", () => {
  it("T-06: /ja에서 냉장고 제목이 일본어로 표시된다", () => {
    mockPathname.mockReturnValue("/ja/ingredients");
    render(<IngredientsPageClient />);
    expect(
      screen.getByRole("heading", {
        name: ingredientsMessages.ja.title,
      })
    ).toBeInTheDocument();
  });

  it("T-11: ko(/)에서 헤더가 한글 그대로 표시된다", () => {
    mockPathname.mockReturnValue("/ingredients");
    render(<IngredientsPageClient />);
    expect(
      screen.getByRole("heading", {
        name: ingredientsMessages.ko.title,
      })
    ).toBeInTheDocument();
  });

  it("T-21: /ja에서 카테고리 칩이 택소노미 라벨(일본어)로 표시된다", () => {
    mockPathname.mockReturnValue("/ja/ingredients");
    render(<IngredientsPageClient />);
    expect(
      screen.getByRole("button", {
        name: taxonomyMessages.ja.ingredientCategory.meat,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: taxonomyMessages.ja.ingredientCategory.ALL,
      })
    ).toBeInTheDocument();
  });

  it("T-22: /ja에서 '고기' 칩 클릭 시 ko canonical '고기'로 setSelectedCategory 호출", () => {
    mockPathname.mockReturnValue("/ja/ingredients");
    render(<IngredientsPageClient />);
    fireEvent.click(
      screen.getByRole("button", {
        name: taxonomyMessages.ja.ingredientCategory.meat,
      })
    );
    expect(setSelectedCategory).toHaveBeenCalledWith("고기");
  });

  it("T-23: ko(/)에서 칩이 한글 그대로 표시된다", () => {
    mockPathname.mockReturnValue("/ingredients");
    render(<IngredientsPageClient />);
    expect(screen.getByRole("button", { name: "고기" })).toBeInTheDocument();
  });

  it("T-25: /ja에서 FAB가 /ja/recipes/my-fridge로 이동한다", () => {
    mockPathname.mockReturnValue("/ja/ingredients");
    render(<IngredientsPageClient />);
    expect(
      screen.getByRole("link", {
        name: ingredientsMessages.ja.fabFindRecipes,
      })
    ).toHaveAttribute("href", "/ja/recipes/my-fridge");
  });

  it("T-25 ko: ko(/)에서 FAB가 /recipes/my-fridge로 이동한다", () => {
    mockPathname.mockReturnValue("/ingredients");
    render(<IngredientsPageClient />);
    expect(
      screen.getByRole("link", {
        name: ingredientsMessages.ko.fabFindRecipes,
      })
    ).toHaveAttribute("href", "/recipes/my-fridge");
  });
});
