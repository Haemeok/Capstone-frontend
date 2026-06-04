import { toShortTagLabel } from "../toShortTagLabel";

describe("toShortTagLabel", () => {
  it("선두 이모지를 떼고 한글만 남긴다", () => {
    expect(toShortTagLabel("🍽️ 혼밥")).toBe("혼밥");
    expect(toShortTagLabel("🏕️ 캠핑")).toBe("캠핑");
  });

  it("ZWJ로 연결된 합성 이모지도 제거한다", () => {
    expect(toShortTagLabel("👨‍🍳 셰프 레시피")).toBe("셰프 레시피");
  });

  it("이름 안의 / 앞부분만 취한다", () => {
    expect(toShortTagLabel("🥗 다이어트 / 건강식")).toBe("다이어트");
    expect(toShortTagLabel("⚡ 초스피드 / 간단 요리")).toBe("초스피드");
  });

  it("이모지 없는 태그는 / 앞부분만 잘라 그대로 반환한다", () => {
    expect(toShortTagLabel("한식/찌개")).toBe("한식");
    expect(toShortTagLabel("국물요리")).toBe("국물요리");
  });

  it("빈 문자열에도 안전하다", () => {
    expect(toShortTagLabel("")).toBe("");
  });
});
