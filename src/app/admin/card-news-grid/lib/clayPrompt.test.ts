// src/app/admin/card-news-grid/lib/clayPrompt.test.ts
import { buildClayPrompt } from "./clayPrompt";

const NINE = ["김치찌개","된장찌개","제육볶음","계란말이","미역국","불고기","비빔밥","잡채","갈비찜"];

describe("buildClayPrompt", () => {
  it("정확히 9개가 아니면 throw", () => {
    expect(() => buildClayPrompt(NINE.slice(0, 8), "recipe")).toThrow();
    expect(() => buildClayPrompt([...NINE, "추가"], "recipe")).toThrow();
  });

  it("recipe 모드: 고정 스타일 키워드를 포함한다", () => {
    const p = buildClayPrompt(NINE, "recipe");
    expect(p).toContain("3×3");
    expect(p).toContain("claymation");
    expect(p).toContain("텍스트 없음");
    expect(p).toContain("흰 배경");
  });

  it("recipe 모드: 9개 음식 이름을 모두 포함한다", () => {
    const p = buildClayPrompt(NINE, "recipe");
    NINE.forEach((name) => expect(p).toContain(name));
  });

  it("tips 모드: 고정 스타일 키워드와 tips 전용 문구를 포함한다", () => {
    const p = buildClayPrompt(NINE, "tips");
    expect(p).toContain("claymation");
    expect(p).toContain("텍스트 없음");
    expect(p).toContain("흰 배경");
    expect(p).toContain("주제를 설명하는");
  });

  it("tips 모드: 9개 항목을 모두 포함한다", () => {
    const p = buildClayPrompt(NINE, "tips");
    NINE.forEach((name) => expect(p).toContain(name));
  });
});
