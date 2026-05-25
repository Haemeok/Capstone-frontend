import {
  normalizeMarkdown,
  parseAndValidateRecipeBlogBody,
  stripCodeFence,
  synthesizeAlts,
} from "./recipeBlogBody";

const longText = (min: number): string => {
  const base =
    "콩나물국은 환절기 아침 식탁에 자주 오르는 가벼운 한 그릇입니다. ";
  let s = "";
  while (s.length < min) s += base;
  return s;
};

const validBody = `## lead
${longText(300)}

## step-1
${longText(120)}

## step-2
${longText(120)}

## kitchenTips
- ${longText(60)}
- ${longText(60)}
- ${longText(60)}

## appliedKnowledge
${longText(300)}

## bonusVariation
${longText(100)}

## closingNote
${longText(260)}`;

describe("stripCodeFence", () => {
  it("```markdown ... ``` 펜스를 벗긴다", () => {
    const wrapped = "```markdown\n# hi\n본문\n```";
    expect(stripCodeFence(wrapped)).toBe("# hi\n본문");
  });

  it("펜스 없으면 trim만 한다", () => {
    expect(stripCodeFence("  hello  ")).toBe("hello");
  });
});

describe("normalizeMarkdown", () => {
  it("헤더 앞 공백 뭉침을 줄바꿈으로 복원한다", () => {
    const collapsed = "본문 끝 ## 다음 헤더\n내용";
    expect(normalizeMarkdown(collapsed)).toContain("\n\n## 다음 헤더");
  });
});

describe("parseAndValidateRecipeBlogBody", () => {
  it("정상 본문은 ok:true 와 구조화된 결과를 돌려준다", () => {
    const result = parseAndValidateRecipeBlogBody(validBody, {
      expectedStepNumbers: [1, 2],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.parsed.lead.length).toBeGreaterThanOrEqual(280);
      expect(result.parsed.steps).toHaveLength(2);
      expect(result.parsed.steps[0].stepNumber).toBe(1);
      expect(result.parsed.steps[0].imageSlot).toBe("step-1");
      expect(result.parsed.kitchenTips).toHaveLength(3);
      expect(result.parsed.bonusVariation).not.toBeNull();
    }
  });

  it("필수 섹션 누락 시 errors 에 해당 섹션명을 박는다", () => {
    const missing = validBody.replace(/## closingNote[\s\S]*$/, "");
    const result = parseAndValidateRecipeBlogBody(missing, {
      expectedStepNumbers: [1, 2],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join("\n")).toContain("closingNote");
    }
  });

  it("step 섹션 누락 시 errors 에 누락된 step 번호를 박는다", () => {
    const result = parseAndValidateRecipeBlogBody(validBody, {
      expectedStepNumbers: [1, 2, 3],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join("\n")).toContain("step-3");
    }
  });

  it("알 수 없는 step 섹션은 에러로 친다 (LLM 환각 방어)", () => {
    const withGhost = `${validBody}\n\n## step-9\n${longText(120)}`;
    const result = parseAndValidateRecipeBlogBody(withGhost, {
      expectedStepNumbers: [1, 2],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join("\n")).toContain("step-9");
    }
  });

  it('bonusVariation 본문이 "none" 이면 null 로 파싱한다', () => {
    const noBonus = validBody.replace(
      /## bonusVariation\n[^#]+/,
      "## bonusVariation\nnone\n\n",
    );
    const result = parseAndValidateRecipeBlogBody(noBonus, {
      expectedStepNumbers: [1, 2],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.parsed.bonusVariation).toBeNull();
    }
  });

  it("lead 가 매우 짧아도 (구조만 맞으면) 통과한다 — 길이 bound 없음", () => {
    const tooShort = validBody.replace(/## lead\n[^#]+/, "## lead\n짧음.\n\n");
    const result = parseAndValidateRecipeBlogBody(tooShort, {
      expectedStepNumbers: [1, 2],
    });
    expect(result.ok).toBe(true);
  });

  it("kitchenTips 가 1개여도 통과한다 — 개수 bound 없음", () => {
    const single = validBody.replace(
      /## kitchenTips\n[^#]+/,
      `## kitchenTips\n- ${longText(60)}\n\n`,
    );
    const result = parseAndValidateRecipeBlogBody(single, {
      expectedStepNumbers: [1, 2],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.parsed.kitchenTips).toHaveLength(1);
    }
  });

  it("kitchenTips 섹션은 있는데 불릿이 하나도 없으면 에러 (포맷 힌트)", () => {
    const noBullets = validBody.replace(
      /## kitchenTips\n[^#]+/,
      "## kitchenTips\n그냥 본문 한 줄.\n\n",
    );
    const result = parseAndValidateRecipeBlogBody(noBullets, {
      expectedStepNumbers: [1, 2],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join("\n")).toContain("kitchenTips");
    }
  });
});

describe("synthesizeAlts", () => {
  it("step-N 슬롯은 '제목 단계 N' 패턴으로 합성", () => {
    const alts = synthesizeAlts("콩나물국", ["step-1", "step-2", "final-plated"]);
    expect(alts["step-1"]).toBe("콩나물국 단계 1");
    expect(alts["step-2"]).toBe("콩나물국 단계 2");
    expect(alts["final-plated"]).toBe("콩나물국 완성");
  });
});
