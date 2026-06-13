import { fireEvent, render, screen } from "@testing-library/react";

import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import { RecipeTypeSelector } from "../RecipeTypeSelector";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

const NOOP = () => {};
const EMPTY: string[] = [];

describe("RecipeTypeSelector i18n", () => {
  it("T-01: /ja에서 USER 라벨이 ja 사전값", () => {
    mockPathname.mockReturnValue("/ja/search/results");
    render(<RecipeTypeSelector selectedTypes={EMPTY} onTypesChange={NOOP} />);
    expect(
      screen.getByText(taxonomyMessages.ja.recipeType.USER)
    ).toBeInTheDocument();
    expect(screen.queryByText("사용자 레시피")).not.toBeInTheDocument();
  });

  it("T-02: ko에서 한글 라벨 유지", () => {
    mockPathname.mockReturnValue("/search/results");
    render(<RecipeTypeSelector selectedTypes={EMPTY} onTypesChange={NOOP} />);
    expect(screen.getByText("사용자 레시피")).toBeInTheDocument();
  });

  it("T-03: /ja에서 클릭해도 코드 USER가 전달된다", () => {
    mockPathname.mockReturnValue("/ja/search/results");
    const onChange = jest.fn();
    render(
      <RecipeTypeSelector selectedTypes={EMPTY} onTypesChange={onChange} />
    );
    fireEvent.click(screen.getByText(taxonomyMessages.ja.recipeType.USER));
    expect(onChange).toHaveBeenCalledWith(["USER"]);
  });
});
