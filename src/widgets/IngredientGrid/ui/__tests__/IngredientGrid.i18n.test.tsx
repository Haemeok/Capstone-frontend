import { render, screen } from "@testing-library/react";

import { ingredientsMessages } from "@/shared/i18n/ingredientsMessages";

import IngredientGrid from "../IngredientGrid";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const baseProps = {
  ingredients: [],
  isDeleteMode: false,
  isFetchingNextPage: false,
  isPending: false,
  hasNextPage: false,
  ref: () => {},
  isLoggedIn: true,
  setSelectedIngredientIds: () => {},
  selectedIngredientIds: [],
};

describe("IngredientGrid error i18n", () => {
  it("T-09: /ja에서 에러 발생 시 에러 문구가 일본어로 표시된다", () => {
    mockPathname.mockReturnValue("/ja/ingredients");
    render(<IngredientGrid {...baseProps} error={new Error("boom")} />);
    expect(
      screen.getByText(new RegExp(ingredientsMessages.ja.error.prefix))
    ).toBeInTheDocument();
  });
});
