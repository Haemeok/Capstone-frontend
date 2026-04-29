import {
  buildSeasoningCombinedPrompt,
  buildSeasoningSinglePrompt,
  buildVegetableTrayPrompt,
} from "./buildSequencePrompts";

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

describe("buildSeasoningSinglePrompt", () => {
  it("renders a stainless bowl with a measuring spoon and the exact quantity", () => {
    const p = buildSeasoningSinglePrompt({
      name: "간장",
      quantity: "1",
      unit: "큰술",
    });
    expect(p).toContain("STAINLESS STEEL BOWL");
    expect(p).toContain("Korean soy sauce");
    expect(p).toContain("1 큰술");
    expect(p).toContain("SPOON visible from the front");
  });

  it("renders ground black pepper with a tiny amount when quantity is 약간", () => {
    const p = buildSeasoningSinglePrompt({
      name: "후추",
      quantity: "약간",
      unit: "",
    });
    expect(p).toContain("ground black pepper");
    expect(p).toContain("약간");
  });

  it("contains env lock and negatives", () => {
    const p = buildSeasoningSinglePrompt({
      name: "고추장",
      quantity: "2",
      unit: "큰술",
    });
    expect(p).toContain("[ENVIRONMENT LOCK");
    expect(p).toContain("--no text");
    expect(p).toContain("ABSOLUTE NO-TEXT RULE");
  });
});

describe("buildSeasoningCombinedPrompt", () => {
  it("renders multiple small dishes on a single tray with each seasoning labeled in English", () => {
    const p = buildSeasoningCombinedPrompt([
      { name: "후추", quantity: "1", unit: "꼬집" },
      { name: "깨", quantity: "1", unit: "작은술" },
      { name: "소금", quantity: "약간", unit: "" },
    ]);
    expect(p).toContain("SILVER STAINLESS STEEL TRAY");
    expect(p).toContain("multiple SMALL ceramic dishes");
    expect(p).toContain("ground black pepper");
    expect(p).toContain("toasted sesame seeds");
    expect(p).toContain("fine sea salt");
  });

  it("shows the quantity for each seasoning", () => {
    const p = buildSeasoningCombinedPrompt([
      { name: "후추", quantity: "1", unit: "꼬집" },
      { name: "깨", quantity: "1", unit: "작은술" },
    ]);
    expect(p).toContain("1꼬집");
    expect(p).toContain("1작은술");
  });
});
