import { createRef } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { ScrollContext } from "@/shared/lib/ScrollContext";

import { makeBaseRecipe } from "@/entities/recipe/lib/metadata/__tests__/fixtures/recipeFactory";

import { RecipeDetailView } from "../RecipeDetailView";

jest.mock("@/shared/config/cache", () => ({
  invalidateCache: jest.fn().mockResolvedValue(undefined),
  REVALIDATION_TIMES: {},
  CACHE_TAGS: {},
}));

jest.mock("@/shared/lib/gsap", () => ({
  gsap: {
    registerPlugin: jest.fn(),
    context: jest.fn(() => ({ revert: jest.fn() })),
  },
  ScrollTrigger: {},
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/recipes/r1",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ recipeId: "r1" }),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ScrollContext.Provider value={{ motionRef: createRef() }}>
        {ui}
      </ScrollContext.Provider>
    </QueryClientProvider>
  );
};

describe("RecipeDetailView — ko/ja 공유 본문", () => {
  it("T-08: ko recipe + locale ko면 제목 섹션이 렌더된다", () => {
    const recipe = makeBaseRecipe({ title: "김치찌개" });
    renderWithProviders(
      <RecipeDetailView recipe={recipe} recipeId="r1" locale="ko" />
    );
    expect(screen.getAllByText("김치찌개")[0]).toBeInTheDocument();
  });

  it("T-03: ja recipe + locale ja면 일본어 제목이 렌더된다", () => {
    const recipe = makeBaseRecipe({
      title: "親子丼",
      description: "ふわとろ卵",
    });
    renderWithProviders(
      <RecipeDetailView recipe={recipe} recipeId="r2" locale="ja" />
    );
    expect(screen.getAllByText("親子丼")[0]).toBeInTheDocument();
  });
});
