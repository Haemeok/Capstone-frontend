/** @jest-environment jsdom */

import { renderToStaticMarkup } from "react-dom/server";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { renderCategoryPage } from "../renderCategoryPage";
import { makeCategoryPage } from "./categoryTestFixtures";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [] }),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/recipes/category/CHEF_RECIPE",
  useParams: () => ({ id: "CHEF_RECIPE" }),
  useRouter: () => ({
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("next/dynamic", () => () => () => null);

jest.mock("@/features/recipe-save", () => ({
  RecipeSaveButton: () => null,
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));

const originalFetch = global.fetch;

const renderInitialHtml = async () => {
  const tree = await renderCategoryPage({
    tagCode: "CHEF_RECIPE",
    searchParams: {},
    locale: "ko",
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>{tree}</QueryClientProvider>
  );
};

describe("category initial HTML", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => makeCategoryPage(0, true),
    }) as unknown as typeof fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("T-01: 공개 1페이지에 API 0페이지 카드 20개와 실제 링크가 있다", async () => {
    const html = await renderInitialHtml();
    const root = document.createElement("div");
    root.innerHTML = html;
    const hrefs = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('a[href^="/recipes/chef-p0-"]')
    ).map((anchor) => anchor.getAttribute("href"));

    expect(new Set(hrefs).size).toBe(20);
    expect(hrefs).toContain("/recipes/chef-p0-01");

    const requestUrl = String((global.fetch as jest.Mock).mock.calls[0][0]);
    expect(requestUrl).toContain("page=0");
    expect(requestUrl).toContain("size=20");
    expect(requestUrl).toContain("sort=createdAt%2Cdesc");
  });
});
