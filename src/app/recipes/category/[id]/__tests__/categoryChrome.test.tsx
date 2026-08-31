import { render, screen } from "@testing-library/react";

import type { RecipeGridProps } from "@/widgets/RecipeGrid/model/types";

import CategoryDetailClient from "../CategoryDetailClient";
import { makeCategoryPage } from "./categoryTestFixtures";

const mockObserverRef = jest.fn();
let mockRecipeGridProps: RecipeGridProps | null = null;

jest.mock("next/dynamic", () => () => () => null);

jest.mock("next/navigation", () => ({
  usePathname: () => "/recipes/category/CHEF_RECIPE",
  useParams: () => ({ id: "CHEF_RECIPE" }),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

jest.mock("@/shared/hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: () => ({
    data: {
      pages: [makeCategoryPage(0, false, 2)],
      pageParams: [0],
    },
    hasNextPage: false,
    isFetching: false,
    ref: mockObserverRef,
  }),
}));

jest.mock("@/widgets/RecipeGrid/ui/RecipeGrid", () => ({
  __esModule: true,
  default: (props: RecipeGridProps) => {
    mockRecipeGridProps = props;
    return <div aria-label="recipe feed" />;
  },
}));

describe("category page chrome", () => {
  beforeEach(() => {
    mockRecipeGridProps = null;
  });

  it("T-01: 대표 사진 없이 컴팩트 헤더와 현재 카테고리 피드를 표시한다", () => {
    const { container } = render(
      <CategoryDetailClient
        tagCode="CHEF_RECIPE"
        locale="ko"
        initialApiPage={0}
        previousPageHref="/recipes/category/CHEF_RECIPE?page=1"
        nextPageHref="/recipes/category/CHEF_RECIPE?page=3"
      />
    );

    const pageTitle = screen.getByRole("heading", {
      level: 1,
      name: "레시피 카테고리",
    });
    const appBar = pageTitle.closest("header");
    expect(appBar).toBeInTheDocument();
    expect(appBar).toHaveClass("h-[52px]");
    expect(
      screen.getByRole("navigation", { name: "카테고리" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "셰프 레시피" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("셰프 레시피, 한곳에서 둘러보세요")
    ).toBeInTheDocument();

    const sortButton = screen.getByRole("button", {
      name: "정렬 순서 변경: 현재 최신순",
    });
    expect(sortButton).toHaveClass("min-h-11", "cursor-pointer");
    expect(
      container.querySelector('img[src*="categories/chef.webp"]')
    ).not.toBeInTheDocument();

    expect(mockRecipeGridProps?.recipes).toHaveLength(2);
    expect(mockRecipeGridProps).toEqual(
      expect.objectContaining({
        observerRef: mockObserverRef,
        locale: "ko",
        previousPageHref: "/recipes/category/CHEF_RECIPE?page=1",
        nextPageHref: "/recipes/category/CHEF_RECIPE?page=3",
      })
    );
  });
});
