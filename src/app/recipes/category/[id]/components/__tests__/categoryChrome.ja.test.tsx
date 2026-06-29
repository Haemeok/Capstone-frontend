import { render, screen } from "@testing-library/react";

import { categoryMessages } from "@/shared/i18n/categoryMessages";
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";

import CategoryChips from "../CategoryChips";
import CategoryEmptyState from "../CategoryEmptyState";
import CategoryHero from "../CategoryHero";

const HANGUL = /[가-힣]/;

const jaDict = categoryMessages.ja;
const jaTags = taxonomyMessages.ja.tags;

jest.mock("next/navigation", () => ({
  usePathname: () => "/ja/recipes/category/CHEF_RECIPE",
  useParams: () => ({ id: "CHEF_RECIPE" }),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

describe("category chrome localized (ja) — T-26", () => {
  it("CategoryChips: ja aria-label + tag labels, no Hangul", () => {
    const { container } = render(<CategoryChips currentCode="CHEF_RECIPE" />);

    expect(
      screen.getByRole("navigation", { name: jaDict.navAriaLabel })
    ).toBeInTheDocument();
    expect(screen.getByText(`# ${jaTags.CHEF_RECIPE}`)).toBeInTheDocument();
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

  it("CategoryHero: ja tag label as heading + img alt", () => {
    const { container } = render(<CategoryHero tagCode="CHEF_RECIPE" />);

    expect(
      screen.getByRole("heading", { name: jaTags.CHEF_RECIPE })
    ).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });
});
