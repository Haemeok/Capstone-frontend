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

import type { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe/model/types";

import DetailedRecipeGridItem from "../DetailedRecipeGridItem";

const baseRecipe: DetailedRecipeGridItemType = {
  id: "r1",
  title: "고추장 파스타",
  imageUrl: "https://img/r1.webp",
  authorName: "차경환",
  authorId: "a1",
  profileImage: "https://img/a1.webp",
  createdAt: "2026-06-01T00:00:00Z",
  favoriteByCurrentUser: false,
  source: "YOUTUBE",
  avgRating: 0,
  ratingCount: 0,
  creatorCountryTag: "JP",
};

describe("DetailedRecipeGridItem 국가 국기", () => {
  it("절약 배지가 없으면 JP 국기를 노출한다", () => {
    render(<DetailedRecipeGridItem recipe={baseRecipe} />);
    expect(screen.getByRole("img", { name: "일본 채널" })).toBeInTheDocument();
  });

  it("절약 배지가 있으면 국기를 숨긴다 (절약 우선)", () => {
    render(
      <DetailedRecipeGridItem
        recipe={baseRecipe}
        infoBadge={<span>1,000원 절약</span>}
      />
    );
    expect(screen.getByText("1,000원 절약")).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "일본 채널" })
    ).not.toBeInTheDocument();
  });
});
