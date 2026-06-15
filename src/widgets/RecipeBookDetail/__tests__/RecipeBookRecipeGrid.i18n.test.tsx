import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { RecipeBookRecipeGrid } from "../RecipeBookRecipeGrid";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/entities/recipe-book/api/getRecipeBookDetail", () => ({
  getRecipeBookDetail: jest.fn().mockResolvedValue({
    id: "b1",
    name: "Home",
    isDefault: false,
    recipeCount: 0,
    recipes: [],
    hasNext: false,
  }),
}));

const renderGrid = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RecipeBookRecipeGrid bookId="b1" />
    </QueryClientProvider>
  );

describe("RecipeBookRecipeGrid empty state i18n", () => {
  it("ja 빈상태 제목/CTA 현지화 + 한글 0 (T-03)", async () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    const { container, findByText } = renderGrid();
    await findByText(userPagesMessages.ja.recipeBooks.grid.emptyTitle);
    await findByText(userPagesMessages.ja.recipeBooks.grid.emptyCta);
    expect(container.textContent).not.toMatch(/[가-힣]/);
  });
  it("ko 빈상태 기존 문구 (T-04)", async () => {
    mockPathname.mockReturnValue("/recipe-books/b1");
    const { findByText } = renderGrid();
    await findByText("아직 저장한 레시피가 없어요");
  });
});
