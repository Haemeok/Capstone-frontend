import { createRef } from "react";

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
  usePathname: () => "/recipes/r1",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ recipeId: "r1" }),
}));

const CHAT_LABEL = "레시피 챗봇 열기";

const renderRDV = (locale: "ko" | "ja" | "en") => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ScrollContext.Provider value={{ motionRef: createRef() }}>
        <RecipeDetailView
          recipe={makeBaseRecipe({ title: "김치찌개" })}
          recipeId="r1"
          locale={locale}
        />
      </ScrollContext.Provider>
    </QueryClientProvider>
  );
};

it("T-20: ko 레시피 상세에는 챗봇 런처가 있다", () => {
  const { queryByLabelText } = renderRDV("ko");
  expect(queryByLabelText(CHAT_LABEL)).not.toBeNull();
});

it("T-19: ja 레시피 상세에는 챗봇 런처가 없다", () => {
  const { queryByLabelText } = renderRDV("ja");
  expect(queryByLabelText(CHAT_LABEL)).toBeNull();
});

it("T-21: en 레시피 상세에는 챗봇 런처가 없다", () => {
  const { queryByLabelText } = renderRDV("en");
  expect(queryByLabelText(CHAT_LABEL)).toBeNull();
});
