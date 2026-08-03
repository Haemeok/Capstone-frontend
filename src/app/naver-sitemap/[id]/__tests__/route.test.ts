/**
 * @jest-environment node
 */
import { fetchNaverRecipeSitemapPage } from "@/entities/recipe/model/api.server";

import { GET } from "../route";

jest.mock("@/entities/recipe/model/api.server", () => ({
  fetchNaverRecipeSitemapPage: jest.fn(),
}));

const fetchMock = fetchNaverRecipeSitemapPage as jest.Mock;

const request = new Request("https://www.recipio.kr/naver-sitemap/0.xml");
const call = (id: string) => GET(request, { params: Promise.resolve({ id }) });

describe("naver-sitemap/[id].xml (청크)", () => {
  beforeEach(() => fetchMock.mockReset());

  it("ko 로케일 프리픽스 없이 /recipes/{id} 절대 URL을 낸다", async () => {
    fetchMock.mockResolvedValue([
      { id: "doJQ87eO", updatedAt: "2026-06-17T18:49:38" },
    ]);

    const xml = await (await call("0.xml")).text();

    expect(xml).toContain("<loc>https://www.recipio.kr/recipes/doJQ87eO</loc>");
    expect(xml).toContain(
      `<lastmod>${new Date("2026-06-17T18:49:38").toISOString()}</lastmod>`
    );
    expect(xml).not.toContain("/ja/");
    expect(xml).not.toContain("/en/");
    expect(xml).not.toContain("hreflang");
  });

  it("요청한 청크 번호를 백엔드 page로 넘긴다", async () => {
    fetchMock.mockResolvedValue([]);

    await call("3.xml");

    expect(fetchMock).toHaveBeenCalledWith(3, 20000);
  });

  it("updatedAt이 파싱 불가면 lastmod를 생략한다", async () => {
    fetchMock.mockResolvedValue([{ id: "abc", updatedAt: "not-a-date" }]);

    const xml = await (await call("0.xml")).text();

    expect(xml).toContain("<loc>https://www.recipio.kr/recipes/abc</loc>");
    expect(xml).not.toContain("<lastmod>");
  });

  it.each(["abc.xml", "0", "-1.xml", "999.xml"])(
    "잘못된 청크 id(%s)는 404다",
    async (id) => {
      const res = await call(id);

      expect(res.status).toBe(404);
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );
});
