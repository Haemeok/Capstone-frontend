/** @jest-environment node */

jest.mock("@/widgets/SearchClient", () => ({
  __esModule: true,
  SearchClient: () => null,
}));

import { generateMetadata } from "@/app/search/page";

function asProm<T>(v: T) {
  return Promise.resolve(v);
}

type Props = Parameters<typeof generateMetadata>[0];

describe("SearchPage generateMetadata", () => {
  it("쿼리가 있을 때: 검색어 기반 title/description을 반환한다", async () => {
    const params: Props = {
      searchParams: asProm({ q: "김치찌개", sort: "DESC" }),
    };
    const meta = await generateMetadata(params);

    expect(meta.title).toBe("김치찌개 검색 결과 - 해먹");
    expect(meta.description).toContain("김치찌개");
  });

  it("쿼리가 없을 때: 기본 title/description을 반환한다", async () => {
    const params: Props = { searchParams: asProm({}) };
    const meta = await generateMetadata(params);

    expect(meta.title).toBe("레시피 검색 - 해먹");
    expect(meta.description).toBe("원하는 레시피를 검색하고 찾아보세요.");
  });
});
