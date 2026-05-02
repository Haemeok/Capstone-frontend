import { getEuroParticle } from "../korean";

describe("getEuroParticle", () => {
  it("returns 로 for words ending without 받침", () => {
    expect(getEuroParticle("양파")).toBe("로");
    expect(getEuroParticle("양배추")).toBe("로");
    expect(getEuroParticle("토마토")).toBe("로");
    expect(getEuroParticle("감자")).toBe("로");
  });

  it("returns 로 for words ending with ㄹ 받침 (Korean exception)", () => {
    expect(getEuroParticle("마늘")).toBe("로");
    expect(getEuroParticle("쌀")).toBe("로");
    expect(getEuroParticle("나물")).toBe("로");
  });

  it("returns 으로 for words ending with non-ㄹ 받침", () => {
    expect(getEuroParticle("당근")).toBe("으로");
    expect(getEuroParticle("콩")).toBe("으로");
    expect(getEuroParticle("호박")).toBe("으로");
    expect(getEuroParticle("배추")).toBe("로"); // ends in vowel
    expect(getEuroParticle("양상추")).toBe("로");
  });

  it("falls back to 으로 for empty or non-Hangul input", () => {
    expect(getEuroParticle("")).toBe("으로");
    expect(getEuroParticle("tomato")).toBe("으로");
    expect(getEuroParticle("123")).toBe("으로");
  });
});
