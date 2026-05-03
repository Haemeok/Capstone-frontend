import { validateMarkdown } from "./validate";

const goodMd = (n: number) =>
  `인트로 한 문단입니다.\n\n${Array.from({ length: n })
    .map(
      (_, i) =>
        `## 레시피 ${i}\n\n{{img:${i}}}\n\n본문 한 문단. 이 레시피 추천 {{recipe:${i}}}\n\n{{yt:${i}}}`,
    )
    .join("\n\n")}\n\n결말입니다.`.padEnd(900, " ");

describe("validateMarkdown", () => {
  it("모든 슬롯이 정확히 1회씩 박혀있고 H2가 N개면 통과", () => {
    const result = validateMarkdown(goodMd(3), 3);
    expect(result.ok).toBe(true);
  });

  it("img 슬롯이 누락되면 실패", () => {
    const md = goodMd(3).replace("{{img:1}}", "");
    const result = validateMarkdown(md, 3);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/img:1/);
  });

  it("yt 슬롯이 중복되면 실패", () => {
    const md = goodMd(3).replace("{{yt:0}}", "{{yt:0}} {{yt:0}}");
    const result = validateMarkdown(md, 3);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/yt:0/);
  });

  it("recipe 슬롯이 정의되지 않은 인덱스를 쓰면 실패", () => {
    const md = goodMd(3) + "\n{{recipe:5}}";
    const result = validateMarkdown(md, 3);
    expect(result.ok).toBe(false);
  });

  it("알 수 없는 슬롯 키가 있으면 실패", () => {
    const md = goodMd(3) + "\n{{video:0}}";
    const result = validateMarkdown(md, 3);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/video/);
  });

  it("H1이 본문에 등장하면 실패", () => {
    const md = "# 제목\n\n" + goodMd(3);
    const result = validateMarkdown(md, 3);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/H1/);
  });

  it("H2 개수가 N과 다르면 실패", () => {
    const md = goodMd(3) + "\n\n## 추가 섹션";
    const result = validateMarkdown(md, 3);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/H2/);
  });

  it("길이가 800자 미만이면 실패", () => {
    const result = validateMarkdown("짧은 글", 1);
    expect(result.ok).toBe(false);
  });
});
