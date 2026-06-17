import { render, screen } from "@testing-library/react";

import { youtubeMessages } from "@/shared/i18n";

import MySavedRecipesTabContent from "../MySavedRecipesTabContent";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

jest.mock("@/widgets/RecipeBookGrid", () => ({
  __esModule: true,
  RecipeBookGrid: () => null,
}));

jest.mock("@/features/recipe-import-youtube", () => ({
  __esModule: true,
  useYoutubeImportStoreV2: (selector: (s: unknown) => unknown) =>
    selector({ jobs: { k1: { state: "failed" } } }),
  PendingRecipeSection: () => {
    throw new Error("boom");
  },
}));

describe("MySavedRecipesTabContent i18n (T-13)", () => {
  it("자식 throw 시 폴백 메시지가 dict[locale].pendingLoadError", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockPathname.mockReturnValue("/ja/users/u1");
    render(<MySavedRecipesTabContent />);
    expect(
      screen.getByText(youtubeMessages.ja.pendingLoadError)
    ).toBeInTheDocument();
    spy.mockRestore();
  });
});
