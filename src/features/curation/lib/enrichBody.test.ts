import { enrichBodyMarkdown } from "./enrichBody";

const baseBody = `인트로 한 단락.

## 첫 레시피 제목

본문 단락. 추천 [요리-a →](/recipes/a)

[▶ 영상](https://youtu.be/aaa)

## 둘째 레시피 제목

본문. [요리-b →](/recipes/b)

[▶ 영상](https://youtu.be/bbb)

## 셋째 레시피 제목

본문 셋째.

결말 단락.`;

describe("enrichBodyMarkdown", () => {
  it("각 H2 직후에 ingredients/steps 슬롯 라인 삽입 (인덱스 순서대로)", () => {
    const out = enrichBodyMarkdown(baseBody);
    expect(out).toContain("[ingredients](recipe-data:ingredients/0)");
    expect(out).toContain("[steps](recipe-data:steps/0)");
    expect(out).toContain("[ingredients](recipe-data:ingredients/1)");
    expect(out).toContain("[steps](recipe-data:steps/2)");
  });

  it("매 2개 H2마다 광고 슬롯 1개 (H2 셋이면 광고 1개)", () => {
    const out = enrichBodyMarkdown(baseBody);
    const adMatches = out.match(/\[ad\]\(in-article-ad\)/g) ?? [];
    expect(adMatches.length).toBe(1);
  });

  it("H2가 없으면 변경 없음", () => {
    const md = "단락 1.\n\n단락 2.";
    expect(enrichBodyMarkdown(md)).toBe(md);
  });

  it("H2가 4개면 광고 2개", () => {
    const md = ["인트로.", "## A", "x", "## B", "x", "## C", "x", "## D", "x"].join("\n\n");
    const out = enrichBodyMarkdown(md);
    const adMatches = out.match(/\[ad\]\(in-article-ad\)/g) ?? [];
    expect(adMatches.length).toBe(2);
  });
});
