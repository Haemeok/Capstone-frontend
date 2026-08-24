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
  usePathname: () => "/search",
}));
jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

import SimpleRecipeGridItem from "../SimpleRecipeGridItem";

it("T-PREFETCH-2: 일반 레시피 그리드는 보이는 카드도 미리 요청하지 않는다", () => {
  render(
    <SimpleRecipeGridItem
      recipe={{
        id: "recipe-1",
        title: "된장찌개",
        imageUrl: "https://example.com/recipe.webp",
        authorName: "레시피오",
        authorId: "author-1",
        profileImage: "https://example.com/profile.webp",
        createdAt: "2026-08-24T00:00:00Z",
        favoriteByCurrentUser: false,
      }}
    />
  );

  expect(screen.getByRole("link")).toHaveAttribute("data-prefetch", "false");
});
