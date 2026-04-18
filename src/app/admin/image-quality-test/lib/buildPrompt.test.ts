import { buildPrompt } from "./buildPrompt";

describe("buildPrompt (default template)", () => {
  it("includes title, dish type, ingredients, and steps", () => {
    const prompt = buildPrompt({
      title: "김치찌개",
      description: "돼지고기와 묵은지로 끓인 얼큰한 국물",
      dishType: "Soup",
      ingredients: [{ name: "김치" }, { name: "돼지고기" }, { name: "두부" }],
      steps: [
        { stepNumber: 1, action: "Boil", instruction: "Boil water" },
        { stepNumber: 2, action: "Add", instruction: "Add kimchi" },
      ],
    });

    expect(prompt).toContain("김치찌개");
    expect(prompt).toContain("Category: Soup");
    expect(prompt).toContain("김치, 돼지고기, 두부");
    expect(prompt).toContain("Step 1 (Boil): Boil water");
    expect(prompt).toContain("Step 2 (Add): Add kimchi");
    expect(prompt).toContain("ABSOLUTE NO-TEXT RULE");
    expect(prompt).toContain("--no text");
  });

  it("falls back to title when ingredients are empty", () => {
    const prompt = buildPrompt({ title: "제육볶음" });
    expect(prompt).toContain("**Key Ingredients:** 제육볶음.");
    expect(prompt).toContain("Cook seamlessly.");
  });

  it("translates Korean staple ingredient names to English hints", () => {
    const prompt = buildPrompt({
      title: "떡순",
      ingredients: [{ name: "매생이" }, { name: "순대" }, { name: "떡볶이 떡" }],
    });
    expect(prompt).toContain("fine silky green seaweed (Maesaengi)");
    expect(prompt).toContain("Korean blood sausage (Sundae)");
    expect(prompt).toContain("chewy rice cakes");
  });

  it("sorts steps by stepNumber even if passed out of order", () => {
    const prompt = buildPrompt({
      title: "x",
      steps: [
        { stepNumber: 3, action: "Plate", instruction: "Plate it" },
        { stepNumber: 1, action: "Prep", instruction: "Prep it" },
        { stepNumber: 2, action: "Cook", instruction: "Cook it" },
      ],
    });
    const step1Idx = prompt.indexOf("Step 1 (Prep)");
    const step2Idx = prompt.indexOf("Step 2 (Cook)");
    const step3Idx = prompt.indexOf("Step 3 (Plate)");
    expect(step1Idx).toBeGreaterThan(0);
    expect(step2Idx).toBeGreaterThan(step1Idx);
    expect(step3Idx).toBeGreaterThan(step2Idx);
  });

  it("picks one of the defined angle/lighting/background options", () => {
    const prompt = buildPrompt({ title: "x" });
    expect(prompt).toMatch(/\*\*Angle:\*\* (High-angle POV|Casual top-down|Slightly tilted|Hand-held)/);
    expect(prompt).toMatch(/\*\*Lighting:\*\* (Natural morning|Warm cozy|Slightly direct|Soft afternoon)/);
    expect(prompt).toMatch(/\*\*Background:\*\* (Clean white marble|Warm light beige|Rustic dark|Bright white)/);
  });

  it("does not leak template placeholders into the output", () => {
    const prompt = buildPrompt({ title: "x" });
    expect(prompt).not.toMatch(/\{\{[A-Z_]+\}\}/);
    expect(prompt).not.toContain("undefined");
  });
});

describe("buildPrompt (fine dining branch)", () => {
  it("uses the fine dining template when fineDiningInfo is present", () => {
    const prompt = buildPrompt({
      title: "Truffle Risotto",
      description: "Umami-forward risotto with shaved truffle",
      fineDiningInfo: {
        plating: { vessel: "Handmade ceramic bowl", guide: "Stack risotto, top with truffle" },
        components: [
          { role: "Main", name: "Risotto", description: "Creamy" },
          { role: "Garnish", name: "Truffle", description: "Shaved" },
        ],
      },
    });

    expect(prompt).toContain("Michelin star style plating");
    expect(prompt).toContain("Title: Truffle Risotto");
    expect(prompt).toContain("Vessel Type: Handmade ceramic bowl");
    expect(prompt).toContain("Plating Instructions: Stack risotto, top with truffle");
    expect(prompt).toContain("Main: Risotto: Creamy");
    expect(prompt).toContain("Garnish: Truffle: Shaved");
    expect(prompt).not.toContain("ABSOLUTE NO-TEXT RULE"); // default template only
  });

  it("falls back to default vessel wording when plating.vessel is missing", () => {
    const prompt = buildPrompt({
      title: "x",
      fineDiningInfo: { plating: {} },
    });
    expect(prompt).toContain("Vessel Type: Elegant plate");
  });
});
