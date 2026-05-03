import {
  buildTitleSystemPrompt,
  buildTitleUserPrompt,
  sampleFewShotTitles,
} from "./buildTitlePrompt";

describe("buildTitleSystemPrompt", () => {
  it("Elle 푸드 에디터 페르소나를 명시한다", () => {
    const sys = buildTitleSystemPrompt({ fewShots: ["예시 제목 A", "예시 제목 B"] });
    expect(sys).toMatch(/푸드.*에디터/);
  });

  it("few-shot 예시들이 본문에 포함된다", () => {
    const sys = buildTitleSystemPrompt({ fewShots: ["예시 제목 A"] });
    expect(sys).toContain("예시 제목 A");
  });

  it("축 1-2개 의도적 생략 지시가 들어간다", () => {
    const sys = buildTitleSystemPrompt({ fewShots: [] });
    expect(sys).toMatch(/생략|모두 넣지 마/);
  });
});

describe("buildTitleUserPrompt", () => {
  it("params를 JSON으로 직렬화하여 포함한다", () => {
    const user = buildTitleUserPrompt({
      params: { dishType: "찌개", season: "겨울" },
      recipeTitles: ["콩나물국"],
    });
    expect(user).toContain("dishType");
    expect(user).toContain("찌개");
    expect(user).toContain("콩나물국");
  });
});

describe("sampleFewShotTitles", () => {
  it("같은 slug에 같은 표본이 나온다 (deterministic)", () => {
    const a = sampleFewShotTitles("abc123def456", 5);
    const b = sampleFewShotTitles("abc123def456", 5);
    expect(a).toEqual(b);
  });

  it("최소 8개, 코퍼스 길이 한계 내", () => {
    const out = sampleFewShotTitles("abc123def456", 8);
    expect(out.length).toBeLessThanOrEqual(8);
    expect(out.length).toBeGreaterThan(0);
  });
});
