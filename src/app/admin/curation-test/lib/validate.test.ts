import { validateMarkdown } from "./validate";

const goodMd = (n: number) => {
  const refs = Array.from({ length: n })
    .map((_, i) => `{{ref:${i}}}`)
    .join(", ");
  return `인트로 한 문단입니다.\n\n${Array.from({ length: n })
    .map(
      (_, i) =>
        `## 레시피 ${i}\n\n{{img:${i}}}\n\n본문 한 문단. 이 레시피 추천 {{recipe:${i}}}\n\n{{yt:${i}}}`,
    )
    .join("\n\n")}\n\n## 어떻게 고를까\n${refs}\n\n결말입니다.`.padEnd(900, " ");
};

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

  it("H2 개수가 N보다 적으면 실패", () => {
    // goodMd(3)은 H2 4개(레시피 3개 + 어떻게 고를까). 2개를 일반 텍스트로 빼서 2개로 만듬 (< 3)
    const md = goodMd(3)
      .replace("## 레시피 1", "레시피 1")
      .replace("## 레시피 2", "레시피 2");
    const result = validateMarkdown(md, 3);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/H2/);
  });

  it("길이가 800자 미만이면 실패", () => {
    const result = validateMarkdown("짧은 글", 1);
    expect(result.ok).toBe(false);
  });
});

describe("validateMarkdown - ref 슬롯", () => {
  // 본문 length가 검증을 통과하기 위한 dummy filler (1500+ 자)
  const padding = "본문 단락. ".repeat(150); // ~1800자

  const buildBody = (n: number, refs: string[]): string => {
    let s = padding + "\n\n";
    for (let i = 0; i < n; i++) {
      s += `## 섹션${i}\n{{yt:${i}}}\n본문\n{{recipe:${i}}}\n{{img:${i}}}\n\n`;
    }
    s += `## 어떻게 고를까\n${refs.join(", ")}\n`;
    return s;
  };

  it("ref:N 모든 인덱스 1회+ 등장하면 ok", () => {
    const md = buildBody(3, ["{{ref:0}}", "{{ref:1}}", "{{ref:2}}"]);
    const r = validateMarkdown(md, 3);
    expect(r.ok).toBe(true);
  });

  it("ref 인덱스 하나라도 누락이면 에러", () => {
    const md = buildBody(3, ["{{ref:0}}", "{{ref:2}}"]);
    const r = validateMarkdown(md, 3);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.some((e) => e.includes("ref:1"))).toBe(true);
    }
  });

  it("ref:N이 같은 인덱스 여러 번 등장해도 통과 (1회+ 허용)", () => {
    const md = buildBody(2, [
      "{{ref:0}}",
      "{{ref:0}}",
      "{{ref:0}}",
      "{{ref:1}}",
    ]);
    const r = validateMarkdown(md, 2);
    expect(r.ok).toBe(true);
  });
});

describe("validateMarkdown - 길이 cap", () => {
  it("6500자까지 허용", () => {
    const filler = "가".repeat(6300);
    const md = `${filler}\n## h\n{{yt:0}}\n{{recipe:0}}\n{{img:0}}\n## 어떻게 고를까\n{{ref:0}}`;
    const r = validateMarkdown(md, 1);
    if (!r.ok) {
      expect(r.errors.some((e) => e.includes("최대"))).toBe(false);
    }
  });

  it("6500자 초과는 에러", () => {
    const md = "가".repeat(7000);
    const r = validateMarkdown(md, 1);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.some((e) => e.includes("최대 6500"))).toBe(true);
    }
  });
});
