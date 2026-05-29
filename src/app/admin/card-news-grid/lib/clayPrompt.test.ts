// src/app/admin/card-news-grid/lib/clayPrompt.test.ts
import { buildClayPrompt } from "./clayPrompt";

const NINE = ["김치찌개","된장찌개","제육볶음","계란말이","미역국","불고기","비빔밥","잡채","갈비찜"];

describe("buildClayPrompt", () => {
  it("정확히 9개가 아니면 throw", () => {
    expect(() => buildClayPrompt(NINE.slice(0, 8))).toThrow();
    expect(() => buildClayPrompt([...NINE, "추가"])).toThrow();
  });

  it("고정 스타일 키워드를 포함한다", () => {
    const p = buildClayPrompt(NINE);
    expect(p).toContain("3×3");
    expect(p).toContain("claymation");
    expect(p).toContain("텍스트 없음");
    expect(p).toContain("흰 배경");
  });

  it("9개 음식 이름을 모두 포함한다", () => {
    const p = buildClayPrompt(NINE);
    NINE.forEach((name) => expect(p).toContain(name));
  });
});
