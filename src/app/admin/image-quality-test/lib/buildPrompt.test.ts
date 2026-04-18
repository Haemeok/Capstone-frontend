import { buildPrompt } from "./buildPrompt";

describe("buildPrompt", () => {
  it("produces a concise English prompt from Korean recipe fields", () => {
    const prompt = buildPrompt({
      title: "김치찌개",
      description: "돼지고기와 묵은지로 끓인 얼큰한 국물 요리",
      mainIngredients: ["김치", "돼지고기", "두부"],
    });

    expect(prompt).toContain("Korean");
    expect(prompt).toContain("김치찌개");
    expect(prompt.toLowerCase()).toContain("food photography");
    expect(prompt.length).toBeGreaterThan(60);
    expect(prompt.length).toBeLessThan(400);
  });

  it("handles missing description gracefully", () => {
    const prompt = buildPrompt({ title: "제육볶음", mainIngredients: ["돼지고기"] });
    expect(prompt).toContain("제육볶음");
    expect(prompt).not.toContain("undefined");
  });

  it("caps ingredient list at 5 items to avoid prompt bloat", () => {
    const many = ["zzz1", "zzz2", "zzz3", "zzz4", "zzz5", "zzz6", "zzz7", "zzz8"];
    const prompt = buildPrompt({ title: "x", mainIngredients: many });
    expect(prompt).toContain("zzz5");
    expect(prompt).not.toContain("zzz6");
    expect(prompt).not.toContain("zzz7");
    expect(prompt).not.toContain("zzz8");
  });
});
