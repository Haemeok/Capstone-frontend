/**
 * @jest-environment node
 */
import { fetchNaverRecipeSitemapPage } from "@/entities/recipe/model/api.server";

import { GET } from "../route";

jest.mock("@/entities/recipe/model/api.server", () => ({
  fetchNaverRecipeSitemapPage: jest.fn(),
}));

const fetchMock = fetchNaverRecipeSitemapPage as jest.Mock;

const CHUNK_SIZE = 20000;
const fullPage = () =>
  Array.from({ length: CHUNK_SIZE }, (_, i) => ({
    id: `id-${i}`,
    updatedAt: "2026-06-17T18:49:38",
  }));

describe("naver-sitemap.xml (사이트맵 인덱스)", () => {
  beforeEach(() => fetchMock.mockReset());

  it("청크가 채워진 만큼만 인덱스에 나열한다", async () => {
    fetchMock.mockImplementation((page: number) => {
      if (page < 2) return Promise.resolve(fullPage());
      if (page === 2)
        return Promise.resolve([{ id: "tail", updatedAt: "2026-06-17" }]);
      return Promise.resolve([]);
    });

    const xml = await (await GET()).text();

    expect(xml).toContain("<sitemapindex");
    expect(xml).toContain(
      "<loc>https://www.recipio.kr/naver-sitemap/0.xml</loc>"
    );
    expect(xml).toContain(
      "<loc>https://www.recipio.kr/naver-sitemap/2.xml</loc>"
    );
    expect(xml).not.toContain("naver-sitemap/3.xml");
  });

  it("결과가 비면 빈 인덱스를 낸다", async () => {
    fetchMock.mockResolvedValue([]);

    const res = await GET();
    const xml = await res.text();

    expect(res.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8"
    );
    expect(xml).toContain("</sitemapindex>");
    expect(xml).not.toContain("<loc>");
  });
});
