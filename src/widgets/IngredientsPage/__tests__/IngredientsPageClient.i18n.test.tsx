import { fireEvent, render, screen } from "@testing-library/react";

import { format } from "@/shared/i18n/format";
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
jest.mock("@/features/ingredient-delete-fridge", () => ({
  useDeleteIngredientBulkMutation: () => ({ mutate: jest.fn() }),
}));

const mockManager = jest.fn();
jest.mock("../hooks/useIngredientsManager", () => ({
  useIngredientsManager: () => mockManager(),
}));
jest.mock("../hooks/useInfiniteIngredients", () => ({
  useInfiniteIngredients: () => ({
    error: null,
    hasNextPage: false,
    isFetchingNextPage: false,
    isPending: false,
    ref: () => {},
    ingredients: [],
  }),
}));
// FabButton은 gsap(useScrollAnimate) 의존 → href만 검증하도록 경량 모킹
jest.mock("@/shared/ui/FabButton", () => ({
  FabButton: ({ to, text }: { to: string; text: string }) => (
    <a href={to}>{text}</a>
  ),
}));

const setSelectedCategory = jest.fn();
const defaultManager = {
  isDeleteMode: false,
  setIsDeleteMode: jest.fn(),
  selectedCategory: "전체",
  setSelectedCategory,
  selectedIngredientIds: [],
  setSelectedIngredientIds: jest.fn(),
};

beforeEach(() => {
  mockManager.mockReturnValue(defaultManager);
  mockUser.mockReturnValue({ nickname: "유저" });
});

describe("IngredientsPageClient i18n", () => {
  it("T-06: /ja에서 헤더가 일본어 + nickname 치환으로 표시된다", () => {
    mockPathname.mockReturnValue("/ja/ingredients");
    render(<IngredientsPageClient />);
    expect(
      screen.getByRole("heading", {
        name: format(ingredientsMessages.ja.headerLoggedIn, {
          nickname: "유저",
        }),
      })
    ).toBeInTheDocument();
  });

  it("T-11: ko(/)에서 헤더가 한글 그대로 표시된다", () => {
    mockPathname.mockReturnValue("/ingredients");
    render(<IngredientsPageClient />);
    expect(
      screen.getByRole("heading", {
        name: format(ingredientsMessages.ko.headerLoggedIn, {
          nickname: "유저",
        }),
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
