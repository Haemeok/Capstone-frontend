import { getModelById,MODELS } from "./models";

describe("MODELS registry", () => {
  it("has exactly 9 entries", () => {
    expect(MODELS).toHaveLength(9);
  });

  it("has unique ids", () => {
    const ids = MODELS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all entries have valid provider and positive price below Gemini baseline", () => {
    for (const m of MODELS) {
      expect(["openai", "google", "fal"]).toContain(m.provider);
      expect(m.pricePerImage).toBeGreaterThan(0);
      expect(m.pricePerImage).toBeLessThan(0.039);
      expect(m.endpoint.length).toBeGreaterThan(0);
    }
  });

  it("getModelById returns the correct entry or undefined", () => {
    expect(getModelById("seedream-v4")?.label).toContain("Seedream");
    expect(getModelById("nonexistent")).toBeUndefined();
  });
});
