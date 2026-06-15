import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import type { RecipeBook } from "@/entities/recipe-book";

import { RecipeBookDetailHeader } from "../RecipeBookDetailHeader";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

const latinBook: RecipeBook = {
  id: "b1",
  name: "Home",
  isDefault: false,
  displayOrder: 0,
  recipeCount: 3,
};
const koBook: RecipeBook = {
  id: "b1",
  name: "집밥",
  isDefault: false,
  displayOrder: 0,
  recipeCount: 3,
};

const renderHeader = (book: RecipeBook) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RecipeBookDetailHeader book={book} />
    </QueryClientProvider>
  );

describe("RecipeBookDetailHeader i18n", () => {
  it("ja에서 편집 버튼과 이름변경 aria가 현지화된다 (T-01)", () => {
    mockPathname.mockReturnValue("/ja/recipe-books/b1");
    const { container } = renderHeader(latinBook);
    expect(
      screen.getByText(userPagesMessages.ja.recipeBooks.editButton)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(userPagesMessages.ja.recipeBooks.renameAria)
    ).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/[가-힣]/);
  });
  it("en에서도 한글이 없다 (T-01)", () => {
    mockPathname.mockReturnValue("/en/recipe-books/b1");
    const { container } = renderHeader(latinBook);
    expect(container.textContent).not.toMatch(/[가-힣]/);
  });
  it("ko는 기존 '편집' 라벨 그대로 (T-04)", () => {
    mockPathname.mockReturnValue("/recipe-books/b1");
    renderHeader(koBook);
    expect(screen.getByText("편집")).toBeInTheDocument();
  });
});
