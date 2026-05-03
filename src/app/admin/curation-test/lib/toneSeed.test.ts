import { pickToneBySlug } from "./toneSeed";

describe("pickToneBySlug", () => {
  it("같은 slug는 항상 같은 tone을 반환", () => {
    expect(pickToneBySlug("abc123def456")).toBe(pickToneBySlug("abc123def456"));
  });

  it("결과는 friendly | editorial 중 하나", () => {
    const result = pickToneBySlug("abc123def456");
    expect(["friendly", "editorial"]).toContain(result);
  });

  it("대량 분포가 friendly 약 60%, editorial 약 40% 부근 (±10%p)", () => {
    let f = 0;
    for (let i = 0; i < 1000; i++) {
      if (pickToneBySlug(`slug-${i.toString(16).padStart(12, "0")}`) === "friendly") f++;
    }
    expect(f).toBeGreaterThan(500);
    expect(f).toBeLessThan(700);
  });
});
