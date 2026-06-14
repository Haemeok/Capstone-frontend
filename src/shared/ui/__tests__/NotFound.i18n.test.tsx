import { render, screen } from "@testing-library/react";

import { notFoundMessages } from "@/shared/i18n/notFoundMessages";

import NotFound from "../NotFound";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPath(),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("@/entities/notification", () => ({
  useDeleteNotification: () => ({ mutate: jest.fn() }),
}));

const ja = notFoundMessages.ja;

describe("NotFound i18n", () => {
  it("T-04: ja path -> ja title/desc/buttons, no Hangul", () => {
    mockPath.mockReturnValue("/ja/recipes/x");
    const { container } = render(
      <NotFound titleKey="recipe" descriptionKey="recipe" />
    );
    expect(
      screen.getByRole("heading", { name: ja.recipe.title })
    ).toBeInTheDocument();
    expect(screen.getByText(ja.recipe.description)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ja.goBack })).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-07: ko path -> Korean preserved", () => {
    mockPath.mockReturnValue("/recipes/x");
    render(<NotFound titleKey="recipe" descriptionKey="recipe" />);
    expect(
      screen.getByRole("heading", { name: notFoundMessages.ko.recipe.title })
    ).toBeInTheDocument();
  });
});
