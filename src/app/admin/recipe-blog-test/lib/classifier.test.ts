import { classifyIngredient } from "./classifier";

const make = (
  over: Partial<{ name: string; quantity: string; unit: string }>
) => ({
  id: "x",
  name: over.name ?? "재료",
  quantity: over.quantity,
  unit: over.unit ?? "",
  inFridge: false,
  calories: 0,
});

describe("classifyIngredient", () => {
  it("classifies common vegetables", () => {
    expect(classifyIngredient(make({ name: "양파", unit: "개" }))).toBe(
      "vegetable"
    );
    expect(classifyIngredient(make({ name: "당근", unit: "개" }))).toBe(
      "vegetable"
    );
    expect(classifyIngredient(make({ name: "대파", unit: "대" }))).toBe(
      "vegetable"
    );
    expect(classifyIngredient(make({ name: "버섯", unit: "g" }))).toBe(
      "vegetable"
    );
  });

  it("classifies common proteins as meat", () => {
    expect(classifyIngredient(make({ name: "돼지고기", unit: "g" }))).toBe(
      "meat"
    );
    expect(classifyIngredient(make({ name: "소고기", unit: "g" }))).toBe(
      "meat"
    );
    expect(classifyIngredient(make({ name: "닭가슴살", unit: "g" }))).toBe(
      "meat"
    );
    expect(classifyIngredient(make({ name: "두부", unit: "모" }))).toBe("meat");
    expect(classifyIngredient(make({ name: "오징어", unit: "마리" }))).toBe(
      "meat"
    );
    expect(classifyIngredient(make({ name: "계란", unit: "개" }))).toBe("meat");
  });

  it("classifies main seasonings (volume >= 1 spoon-equivalent)", () => {
    expect(
      classifyIngredient(make({ name: "간장", quantity: "2", unit: "큰술" }))
    ).toBe("seasoning_main");
    expect(
      classifyIngredient(make({ name: "고추장", quantity: "1", unit: "큰술" }))
    ).toBe("seasoning_main");
    expect(
      classifyIngredient(make({ name: "참기름", quantity: "1", unit: "큰술" }))
    ).toBe("seasoning_main");
  });

  it("classifies minor seasonings (small amount or known minor)", () => {
    expect(
      classifyIngredient(make({ name: "후추", quantity: "1", unit: "꼬집" }))
    ).toBe("seasoning_minor");
    expect(
      classifyIngredient(make({ name: "소금", quantity: "약간", unit: "" }))
    ).toBe("seasoning_minor");
    expect(
      classifyIngredient(make({ name: "깨", quantity: "1", unit: "작은술" }))
    ).toBe("seasoning_minor");
    expect(
      classifyIngredient(make({ name: "설탕", quantity: "1", unit: "작은술" }))
    ).toBe("seasoning_minor");
  });

  it("treats borderline seasoning by quantity threshold", () => {
    expect(
      classifyIngredient(make({ name: "간장", quantity: "1", unit: "작은술" }))
    ).toBe("seasoning_minor");
    expect(
      classifyIngredient(make({ name: "참기름", quantity: "약간", unit: "" }))
    ).toBe("seasoning_minor");
  });

  it("returns 'other' for unclassifiable items", () => {
    expect(
      classifyIngredient(make({ name: "물", quantity: "200", unit: "ml" }))
    ).toBe("other");
    expect(
      classifyIngredient(make({ name: "정체불명재료", unit: "" }))
    ).toBe("other");
  });
});
