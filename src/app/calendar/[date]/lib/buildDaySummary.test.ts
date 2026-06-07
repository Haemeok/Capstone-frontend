import { buildDaySummary } from "./buildDaySummary";

describe("buildDaySummary", () => {
  it("레시피 수와 절약액을 한 줄 요약으로 만든다 (T-03)", () => {
    expect(buildDaySummary(2, 8400)).toBe("레시피 2개 · 8,400원 절약");
  });

  it("레시피가 0개면 담백한 대체 카피를 반환한다 (T-04)", () => {
    expect(buildDaySummary(0, 0)).toBe("아직 기록이 없어요");
  });
});
