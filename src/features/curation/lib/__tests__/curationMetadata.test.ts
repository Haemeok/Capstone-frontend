// src/features/curation/lib/__tests__/curationMetadata.test.ts
import type { PublicCurationArticleDto } from "../../model/api.server";
import {
  generateCurationDetailMetadata,
  generateCurationListMetadata,
} from "../curationMetadata";

const baseDto: PublicCurationArticleDto = {
  id: "abc",
  slug: "summer-cucumber",
  title: "여름 오이 한 그릇",
  description: "수분 가득한 오이 모음",
  coverImageKey: "curation/summer-cucumber/cover.webp",
  contentMdx: "# ...",
  category: "DIET & LIGHT",
  publishedAt: "2026-05-04T10:00:00Z",
  recipeIds: ["a1", "a2"],
};

describe("generateCurationDetailMetadata", () => {
  it("title에 사이트 이름을 suffix로 붙이고 bracket prefix 없음", () => {
    const meta = generateCurationDetailMetadata(baseDto, 5);
    expect(meta.title).toBe("여름 오이 한 그릇 | 레시피오");
    expect(String(meta.title)).not.toMatch(/^\[/);
  });

  it("description이 있으면 그대로 살리고 추천 레시피 카운트를 덧붙임", () => {
    const meta = generateCurationDetailMetadata(baseDto, 7);
    expect(meta.description).toBe(
      "수분 가득한 오이 모음 추천 레시피 7가지를 한 페이지에 모았어요.",
    );
  });

  it("description이 없으면 카테고리 라벨 기반 fallback 문구 사용", () => {
    const meta = generateCurationDetailMetadata(
      { ...baseDto, description: null },
      4,
    );
    expect(meta.description).toContain("다이어트 & 가벼운 한 끼");
    expect(meta.description).toContain("4가지");
  });

  it("canonical이 슬러그 기반 절대경로", () => {
    const meta = generateCurationDetailMetadata(baseDto, 3);
    expect(meta.alternates?.canonical).toBe(
      "https://www.recipio.kr/curation/summer-cucumber",
    );
  });

  it("coverImageKey가 있으면 OG image로 사용, 없으면 default og.png로 fallback", () => {
    const withCover = generateCurationDetailMetadata(baseDto, 3);
    const ogWith = withCover.openGraph;
    expect(ogWith && "images" in ogWith && Array.isArray(ogWith.images) ? ogWith.images[0] : undefined).toMatchObject({
      url: expect.stringContaining("curation/summer-cucumber/cover.webp"),
    });

    const without = generateCurationDetailMetadata(
      { ...baseDto, coverImageKey: null },
      3,
    );
    const ogWithout = without.openGraph;
    expect(ogWithout && "images" in ogWithout && Array.isArray(ogWithout.images) ? ogWithout.images[0] : undefined).toMatchObject({
      url: "https://www.recipio.kr/og.png",
    });
  });
});

describe("generateCurationListMetadata", () => {
  it("카테고리 없음이면 default 매거진 metadata", () => {
    const meta = generateCurationListMetadata(null);
    expect(meta.title).toContain("큐레이션 매거진");
    expect(meta.alternates?.canonical).toBe("https://www.recipio.kr/curation");
  });

  it("화이트리스트 밖 카테고리면 default로 fallback", () => {
    const meta = generateCurationListMetadata("UNKNOWN");
    expect(meta.title).toContain("큐레이션 매거진");
    expect(meta.alternates?.canonical).toBe("https://www.recipio.kr/curation");
  });

  it("유효 카테고리는 한글 라벨/canonical 분기", () => {
    const meta = generateCurationListMetadata("DIET & LIGHT");
    expect(meta.title).toBe("다이어트 & 가벼운 한 끼 큐레이션 | 레시피오");
    expect(meta.alternates?.canonical).toBe(
      `https://www.recipio.kr/curation?category=${encodeURIComponent("DIET & LIGHT")}`,
    );
    expect(meta.keywords).toEqual(expect.arrayContaining(["다이어트 레시피"]));
  });
});
