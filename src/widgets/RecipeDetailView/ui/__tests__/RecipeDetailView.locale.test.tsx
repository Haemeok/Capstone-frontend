import { type ReactNode, useRef } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

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
  usePathname: () => "/ja/recipes/r1",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ recipeId: "r1" }),
}));

// useScroll({ container })는 effect 시점에 ref가 실제 DOM에 붙어 있어야 한다
const ScrollRoot = ({ children }: { children: ReactNode }) => {
  const motionRef = useRef<HTMLDivElement>(null);
  return (
    <ScrollContext.Provider value={{ motionRef }}>
      <div ref={motionRef}>{children}</div>
    </ScrollContext.Provider>
  );
};

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ScrollRoot>{ui}</ScrollRoot>
    </QueryClientProvider>
  );
};

const headerText = (c: HTMLElement) =>
  c.querySelector("[data-testid='ingredients-section-header']")?.textContent ??
  "";

it("T-10: ingredients 헤더가 locale=ja에서 ko와 다르고 비어있지 않다 (+ko 무회귀 앵커)", () => {
  const recipe = makeBaseRecipe({ title: "김치찌개" });
  const ko = renderWithProviders(
    <RecipeDetailView recipe={recipe} recipeId="r1" locale="ko" />
  );
  const koText = headerText(ko.container);
  ko.unmount();
  const ja = renderWithProviders(
    <RecipeDetailView recipe={recipe} recipeId="r1" locale="ja" />
  );
  const jaText = headerText(ja.container);
  expect(koText).toBe("재료");
  expect(jaText).not.toBe("");
  expect(jaText).not.toBe(koText);
});

it("T-11: notTranslatedMessage가 있으면 role=status 배너로 렌더한다", () => {
  const recipe = makeBaseRecipe({ title: "김치찌개" });
  const { getByRole } = renderWithProviders(
    <RecipeDetailView
      recipe={recipe}
      recipeId="r1"
      locale="ja"
      notTranslatedMessage="この レシピ は まだ 翻訳 されていません"
    />
  );
  expect(getByRole("status")).toHaveTextContent("翻訳");
});
