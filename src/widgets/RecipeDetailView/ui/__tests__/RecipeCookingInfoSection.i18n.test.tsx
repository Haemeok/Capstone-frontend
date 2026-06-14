import { render, screen } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";

import RecipeCookingInfoSection from "../RecipeCookingInfoSection";

const HANGUL = /[가-힣]/;

jest.mock("@/shared/ui/image", () => ({
  Image: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

describe("RecipeCookingInfoSection i18n", () => {
  it("T-11: ja -> localized cooking time/servings unit, no Hangul", () => {
    const t = getDictionary("ja");
    const { container } = render(
      <RecipeCookingInfoSection
        cookingTime={40}
        servings={2}
        cookingTools={[]}
        locale="ja"
      />
    );
    expect(
      screen.getByText(t.recipeDetail.cookingTimeValue.replace("{n}", "40"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t.recipeDetail.servingsValue.replace("{n}", "2"))
    ).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-13: ko -> Korean units preserved", () => {
    render(
      <RecipeCookingInfoSection
        cookingTime={40}
        servings={2}
        cookingTools={[]}
        locale="ko"
      />
    );
    expect(screen.getByText("40분")).toBeInTheDocument();
    expect(screen.getByText("2인분")).toBeInTheDocument();
  });
});
