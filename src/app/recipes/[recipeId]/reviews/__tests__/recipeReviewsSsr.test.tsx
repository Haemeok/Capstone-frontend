/** @jest-environment jsdom */

import { renderToStaticMarkup } from "react-dom/server";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { makeBaseRecipe } from "@/entities/recipe/lib/metadata/__tests__/fixtures/recipeFactory";
import { getStaticrecipionServer } from "@/entities/recipe/model/api.server";

import { renderRecipeReviewsPage } from "../renderRecipeReviewsPage";
import { makeReviewPage } from "./reviewTestFixtures";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  usePathname: () => "/recipes/recipe-a/reviews",
  useRouter: () => ({
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("@/entities/recipe/model/api.server", () => ({
  getStaticrecipionServer: jest.fn(),
}));

const getStaticRecipeMock = jest.mocked(getStaticrecipionServer);
const originalFetch = global.fetch;

const makeTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

beforeEach(() => {
  getStaticRecipeMock.mockResolvedValue(
    makeBaseRecipe({ title: "정호영 냉우동" })
  );
});

afterEach(() => {
  global.fetch = originalFetch;
  jest.clearAllMocks();
});

it("T-02: 전체 후기 서버 HTML은 전체 23개와 최신 후기 20건만 표시한다", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => makeReviewPage(20, 23, true),
  }) as typeof fetch;

  const tree = await renderRecipeReviewsPage({ recipeId: "recipe-a" });
  const html = renderToStaticMarkup(
    <QueryClientProvider client={makeTestQueryClient()}>
      {tree}
    </QueryClientProvider>
  );

  expect(html).toContain("전체 23개");
  expect(html).toContain("후기 01");
  expect(html).toContain("후기 20");
  expect(html).not.toContain("후기 21");

  const requestUrl = new URL(
    String((global.fetch as jest.Mock).mock.calls[0][0])
  );
  expect(requestUrl.searchParams.get("page")).toBe("0");
  expect(requestUrl.searchParams.get("size")).toBe("20");
  expect(requestUrl.searchParams.get("photoOnly")).toBe("false");
  expect(global.fetch).toHaveBeenCalledWith(expect.any(URL), {
    cache: "no-store",
  });
});
