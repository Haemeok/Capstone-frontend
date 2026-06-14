import { render, screen } from "@testing-library/react";

import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import RecipeSortButton from "./RecipeSortButton";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

describe("RecipeSortButton i18n", () => {
  it("/ja에서 currentSort 표시가 ja 사전값", () => {
    mockPathname.mockReturnValue("/ja/recipes/category/abc");
    render(<RecipeSortButton currentSort="최신순" />);
    expect(
      screen.getByText(taxonomyMessages.ja.recipeSort["최신순"])
    ).toBeInTheDocument();
    expect(screen.queryByText("최신순")).not.toBeInTheDocument();
  });

  it("ko에서 한글 라벨 유지", () => {
    mockPathname.mockReturnValue("/recipes/category/abc");
    render(<RecipeSortButton currentSort="최신순" />);
    expect(screen.getByText("최신순")).toBeInTheDocument();
  });
});
