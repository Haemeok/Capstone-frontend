import { buildHooking } from "./hooking";

describe("buildHooking", () => {
  it("음식이름·랭크타입·개수로 후킹 문구를 만든다", () => {
    expect(buildHooking("김치찌개", "TOP", 5)).toBe(
      "유튜브 김치찌개 레시피 TOP 5"
    );
  });

  it("음식이름이 비어도 골격을 유지하고 throw하지 않는다", () => {
    expect(buildHooking("", "TOP", 5)).toBe("유튜브  레시피 TOP 5");
  });
});
