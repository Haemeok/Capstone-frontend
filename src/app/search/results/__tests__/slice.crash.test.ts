/** @jest-environment node */
jest.mock("@/widgets/SearchClient", () => ({
  __esModule: true,
  SearchClient: () => null,
  SearchClientShell: ({ children }: { children?: unknown }) => children ?? null,
  SearchResultsGrid: () => null,
}));
jest.mock("@/widgets/SearchClient/server/SearchResultsData", () => ({
  __esModule: true,
  SearchResultsData: () => null,
}));
jest.mock("@/widgets/SearchClient/ui/SearchResultsSkeleton", () => ({
  __esModule: true,
  SearchGridSkeleton: () => null,
  SearchResultsSkeleton: () => null,
}));
jest.mock("@/entities/recipe/model/api.server", () => ({
  getRecipesOnServer: jest.fn().mockResolvedValue({
    content: [{ id: "r1", imageUrl: "https://x/i.jpg", title: "김치찌개" }],
    slice: { size: 10, number: 0, numberOfElements: 10, hasNext: true },
  }),
}));

import SearchResultsPage from "@/app/search/results/page";

const asProm = <T>(v: T) => Promise.resolve(v);

describe("SearchResultsPage — slice 응답 크래시 방지 (T-06)", () => {
  it("page 없는 slice 응답에서도 throw 없이 렌더된다", async () => {
    await expect(
      SearchResultsPage({ searchParams: asProm({ q: "김치찌개", page: "0" }) })
    ).resolves.toBeDefined();
  });
});
