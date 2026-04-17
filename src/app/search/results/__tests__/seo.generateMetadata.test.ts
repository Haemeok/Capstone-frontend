/** @jest-environment node */

jest.mock("@/widgets/SearchClient", () => ({
  __esModule: true,
  SearchClient: () => null,
}));

jest.mock("@/entities/recipe/model/api.server", () => ({
  getRecipesOnServer: jest.fn().mockResolvedValue({
    content: [
      { imageUrl: "https://example.com/image.jpg", title: "김치찌개" },
    ],
    page: { size: 10, number: 0, totalElements: 150, totalPages: 15 },
  }),
}));

import {
  buildSearchDescription,
  buildSearchTitle,
} from "@/entities/recipe/lib/metadata/searchMeta";

import { generateMetadata } from "@/app/search/results/page";

function asProm<T>(v: T) {
  return Promise.resolve(v);
}

type Props = Parameters<typeof generateMetadata>[0];

describe("SearchResultsPage generateMetadata", () => {
  it("쿼리가 있을 때: 검색어 + 결과 수 기반 title/description을 반환한다", async () => {
    const params: Props = {
      searchParams: asProm({ q: "김치찌개", sort: "DESC" }),
    };
    const meta = await generateMetadata(params);

    expect(meta.title).toBe(buildSearchTitle("김치찌개", 150, 0));
    expect(meta.description).toBe(buildSearchDescription("김치찌개", 150));
  });

  it("쿼리가 없을 때: 필터 적용 기본 title/description을 반환한다", async () => {
    const params: Props = { searchParams: asProm({}) };
    const meta = await generateMetadata(params);

    expect(meta.title).toBe(buildSearchTitle("", 150, 0));
    expect(meta.description).toBe(buildSearchDescription("", 150));
  });

  it("OG image로 첫 번째 검색 결과 이미지를 사용한다", async () => {
    const params: Props = {
      searchParams: asProm({ q: "김치찌개" }),
    };
    const meta = await generateMetadata(params);

    const ogImages = (meta.openGraph as any)?.images;
    expect(ogImages?.[0]?.url).toBe("https://example.com/image.jpg");
  });
});
