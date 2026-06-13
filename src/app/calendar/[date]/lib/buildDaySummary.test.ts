import { buildDaySummary } from "./buildDaySummary";

const copy = {
  daySummaryEmpty: "EMPTY",
  daySummaryRecipeCount: "{count} recipes",
  daySummarySavedSuffix: "saved",
};

describe("buildDaySummary locale (T-16/17/18)", () => {
  it("ko → 절약 수치 포함 (T-16)", () => {
    const koCopy = {
      daySummaryEmpty: "아직 기록이 없어요",
      daySummaryRecipeCount: "레시피 {count}개",
      daySummarySavedSuffix: "절약",
    };
    const out = buildDaySummary(2, 8400, "ko", koCopy);
    expect(out).toContain("레시피 2개");
    expect(out).toContain("8,400원");
    expect(out).toContain("절약");
  });

  it("en/ja → 절약 수치 없음, 개수만 (T-17)", () => {
    const out = buildDaySummary(2, 8400, "en", copy);
    expect(out).toBe("2 recipes");
    expect(out).not.toMatch(/원|8,400|saved/);
  });

  it("0개 → locale별 empty 메시지 (T-18)", () => {
    expect(buildDaySummary(0, 0, "en", copy)).toBe("EMPTY");
  });
});
