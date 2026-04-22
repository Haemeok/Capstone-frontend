import { getModelById,MODELS } from "./models";

describe("MODELS registry", () => {
  it("has exactly 11 entries", () => {
    expect(MODELS).toHaveLength(11);
  });

  it("has unique ids", () => {
    const ids = MODELS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all entries have valid provider, positive price, and non-empty endpoint", () => {
    for (const m of MODELS) {
      expect(["openai", "google", "fal"]).toContain(m.provider);
      expect(m.pricePerImage).toBeGreaterThan(0);
      expect(m.pricePerImage).toBeLessThan(0.25);
      expect(m.endpoint.length).toBeGreaterThan(0);
    }
  });

  it("getModelById returns the correct entry or undefined", () => {
    expect(getModelById("seedream-v4")?.label).toContain("Seedream");
    expect(getModelById("nonexistent")).toBeUndefined();
  });
});
