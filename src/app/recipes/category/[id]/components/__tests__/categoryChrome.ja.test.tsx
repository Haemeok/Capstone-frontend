import { render, screen } from "@testing-library/react";

import { categoryMessages } from "@/shared/i18n/categoryMessages";
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import CategoryEmptyState from "../CategoryEmptyState";
import CategoryHeader from "../CategoryHeader";
import CategoryNavigation from "../CategoryNavigation";

const HANGUL = /[가-힣]/;

const jaDict = categoryMessages.ja;
const jaTags = taxonomyMessages.ja.tags;

jest.mock("next/navigation", () => ({
  usePathname: () => "/ja/recipes/category/CHEF_RECIPE",
  useParams: () => ({ id: "CHEF_RECIPE" }),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

describe("category chrome localized (ja) — T-26", () => {
  it("CategoryHeader + CategoryNavigation: ja heading, links, no Hangul", () => {
    const { container } = render(
      <>
        <CategoryHeader />
        <CategoryNavigation currentCode="CHEF_RECIPE" />
      </>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: jaDict.pageTitle })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: jaDict.navAriaLabel })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { current: "page" })).toHaveAttribute(
      "href",
      "/ja/recipes/category/CHEF_RECIPE"
    );
    expect(screen.getByRole("link", { current: "page" })).toHaveTextContent(
      jaTags.CHEF_RECIPE
    );
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("CategoryEmptyState: ja title/subtitle/cta with localized tagName", () => {
    const { container } = render(
      <CategoryEmptyState tagName={jaTags.CHEF_RECIPE} />
    );

    expect(
      screen.getByText(`${jaTags.CHEF_RECIPE}のレシピはまだありません`)
    ).toBeInTheDocument();
    expect(screen.getByText(jaDict.emptySubtitle)).toBeInTheDocument();
    expect(screen.getByText(jaDict.emptyCta)).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });
});
