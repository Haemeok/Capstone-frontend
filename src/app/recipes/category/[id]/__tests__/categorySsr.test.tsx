/** @jest-environment jsdom */

import { renderToStaticMarkup } from "react-dom/server";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  buildCategoryPageHref,
  type CategorySearchParams,
} from "../categoryPagination";
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

const installPagedFetch = () => {
  global.fetch = jest.fn().mockImplementation(async (input: RequestInfo) => {
    const url = new URL(String(input));
    const apiPage = Number(url.searchParams.get("page"));

    return {
      ok: true,
      json: async () => makeCategoryPage(apiPage, apiPage < 2),
    };
  }) as unknown as typeof fetch;
};

const renderInitialHtml = async (
  searchParams: CategorySearchParams = {},
  locale: "ko" | "ja" | "en" = "ko"
) => {
  const tree = await renderCategoryPage({
    tagCode: "CHEF_RECIPE",
    searchParams,
    locale,
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>{tree}</QueryClientProvider>
  );
};

const RECIPE_DETAIL_HREF = /^\/(?:\w{2}\/)?recipes\/(?!category\/)[^/?#]+$/;

const getRecipeHrefs = (html: string) => {
  const root = document.createElement("div");
  root.innerHTML = html;

  return Array.from(root.querySelectorAll<HTMLAnchorElement>("a[href]"))
    .map((anchor) => anchor.getAttribute("href") ?? "")
    .filter((href) => RECIPE_DETAIL_HREF.test(href));
};

const getPaginationHrefs = (html: string, rel: "prev" | "next") => {
  const root = document.createElement("div");
  root.innerHTML = html;

  return Array.from(
    root.querySelectorAll<HTMLAnchorElement>(`a[rel="${rel}"]`)
  ).map((anchor) => anchor.getAttribute("href"));
};

describe("category initial HTML", () => {
  beforeEach(() => {
    installPagedFetch();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("T-01: 공개 1페이지에 API 0페이지 카드 20개와 실제 링크가 있다", async () => {
    const html = await renderInitialHtml();
    const hrefs = getRecipeHrefs(html);

    expect(hrefs).toHaveLength(20);
    expect(new Set(hrefs).size).toBe(20);
    expect(hrefs).toContain("/recipes/chef-p0-01");

    const requestUrl = String((global.fetch as jest.Mock).mock.calls[0][0]);
    expect(requestUrl).toContain("page=0");
    expect(requestUrl).toContain("size=20");
    expect(requestUrl).toContain("sort=createdAt%2Cdesc");
  });

  it("T-02: 공개 1·2·3페이지는 각각 20개의 서로 겹치지 않는 초기 HTML 링크를 만든다", async () => {
    const page1Html = await renderInitialHtml();
    const page2Html = await renderInitialHtml({ page: "2" });
    const page3Html = await renderInitialHtml({ page: "3" });
    const page1Hrefs = getRecipeHrefs(page1Html);
    const page2Hrefs = getRecipeHrefs(page2Html);
    const page3Hrefs = getRecipeHrefs(page3Html);
    const page1HrefSet = new Set(page1Hrefs);
    const page2HrefSet = new Set(page2Hrefs);
    const page3HrefSet = new Set(page3Hrefs);
    const page2RequestUrl = new URL(
      String((global.fetch as jest.Mock).mock.calls[1][0])
    );
    const page3RequestUrl = new URL(
      String((global.fetch as jest.Mock).mock.calls[2][0])
    );

    expect(page1Hrefs).toHaveLength(20);
    expect(page1HrefSet.size).toBe(20);
    expect(page2Hrefs).toHaveLength(20);
    expect(page2HrefSet.size).toBe(20);
    expect(page3Hrefs).toHaveLength(20);
    expect(page3HrefSet.size).toBe(20);
    expect(page1Hrefs.filter((href) => page2HrefSet.has(href))).toEqual([]);
    expect(page1Hrefs.filter((href) => page3HrefSet.has(href))).toEqual([]);
    expect(page2Hrefs.filter((href) => page3HrefSet.has(href))).toEqual([]);
    expect(page2Hrefs).toContain("/recipes/chef-p1-01");
    expect(page3Hrefs).toContain("/recipes/chef-p2-01");
    expect(page2Html).not.toContain("/recipes/chef-p0-01");
    expect(page3Html).not.toContain("/recipes/chef-p0-01");
    expect(page2RequestUrl.searchParams.get("page")).toBe("1");
    expect(page3RequestUrl.searchParams.get("page")).toBe("2");
  });

  it.each(["0", "-1", "1.5", "abc", "", "9007199254740992"])(
    "T-03: page=%s는 공개 1페이지와 API 0페이지로 처리한다",
    async (page) => {
      const html = await renderInitialHtml({ page });
      const requestUrl = new URL(
        String((global.fetch as jest.Mock).mock.calls[0][0])
      );

      expect(html).toContain("/recipes/chef-p0-01");
      expect(requestUrl.searchParams.get("page")).toBe("0");
    }
  );

  it("T-03: page 배열은 첫 번째 값을 공개 페이지로 사용한다", async () => {
    const html = await renderInitialHtml({ page: ["2", "3"] });
    const requestUrl = new URL(
      String((global.fetch as jest.Mock).mock.calls[0][0])
    );

    expect(html).toContain("/recipes/chef-p1-01");
    expect(requestUrl.searchParams.get("page")).toBe("1");
  });

  it.each([
    ["ko", "/recipes/chef-p1-01", null],
    ["ja", "/ja/recipes/chef-p1-01", "ja"],
    ["en", "/en/recipes/chef-p1-01", "en"],
  ] as const)(
    "T-04: %s 공개 2페이지를 locale별 상세 링크와 언어로 SSR한다",
    async (locale, expectedHref, expectedLang) => {
      const html = await renderInitialHtml({ page: "2" }, locale);
      const hrefs = getRecipeHrefs(html);
      const requestUrl = new URL(
        String((global.fetch as jest.Mock).mock.calls[0][0])
      );

      expect(hrefs).toHaveLength(20);
      expect(new Set(hrefs).size).toBe(20);
      expect(hrefs).toContain(expectedHref);
      expect(requestUrl.searchParams.get("page")).toBe("1");
      expect(requestUrl.searchParams.get("lang")).toBe(expectedLang);
    }
  );

  it.each([
    [{}, [], ["/recipes/category/CHEF_RECIPE?page=2"]],
    [
      { page: "2" },
      ["/recipes/category/CHEF_RECIPE"],
      ["/recipes/category/CHEF_RECIPE?page=3"],
    ],
    [{ page: "3" }, ["/recipes/category/CHEF_RECIPE?page=2"], []],
  ] as const)(
    "T-06: 공개 페이지의 초기 HTML은 실제 이전·다음 페이지 링크를 정확히 노출한다",
    async (searchParams, expectedPrevious, expectedNext) => {
      const html = await renderInitialHtml(searchParams);

      expect(getPaginationHrefs(html, "prev")).toEqual(expectedPrevious);
      expect(getPaginationHrefs(html, "next")).toEqual(expectedNext);
    }
  );

  it.each(["0", "-1", "1.5", "abc", "", "9007199254740992"])(
    "T-07: page=%s의 초기 HTML은 공개 1페이지의 다음 링크만 노출한다",
    async (page) => {
      const html = await renderInitialHtml({ page });

      expect(getPaginationHrefs(html, "prev")).toEqual([]);
      expect(getPaginationHrefs(html, "next")).toEqual([
        "/recipes/category/CHEF_RECIPE?page=2",
      ]);
    }
  );

  it.each([
    [
      "ja",
      "/ja/recipes/category/CHEF_RECIPE",
      "/ja/recipes/category/CHEF_RECIPE?page=3",
    ],
    [
      "en",
      "/en/recipes/category/CHEF_RECIPE",
      "/en/recipes/category/CHEF_RECIPE?page=3",
    ],
  ] as const)(
    "T-08: %s 공개 2페이지의 이전·다음 링크는 locale prefix를 유지한다",
    async (locale, expectedPrevious, expectedNext) => {
      const html = await renderInitialHtml({ page: "2" }, locale);

      expect(getPaginationHrefs(html, "prev")).toEqual([expectedPrevious]);
      expect(getPaginationHrefs(html, "next")).toEqual([expectedNext]);
    }
  );
});

describe("category page href", () => {
  it.each([
    ["ko", 1, "/recipes/category/CHEF_RECIPE"],
    ["ko", 2, "/recipes/category/CHEF_RECIPE?page=2"],
    ["ja", 2, "/ja/recipes/category/CHEF_RECIPE?page=2"],
    ["en", 3, "/en/recipes/category/CHEF_RECIPE?page=3"],
  ] as const)(
    "T-04: %s 공개 %i페이지 href는 locale 경로와 사람 기준 번호를 유지한다",
    (locale, publicPage, expectedHref) => {
      expect(
        buildCategoryPageHref({
          tagCode: "CHEF_RECIPE",
          locale,
          publicPage,
        })
      ).toBe(expectedHref);
    }
  );
});
