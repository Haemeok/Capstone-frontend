import { CURATION_CATEGORIES, isCurationCategory } from "../categories";

describe("CURATION_CATEGORIES", () => {
  it("9개 카테고리를 가지며 폴백 'FOOD & LIFE'를 포함한다", () => {
    expect(CURATION_CATEGORIES).toHaveLength(9);
    expect(CURATION_CATEGORIES).toContain("FOOD & LIFE");
  });

  it("isCurationCategory는 enum 멤버만 true", () => {
    expect(isCurationCategory("DIET & LIGHT")).toBe(true);
    expect(isCurationCategory("FOOD & LIFE")).toBe(true);
    expect(isCurationCategory("RANDOM")).toBe(false);
    expect(isCurationCategory(null)).toBe(false);
    expect(isCurationCategory(undefined)).toBe(false);
  });
});
