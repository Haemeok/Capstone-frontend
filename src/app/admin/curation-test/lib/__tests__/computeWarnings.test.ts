import { computeWarnings } from "../computeWarnings";

const mkMarkdown = (sections: string[]) =>
  `# 제목\n\n` +
  sections.map((body, i) => `## 섹션 ${i + 1}\n\n${body}`).join("\n\n");

const recipe = (ings: Array<{ id?: string; name: string }>) => ({
  ingredients: ings,
});

describe("computeWarnings", () => {
  it("q present in every section → no warnings", () => {
    const md = mkMarkdown([
      "삼겹살 굽는 법",
      "삼겹살과 어울리는 술",
      "삼겹살 양념",
      "삼겹살 곁들임",
      "삼겹살 결론",
    ]);
    const r = computeWarnings({
      markdown: md,
      params: { q: "삼겹살" },
      recipes: [],
      expectedSectionCount: 5,
    });
    expect(r).toEqual([]);
  });

  it("q missing in some sections → single warning with 0-based indices", () => {
    const md = mkMarkdown([
      "삼겹살 굽는 법",
      "다른 고기 이야기",
      "삼겹살 양념",
      "스테이크 한 점",
      "삼겹살 결론",
    ]);
    const r = computeWarnings({
      markdown: md,
      params: { q: "삼겹살" },
      recipes: [],
      expectedSectionCount: 5,
    });
    expect(r).toEqual([
      {
        kind: "missing-keyword",
        source: "q",
        keyword: "삼겹살",
        missingSections: [1, 3],
      },
    ]);
  });

  it("q matching is case-insensitive", () => {
    const md = mkMarkdown(["pasta day", "PASTA night", "pasta brunch"]);
    const r = computeWarnings({
      markdown: md,
      params: { q: "Pasta" },
      recipes: [],
      expectedSectionCount: 3,
    });
    expect(r).toEqual([]);
  });

  it("ingredientIds resolves via recipe.ingredients then checks sections", () => {
    const md = mkMarkdown([
      "오늘은 대파를 듬뿍",
      "양파만 잔뜩",
      "대파와 마늘",
      "버섯 위주",
      "대파 마무리",
    ]);
    const r = computeWarnings({
      markdown: md,
      params: { ingredientIds: "ID_DAEPA" },
      recipes: [
        recipe([
          { id: "ID_DAEPA", name: "대파" },
          { id: "ID_GARLIC", name: "마늘" },
        ]),
      ],
      expectedSectionCount: 5,
    });
    expect(r).toEqual([
      {
        kind: "missing-keyword",
        source: "ingredientIds",
        keyword: "대파",
        missingSections: [1, 3],
      },
    ]);
  });

  it("unresolved ingredientId → no warning, no throw", () => {
    const md = mkMarkdown(["a", "b", "c"]);
    const r = computeWarnings({
      markdown: md,
      params: { ingredientIds: "UNKNOWN" },
      recipes: [recipe([{ id: "ID_OTHER", name: "양파" }])],
      expectedSectionCount: 3,
    });
    expect(r).toEqual([]);
  });

  it("section count mismatch → returns empty (defensive)", () => {
    const md = mkMarkdown(["a", "b"]); // 2 sections
    const r = computeWarnings({
      markdown: md,
      params: { q: "missing" },
      recipes: [],
      expectedSectionCount: 5,
    });
    expect(r).toEqual([]);
  });

  it("no q and no ingredientIds → empty", () => {
    const md = mkMarkdown(["a", "b", "c"]);
    const r = computeWarnings({
      markdown: md,
      params: { tags: "x" },
      recipes: [],
      expectedSectionCount: 3,
    });
    expect(r).toEqual([]);
  });

  it("both q and ingredientIds emit independent warnings", () => {
    const md = mkMarkdown(["대파만", "고기만", "고기와 대파"]);
    const r = computeWarnings({
      markdown: md,
      params: { q: "삼겹살", ingredientIds: "ID_DAEPA" },
      recipes: [recipe([{ id: "ID_DAEPA", name: "대파" }])],
      expectedSectionCount: 3,
    });
    expect(r).toHaveLength(2);
    expect(r.find((w) => w.source === "q")?.missingSections).toEqual([0, 1, 2]);
    expect(
      r.find((w) => w.source === "ingredientIds")?.missingSections
    ).toEqual([1]);
  });
});
