import { getCookingMethodIcon } from "../cookingMethodIcon";

describe("getCookingMethodIcon", () => {
  it("returns exact match icon", () => {
    expect(getCookingMethodIcon("구이")).toBe("🔥");
    expect(getCookingMethodIcon("볶음")).toBe("🍳");
    expect(getCookingMethodIcon("찜")).toBe("🥘");
  });

  it("falls back to keyword inclusion match", () => {
    expect(getCookingMethodIcon("버터구이")).toBe("🔥");
    expect(getCookingMethodIcon("야채볶음")).toBe("🍳");
  });

  it("trims whitespace before matching", () => {
    expect(getCookingMethodIcon("  구이  ")).toBe("🔥");
  });

  it("returns null for unknown methods", () => {
    expect(getCookingMethodIcon("알수없는조리법")).toBeNull();
  });

  it("returns null for empty input", () => {
    expect(getCookingMethodIcon("")).toBeNull();
    expect(getCookingMethodIcon("   ")).toBeNull();
  });
});
