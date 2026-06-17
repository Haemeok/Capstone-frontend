import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock("@/features/recipe-status", () => ({
  useRecipeStatus: () => ({ recipeId: "r1", status: null }),
}));

import { usePathname } from "next/navigation";

import CommentMoreButton from "../CommentMoreButton";

const setPath = (path: string) =>
  (usePathname as jest.Mock).mockReturnValue(path);

describe("CommentMoreButton i18n locale-sticky", () => {
  it("T-B1: /ja 경로에서 href가 /ja/recipes/r1/comments로 시작한다", () => {
    setPath("/ja/recipes/r1");
    render(<CommentMoreButton text="댓글 더 보기" />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/ja/recipes/r1/comments");
  });

  it("T-B2: / 경로에서 href에 locale prefix가 없다", () => {
    setPath("/");
    render(<CommentMoreButton text="댓글 더 보기" />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/recipes/r1/comments");
  });
});
