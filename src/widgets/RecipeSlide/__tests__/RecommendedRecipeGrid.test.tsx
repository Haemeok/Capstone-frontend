import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    prefetch,
    ...props
  }: {
    children: React.ReactNode;
    prefetch?: boolean | null;
  }) => (
    <a {...props} data-prefetch={prefetch === null ? "null" : String(prefetch)}>
      {children}
    </a>
  ),
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/recipes/current-recipe",
}));
jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
jest.mock("@/features/recipe-save", () => ({
  RecipeSaveButton: () => <button type="button">save</button>,
}));

import RecommendedRecipeGrid from "../RecommendedRecipeGrid";

it("T-PREFETCH-2: 상세 추천 레시피는 화면에 보여도 미리 요청하지 않는다", () => {
  render(
    <RecommendedRecipeGrid
      title="추천 레시피"
      recipes={[
        {
          id: "recommended-recipe",
          title: "김치찌개",
          imageUrl: "https://example.com/recipe.webp",
          authorId: "author-1",
          authorName: "레시피오",
          profileImage: "https://example.com/profile.webp",
          createdAt: "2026-08-24T00:00:00Z",
          favoriteByCurrentUser: false,
          avgRating: 0,
          ratingCount: 0,
        },
      ]}
      isLoading={false}
      error={null}
      locale="ko"
    />
  );

  expect(screen.getByRole("link")).toHaveAttribute("data-prefetch", "false");
});
