import { render, screen } from "@testing-library/react";

import { youtubeMessages } from "@/shared/i18n";

import type { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe/model/types";

import { DuplicateRecipeCard } from "../DuplicateRecipeCard";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

jest.mock("@/widgets/RecipeGrid/ui/DetailedRecipeGridItem", () => ({
  __esModule: true,
  default: () => null,
}));

const HANGUL = /[가-힣]/;
// child widget mocked, recipeItem fields unused
const recipeItem = {} as DetailedRecipeGridItemType;

const renderCard = (
  overrides: Partial<Parameters<typeof DuplicateRecipeCard>[0]> = {}
) =>
  render(
    <DuplicateRecipeCard
      recipeId="r1"
      recipeItem={recipeItem}
      isFavorited={false}
      onSaveClick={jest.fn()}
      {...overrides}
    />
  );

describe("DuplicateRecipeCard i18n", () => {
  it.each([
    ["/ja/recipes/new/youtube", "ja"] as const,
    ["/en/recipes/new/youtube", "en"] as const,
    ["/recipes/new/youtube", "ko"] as const,
  ])("T-01: %s 에서 dict[%s] 값으로 렌더한다", (path, loc) => {
    mockPathname.mockReturnValue(path);
    const m = youtubeMessages[loc];
    renderCard();
    expect(screen.getByText(m.duplicateTitle)).toBeInTheDocument();
    expect(screen.getByText(m.duplicateNoCredit)).toBeInTheDocument();
    expect(screen.getByText(m.duplicateViewButton)).toBeInTheDocument();
    expect(screen.getByText(m.duplicateSaveButton)).toBeInTheDocument();
  });

  it.each([["/ja/x"] as const, ["/en/x"] as const])(
    "T-01: %s 렌더 트리에 한글이 없다",
    (path) => {
      mockPathname.mockReturnValue(path);
      const { container } = renderCard();
      expect(container.textContent ?? "").not.toMatch(HANGUL);
    }
  );

  it("T-02: urlSource=direct 이면 추가 안내를 노출한다", () => {
    mockPathname.mockReturnValue("/ja/x");
    renderCard({ urlSource: "direct" });
    expect(
      screen.getByText(youtubeMessages.ja.duplicateAdded)
    ).toBeInTheDocument();
  });

  it("T-03: isFavorited 이면 저장됨 안내 노출 + 저장 버튼 숨김", () => {
    mockPathname.mockReturnValue("/en/x");
    renderCard({ isFavorited: true });
    expect(
      screen.getByText(youtubeMessages.en.duplicateAlreadySaved)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(youtubeMessages.en.duplicateSaveButton)
    ).not.toBeInTheDocument();
  });
});
