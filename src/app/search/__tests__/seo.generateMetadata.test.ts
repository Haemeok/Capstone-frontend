import type { Metadata } from "next";
import { generateMetadata } from "@/app/search/page";

const asProm = <T>(v: T) => Promise.resolve(v);

describe("SearchPage generateMetadata", () => {
  it("쿼리가 있을 때: 검색어 기반 title/description을 반환한다", async () => {
    const params = {
      searchParams: asProm({ q: "김치찌개", sort: "DESC" }),
    } as any;
    const meta = (await generateMetadata(params)) as Metadata;

    expect(meta.title).toBe("김치찌개 검색 결과 - 해먹");
    expect(meta.description).toContain("김치찌개");
  });

  it("쿼리가 없을 때: 기본 title/description을 반환한다", async () => {
    const params = { searchParams: asProm({}) } as any;
    const meta = (await generateMetadata(params)) as Metadata;

    expect(meta.title).toBe("레시피 검색 - 해먹");
    expect(meta.description).toBe("원하는 레시피를 검색하고 찾아보세요.");
  });
});
