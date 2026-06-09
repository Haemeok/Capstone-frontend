import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

import CategoryEmptyState from "../CategoryEmptyState";

describe("CategoryEmptyState", () => {
  it("카테고리명과 레시피 만들기 CTA를 표시한다 (T-05)", () => {
    render(<CategoryEmptyState tagName="야식" />);
    expect(screen.getByText(/야식/)).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /레시피 만들기/ });
    expect(cta).toHaveAttribute("href", "/recipes/new");
  });

  it("로봇 이미지를 쓰지 않는다 (불변식, T-05)", () => {
    render(<CategoryEmptyState tagName="야식" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
