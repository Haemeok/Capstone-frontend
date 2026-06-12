import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));
jest.mock("@/shared/ui/image/Image", () => ({
  __esModule: true,
  Image: ({ alt }: { alt?: string }) => <img alt={alt ?? ""} />,
}));

import DetailedRecipeGridItem from "../DetailedRecipeGridItem";

const recipe = {
  id: "abc123",
  title: "親子丼",
  imageUrl: "https://example.com/x.jpg",
  authorName: "テスト",
  authorId: "u1",
  profileImage: "https://example.com/profile.jpg",
  createdAt: "2026-01-01T00:00:00Z",
  favoriteByCurrentUser: false,
  source: "USER",
  creatorCountryTag: "JP",
  cookingTime: 10,
  avgRating: 4.5,
  ratingCount: 3,
} as never;

describe("DetailedRecipeGridItem — locale 링크", () => {
  it("T-18: locale ja면 카드 링크가 /ja/recipes/{id}다", () => {
    render(<DetailedRecipeGridItem recipe={recipe} locale="ja" />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/ja/recipes/abc123"
    );
  });
});
