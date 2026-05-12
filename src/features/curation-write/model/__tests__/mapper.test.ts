import type { GenerateCurationOutput } from "@/entities/curation";

import { mapResultToRequest } from "../mapper";

const baseResult: GenerateCurationOutput = {
  slug: "summer-cucumber",
  h1: "여름 오이 한 그릇",
  dek: "수분 가득한 오이 모음",
  markdown: "# 본문\n\n...",
  recipeIds: ["a1b2c3", "d4e5f6"],
  toneSeed: "editorial",
  thumbnailUrl: "https://cdn.example/recipes/x.webp",
  provider: "solar-pro-3+grok-4-1-fast",
  category: "DIET & LIGHT",
  coverImageKey: "recipes/abc/img.webp",
  warnings: [],
};

describe("mapResultToRequest", () => {
  it("필드들을 그대로 백엔드 contract에 매핑한다", () => {
    const body = mapResultToRequest(baseResult);
    expect(body).toEqual({
      slug: "summer-cucumber",
      title: "여름 오이 한 그릇",
      description: "수분 가득한 오이 모음",
      coverImageKey: "recipes/abc/img.webp",
      contentMdx: "# 본문\n\n...",
      category: "DIET & LIGHT",
      generatedBy: "solar-pro-3+grok-4-1-fast",
      recipeIds: ["a1b2c3", "d4e5f6"],
    });
  });

  it("dek이 빈 문자열이면 description은 null", () => {
    const body = mapResultToRequest({ ...baseResult, dek: "" });
    expect(body.description).toBeNull();
  });

  it("coverImageKey가 null이면 그대로 null 전달", () => {
    const body = mapResultToRequest({ ...baseResult, coverImageKey: null });
    expect(body.coverImageKey).toBeNull();
  });
});
