/** @jest-environment node */

jest.mock("@/widgets/SearchClient", () => ({
  __esModule: true,
  SearchClient: () => null,
}));

jest.mock("@/entities/recipe/model/api.server", () => ({
  getRecipesOnServer: jest.fn().mockResolvedValue({
    content: [{ imageUrl: "https://example.com/image.jpg", title: "김치찌개" }],
    slice: { size: 10, number: 0, numberOfElements: 10, hasNext: true },
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
  it("쿼리가 있을 때: 검색어 기반 title/description을 반환한다", async () => {
    const params: Props = {
      searchParams: asProm({ q: "김치찌개", sort: "DESC" }),
    };
    const meta = await generateMetadata(params);

    expect(meta.title).toBe(buildSearchTitle("김치찌개", 0, "ko"));
    expect(meta.description).toBe(buildSearchDescription("김치찌개", "ko"));
  });

  it("쿼리가 없을 때: 필터 적용 기본 title/description을 반환한다", async () => {
    const params: Props = { searchParams: asProm({}) };
    const meta = await generateMetadata(params);

    expect(meta.title).toBe(buildSearchTitle("", 0, "ko"));
    expect(meta.description).toBe(buildSearchDescription("", "ko"));
  });

  it("OG image로 첫 번째 검색 결과 이미지를 사용한다", async () => {
    const params: Props = {
      searchParams: asProm({ q: "김치찌개" }),
    };
    const meta = await generateMetadata(params);

    // narrow Next OpenGraph union to the image shape under test
    const ogImages = (meta.openGraph as { images?: { url?: string }[] })
      ?.images;
    expect(ogImages?.[0]?.url).toBe("https://example.com/image.jpg");
  });
});
