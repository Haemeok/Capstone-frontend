import { render, screen } from "@testing-library/react";

import { errorsMessages } from "@/shared/i18n/errorsMessages";

import SectionErrorFallback from "../SectionErrorFallback";

const HANGUL = /[가-힣]/;
const mockPath = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPath() }));

describe("SectionErrorFallback i18n", () => {
  it("T-05: ja section message + retry, no Hangul", () => {
    mockPath.mockReturnValue("/ja/recipes/x");
    const { container } = render(<SectionErrorFallback onRetry={() => {}} />);
    expect(
      screen.getByText(errorsMessages.ja.sectionMessage)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: errorsMessages.ja.sectionRetry })
    ).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("T-07: ko section preserved", () => {
    mockPath.mockReturnValue("/recipes/x");
    render(<SectionErrorFallback onRetry={() => {}} />);
    expect(
      screen.getByText(errorsMessages.ko.sectionMessage)
    ).toBeInTheDocument();
  });
});
