import { CURATION_CATEGORIES } from "@/entities/curation";

import {
  buildTitleSystemPrompt,
  buildTitleUserPrompt,
  sampleFewShotTitles,
} from "./buildTitlePrompt";

describe("buildTitleSystemPrompt", () => {
  it("Elle 푸드 에디터 페르소나를 명시한다", () => {
    const sys = buildTitleSystemPrompt({
      fewShots: ["예시 제목 A", "예시 제목 B"],
      count: 5,
      poolSize: 10,
    });
    expect(sys).toMatch(/푸드.*에디터/);
  });

  it("few-shot 예시들이 본문에 포함된다", () => {
    const sys = buildTitleSystemPrompt({
      fewShots: ["예시 제목 A"],
      count: 5,
      poolSize: 10,
    });
    expect(sys).toContain("예시 제목 A");
  });

  it("축 1-2개 의도적 생략 지시가 들어간다", () => {
    const sys = buildTitleSystemPrompt({ fewShots: [], count: 5, poolSize: 10 });
    expect(sys).toMatch(/생략|모두 넣지 마/);
  });
});

describe("buildTitleSystemPrompt - categories block", () => {
  it("CURATION_CATEGORIES 9개를 모두 포함한다", () => {
    const prompt = buildTitleSystemPrompt({ fewShots: [], count: 5, poolSize: 10 });
    for (const cat of CURATION_CATEGORIES) {
      expect(prompt).toContain(cat);
    }
  });

  it("폴백 안내 문구를 포함한다", () => {
    const prompt = buildTitleSystemPrompt({ fewShots: [], count: 5, poolSize: 10 });
    expect(prompt).toMatch(/FOOD & LIFE/i);
    expect(prompt.toLowerCase()).toMatch(/doubt|애매|모호|불분명/);
  });
});

describe("buildTitleSystemPrompt - selection block", () => {
  it("후보 선별 블록과 selectedIndices 출력 라인을 포함한다", () => {
    const prompt = buildTitleSystemPrompt({ fewShots: [], count: 5, poolSize: 10 });
    expect(prompt).toContain("## 후보 선별");
    expect(prompt).toContain("후보 10개 중 가장 결이 맞는 5개");
    expect(prompt).toContain("selectedIndices");
  });
});

describe("buildTitleSystemPrompt - count enforcement", () => {
  it("정확히 N 강제 문구가 들어간다", () => {
    const sys = buildTitleSystemPrompt({ fewShots: [], count: 5, poolSize: 10 });
    expect(sys).toMatch(/h1.*dek.*숫자.*정확히.*5/);
  });

  it("'몇 가지' 류 흐림 표현 금지가 명시된다", () => {
    const sys = buildTitleSystemPrompt({ fewShots: [], count: 5, poolSize: 10 });
    expect(sys).toMatch(/몇 가지/);
    expect(sys.toLowerCase()).toMatch(/금지|쓰지 마|쓰지 말/);
  });

  it("'기계적 압축' 헷갈리는 옛 문구는 제거된다", () => {
    const sys = buildTitleSystemPrompt({ fewShots: [], count: 5, poolSize: 10 });
    expect(sys).not.toMatch(/기계적인 압축/);
  });
});

describe("buildTitleUserPrompt - count enforcement", () => {
  it("정확한 recipeCount 가 user prompt 에 명시된다", () => {
    const user = buildTitleUserPrompt({
      params: { q: "x" },
      recipeTitles: ["a", "b", "c", "d", "e"],
      recipeCount: 5,
    });
    expect(user).toMatch(/정확히 5/);
  });
});

describe("buildTitleUserPrompt - pool block", () => {
  it("후보 풀을 인덱스 prefix로 listing한다", () => {
    const prompt = buildTitleUserPrompt({
      params: { q: "리조또" },
      recipeTitles: ["버섯 리조또", "신라면 리조또", "토마토 리조또"],
      recipeCount: 3,
    });
    expect(prompt).toContain("0. 버섯 리조또");
    expect(prompt).toContain("1. 신라면 리조또");
    expect(prompt).toContain("2. 토마토 리조또");
  });
});

describe("buildTitleUserPrompt", () => {
  it("params를 JSON으로 직렬화하여 포함한다", () => {
    const user = buildTitleUserPrompt({
      params: { dishType: "찌개", season: "겨울" },
      recipeTitles: ["콩나물국"],
      recipeCount: 1,
    });
    expect(user).toContain("dishType");
    expect(user).toContain("찌개");
    expect(user).toContain("콩나물국");
  });

  it("commonIngredients가 주어지면 공통 재료 블록이 포함된다", () => {
    const user = buildTitleUserPrompt({
      params: { ingredientIds: "NjeW51wD" },
      recipeTitles: ["A", "B"],
      commonIngredients: ["쪽파", "마늘"],
      recipeCount: 2,
    });
    expect(user).toMatch(/공통 재료/);
    expect(user).toContain("쪽파");
    expect(user).toContain("마늘");
    expect(user).toMatch(/ID 토큰은 무시/);
  });

  it("commonIngredients가 없으면 공통 재료 블록은 빠진다", () => {
    const user = buildTitleUserPrompt({
      params: {},
      recipeTitles: ["A"],
      recipeCount: 1,
    });
    expect(user).not.toMatch(/공통 재료/);
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
