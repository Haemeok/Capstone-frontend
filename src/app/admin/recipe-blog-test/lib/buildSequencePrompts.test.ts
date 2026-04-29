import { buildVegetableTrayPrompt } from "./buildSequencePrompts";

describe("buildVegetableTrayPrompt", () => {
  it("includes the env lock block", () => {
    const p = buildVegetableTrayPrompt({
      name: "당근",
      quantity: "1",
      unit: "개",
    });
    expect(p).toContain("[ENVIRONMENT LOCK");
    expect(p).toContain("matte light-grey/white kitchen countertop");
    expect(p).toContain("5500K natural daylight");
  });

  it("includes the stainless tray subject and the translated ingredient name", () => {
    const p = buildVegetableTrayPrompt({
      name: "당근",
      quantity: "1",
      unit: "개",
    });
    expect(p).toContain("SILVER STAINLESS STEEL TRAY");
    expect(p).toContain("carrot");
    expect(p).toContain("1개");
  });

  it("includes the absolute no-text rule and negative prompts", () => {
    const p = buildVegetableTrayPrompt({
      name: "양파",
      quantity: "2",
      unit: "개",
    });
    expect(p).toContain("ABSOLUTE NO-TEXT RULE");
    expect(p).toContain("--no people");
    expect(p).toContain("--no text");
  });

  it("does not leak template placeholders", () => {
    const p = buildVegetableTrayPrompt({
      name: "양배추",
      quantity: "1/4",
      unit: "통",
    });
    expect(p).not.toMatch(/\{\{[A-Z_]+\}\}/);
    expect(p).not.toContain("undefined");
  });
});
