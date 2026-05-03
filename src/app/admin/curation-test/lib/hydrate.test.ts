import { hydrateMarkdown, type HydratableRecipe } from "./hydrate";

const recipes: HydratableRecipe[] = [
  {
    id: "abc",
    title: "콩나물국",
    imageUrl: "https://cdn/img/abc.jpg",
    youtubeUrl: "https://youtu.be/yyy",
  },
  {
    id: "def",
    title: "김치찌개",
    imageUrl: "https://cdn/img/def.jpg",
    youtubeUrl: "https://youtu.be/zzz",
  },
];

describe("hydrateMarkdown", () => {
  it("img 슬롯을 마크다운 이미지로 치환", () => {
    const out = hydrateMarkdown("아침엔 {{img:0}}", recipes);
    expect(out).toContain("![콩나물국](https://cdn/img/abc.jpg)");
  });

  it("recipe 슬롯을 내부 라우트 링크로 치환", () => {
    const out = hydrateMarkdown("추천 {{recipe:1}}", recipes);
    expect(out).toContain("[김치찌개 →](/recipes/def)");
  });

  it("yt 슬롯을 평범한 마크다운 링크로 치환", () => {
    const out = hydrateMarkdown("영상 {{yt:0}}", recipes);
    expect(out).toContain("[▶ 콩나물국 영상 보기](https://youtu.be/yyy)");
  });

  it("동일 마크다운 안에 여러 슬롯이 섞여도 모두 치환", () => {
    const out = hydrateMarkdown("{{img:0}} {{recipe:0}} {{yt:0}}", recipes);
    expect(out).not.toMatch(/\{\{/);
  });
});
