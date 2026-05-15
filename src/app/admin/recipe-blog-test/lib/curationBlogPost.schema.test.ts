import { CurationBlogMetaSchema } from "./curationBlogPost.schema";

const validMeta = {
  title: {
    main: "환절기 식탁을 가볍게 — 한 그릇 든든한 국·찌개 모음 6선 가족 평일",
    sub: "환절기, 데우기만 해도 든든한 한국 가정의 국·찌개",
  },
  hashtags: [
    "#환절기식탁",
    "#한그릇",
    "#콩나물국",
    "#된장찌개",
    "#김치찌개",
    "#평일저녁",
    "#한식",
    "#집밥",
  ],
  captionForCover: "환절기 한 그릇, 세 가지.",
};

describe("CurationBlogMetaSchema", () => {
  it("정상 meta 를 통과한다", () => {
    expect(CurationBlogMetaSchema.safeParse(validMeta).success).toBe(true);
  });

  it("title.main 이 20자 미만이면 실패", () => {
    const bad = { ...validMeta, title: { ...validMeta.title, main: "짧다" } };
    expect(CurationBlogMetaSchema.safeParse(bad).success).toBe(false);
  });

  it("hashtags 가 7개면 실패 (min 8)", () => {
    const bad = { ...validMeta, hashtags: validMeta.hashtags.slice(0, 7) };
    expect(CurationBlogMetaSchema.safeParse(bad).success).toBe(false);
  });

  it("captionForCover 가 7자면 실패 (min 8)", () => {
    const bad = { ...validMeta, captionForCover: "짧은캡션" };
    expect(CurationBlogMetaSchema.safeParse(bad).success).toBe(false);
  });
});
