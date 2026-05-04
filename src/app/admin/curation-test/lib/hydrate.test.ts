import { type HydratableRecipe,hydrateMarkdown } from "./hydrate";

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

describe("hydrateMarkdown - {{ref:N}} 치환", () => {
  const baseRecipes: HydratableRecipe[] = [
    {
      id: "r1",
      title: "오이냉국",
      imageUrl: "https://cdn/r1.webp",
      youtubeUrl: "https://yt/r1",
      youtubeChannelName: "백종원",
    },
    {
      id: "r2",
      title: "오이김밥",
      imageUrl: "https://cdn/r2.webp",
      youtubeUrl: "https://yt/r2",
      youtubeChannelName: "삼시세끼",
    },
    {
      id: "r3",
      title: "오이무침",
      imageUrl: "https://cdn/r3.webp",
      youtubeUrl: "https://yt/r3",
      // 채널명 없음
    },
  ];

  it("{{ref:N}} → [채널 · 제목](#recipe-N) 마크다운 링크로 치환", () => {
    const md = "참고: {{ref:0}} 또는 {{ref:1}} 추천";
    const out = hydrateMarkdown(md, baseRecipes);
    expect(out).toContain("[백종원 · 오이냉국](#recipe-0)");
    expect(out).toContain("[삼시세끼 · 오이김밥](#recipe-1)");
  });

  it("youtubeChannelName이 없으면 제목만 라벨로", () => {
    const md = "{{ref:2}} 도 좋아요";
    const out = hydrateMarkdown(md, baseRecipes);
    expect(out).toContain("[오이무침](#recipe-2)");
  });

  it("범위 밖 인덱스는 빈 문자열로 치환 (graceful)", () => {
    const md = "{{ref:99}}";
    const out = hydrateMarkdown(md, baseRecipes);
    expect(out).not.toContain("{{ref:99}}");
  });

  it("같은 ref 여러 번 나와도 모두 치환", () => {
    const md = "{{ref:0}} 와 {{ref:0}}";
    const out = hydrateMarkdown(md, baseRecipes);
    const matches = out.match(/\[백종원 · 오이냉국\]\(#recipe-0\)/g);
    expect(matches?.length).toBe(2);
  });
});
