import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

jest.mock("@/shared/api/client", () => ({
  api: { get: jest.fn(), post: jest.fn() },
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

import RecipeSlideWithErrorBoundary from "../RecipeSlideWithErrorBoundary";

const wrap = (ui: React.ReactElement) =>
  render(
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
  );

describe("RecipeSlideWithErrorBoundary 빈/메타 게이트 (T-PRES-empty)", () => {
  it("staticRecipes 비면 제목도 안 보인다(null)", () => {
    wrap(
      <RecipeSlideWithErrorBoundary
        title="유튜브 인기"
        staticRecipes={[]}
        locale="ko"
      />
    );
    expect(screen.queryByText("유튜브 인기")).not.toBeInTheDocument();
  });

  it("requiresMeta인데 metaName 없으면 null", () => {
    wrap(
      <RecipeSlideWithErrorBoundary
        title="제철"
        staticRecipes={[
          {
            id: "r1",
            title: "감자전",
            imageUrl: "",
            authorName: "a",
            authorId: "a1",
            profileImage: "",
            createdAt: "2026-01-01T00:00:00",
            avgRating: 0,
            ratingCount: 0,
            tags: [],
          },
        ]}
        requiresMeta
        metaName={null}
        locale="ko"
      />
    );
    expect(screen.queryByText("제철")).not.toBeInTheDocument();
  });
});
