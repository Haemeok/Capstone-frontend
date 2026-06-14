import { render, screen } from "@testing-library/react";

import { errorsMessages } from "@/shared/i18n/errorsMessages";

import ErrorFallback from "../ErrorFallback";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPath() }));

const ja = errorsMessages.ja;
const ko = errorsMessages.ko;

describe("ErrorFallback i18n", () => {
  it("T-01: ja path -> ja chrome + context message, no Hangul", () => {
    mockPath.mockReturnValue("/ja/recipes/abc");
    const { container } = render(
      <ErrorFallback reset={() => {}} context="recipe" />
    );
    expect(screen.getByText(ja.heading)).toBeInTheDocument();
    expect(screen.getByText(ja.context.recipe)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ja.retry })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ja.goHome })).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-02: ko path -> existing Korean preserved", () => {
    mockPath.mockReturnValue("/recipes/abc");
    render(<ErrorFallback reset={() => {}} context="recipe" />);
    expect(screen.getByText(ko.heading)).toBeInTheDocument();
    expect(screen.getByText(ko.context.recipe)).toBeInTheDocument();
  });

  it("T-03: no locale prefix -> ko default", () => {
    mockPath.mockReturnValue("/search/results");
    render(<ErrorFallback reset={() => {}} context="generic" />);
    expect(screen.getByText(ko.context.generic)).toBeInTheDocument();
  });
});
