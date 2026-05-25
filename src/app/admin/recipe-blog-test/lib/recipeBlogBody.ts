// Stage 1 본문 markdown → 구조화된 BlogPost 섹션으로 파싱·검증한다.
// 큐레이션은 markdown 그대로 발행하지만 레시피 블로그는 네이버 포스터가
// steps[]/kitchenTips[]/appliedKnowledge/... 구조 필드를 직접 읽으므로,
// LLM 으로부터는 markdown 으로 받아 파싱 책임을 우리가 진다.

export type ParsedRecipeBlogBody = {
  lead: string;
  steps: { stepNumber: number; body: string; imageSlot: string }[];
  kitchenTips: string[];
  appliedKnowledge: string;
  bonusVariation: string | null;
  closingNote: string;
};

export type ValidateBodyInput = {
  expectedStepNumbers: number[];
};

export type ValidateBodyResult =
  | { ok: true; parsed: ParsedRecipeBlogBody }
  | { ok: false; errors: string[] };

export const stripCodeFence = (s: string): string => {
  const trimmed = s.trim();
  const m = trimmed.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/);
  return m ? m[1].trim() : trimmed;
};

// 헤더가 인라인 spaces 로 뭉쳐 오는 패턴 복원 (큐레이션 normalizeMarkdown 차용).
export const normalizeMarkdown = (md: string): string =>
  md
    .replace(/([^\n]) +(#{1,3} )/g, "$1\n\n$2")
    .trim();

// `## section-name` H2 헤더 기준으로 본문을 잘라 섹션 dict 로 만든다.
// 헤더 라인 자체는 빼고, 그 다음 빈 줄 + 본문만 모은다. 같은 이름이 두 번
// 나오면 마지막 것만 채택 (LLM 이 retry 컨텍스트 흘리면 dup 가능성).
const splitSections = (md: string): Record<string, string> => {
  const sections: Record<string, string> = {};
  const lines = md.split("\n");
  let current: string | null = null;
  let buf: string[] = [];

  const flush = () => {
    if (current !== null) {
      sections[current] = buf.join("\n").trim();
    }
  };

  for (const line of lines) {
    const m = line.match(/^##\s+([\w-]+)\s*$/);
    if (m) {
      flush();
      current = m[1];
      buf = [];
    } else if (current !== null) {
      buf.push(line);
    }
  }
  flush();

  return sections;
};

// `- foo` / `* foo` / `1. foo` 형식의 불릿/넘버드 리스트 항목을 평탄한 배열로.
const parseListItems = (body: string): string[] => {
  const items: string[] = [];
  let buf: string[] = [];

  const flush = () => {
    const joined = buf.join(" ").trim();
    if (joined) items.push(joined);
    buf = [];
  };

  for (const line of body.split("\n")) {
    const m = line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)$/);
    if (m) {
      flush();
      buf.push(m[1].trim());
    } else if (buf.length > 0 && line.trim().length > 0) {
      // 이어쓰기 (한 항목이 여러 줄에 걸친 경우)
      buf.push(line.trim());
    } else if (line.trim().length === 0) {
      flush();
    }
  }
  flush();

  return items;
};

const RANGE = {
  lead: { min: 280, max: 520 },
  stepBody: { min: 80, max: 280 },
  kitchenTip: { min: 40, max: 220 },
  appliedKnowledge: { min: 250, max: 620 },
  bonusVariation: { min: 80, max: 320 },
  closingNote: { min: 220, max: 480 },
  kitchenTipsCount: { min: 2, max: 4 },
} as const;

const lengthError = (
  field: string,
  text: string,
  min: number,
  max: number,
): string | null => {
  const len = text.length;
  if (len < min) return `${field} 길이 ${len} < ${min} (최소 미달)`;
  if (len > max) return `${field} 길이 ${len} > ${max} (최대 초과)`;
  return null;
};

export const parseAndValidateRecipeBlogBody = (
  md: string,
  { expectedStepNumbers }: ValidateBodyInput,
): ValidateBodyResult => {
  const errors: string[] = [];
  const sections = splitSections(md);

  const need = (name: string): string => {
    const v = sections[name];
    if (!v) {
      errors.push(`섹션 \`## ${name}\` 가 없습니다.`);
      return "";
    }
    return v;
  };

  const lead = need("lead");
  const kitchenTipsRaw = need("kitchenTips");
  const appliedKnowledge = need("appliedKnowledge");
  const closingNote = need("closingNote");
  const bonusRaw = sections.bonusVariation ?? null;

  const stepEntries: ParsedRecipeBlogBody["steps"] = [];
  for (const n of expectedStepNumbers) {
    const body = sections[`step-${n}`];
    if (!body) {
      errors.push(`섹션 \`## step-${n}\` 가 없습니다.`);
      continue;
    }
    stepEntries.push({ stepNumber: n, body, imageSlot: `step-${n}` });
  }

  // 알 수 없는 step-* 섹션 (LLM 환각 방어)
  for (const key of Object.keys(sections)) {
    const m = key.match(/^step-(\d+)$/);
    if (m && !expectedStepNumbers.includes(Number(m[1]))) {
      errors.push(`알 수 없는 step 섹션: \`## ${key}\``);
    }
  }

  const kitchenTips = parseListItems(kitchenTipsRaw);
  if (
    kitchenTips.length < RANGE.kitchenTipsCount.min ||
    kitchenTips.length > RANGE.kitchenTipsCount.max
  ) {
    errors.push(
      `kitchenTips 항목 수 ${kitchenTips.length} (필요: ${RANGE.kitchenTipsCount.min}~${RANGE.kitchenTipsCount.max})`,
    );
  }

  if (lead) {
    const e = lengthError("lead", lead, RANGE.lead.min, RANGE.lead.max);
    if (e) errors.push(e);
  }
  for (const s of stepEntries) {
    const e = lengthError(
      `step-${s.stepNumber}`,
      s.body,
      RANGE.stepBody.min,
      RANGE.stepBody.max,
    );
    if (e) errors.push(e);
  }
  for (let i = 0; i < kitchenTips.length; i++) {
    const e = lengthError(
      `kitchenTips[${i}]`,
      kitchenTips[i],
      RANGE.kitchenTip.min,
      RANGE.kitchenTip.max,
    );
    if (e) errors.push(e);
  }
  if (appliedKnowledge) {
    const e = lengthError(
      "appliedKnowledge",
      appliedKnowledge,
      RANGE.appliedKnowledge.min,
      RANGE.appliedKnowledge.max,
    );
    if (e) errors.push(e);
  }
  if (closingNote) {
    const e = lengthError(
      "closingNote",
      closingNote,
      RANGE.closingNote.min,
      RANGE.closingNote.max,
    );
    if (e) errors.push(e);
  }

  // bonusVariation 은 "none" 또는 빈 섹션이면 null. 그 외엔 길이 검증.
  let bonusVariation: string | null = null;
  if (bonusRaw !== null) {
    const trimmed = bonusRaw.trim();
    if (trimmed && trimmed.toLowerCase() !== "none") {
      bonusVariation = trimmed;
      const e = lengthError(
        "bonusVariation",
        trimmed,
        RANGE.bonusVariation.min,
        RANGE.bonusVariation.max,
      );
      if (e) errors.push(e);
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    parsed: {
      lead,
      steps: stepEntries,
      kitchenTips,
      appliedKnowledge,
      bonusVariation,
      closingNote,
    },
  };
};

// 이미지 슬롯별 alt 자동 합성. LLM 한테 record 출력시키지 않고 우리가 박는다
// (Upstage JSON mode 가 record/regex 키워드에 약함).
export const synthesizeAlts = (
  recipeTitle: string,
  slots: string[],
): Record<string, string> => {
  const alts: Record<string, string> = {};
  for (const slot of slots) {
    const m = slot.match(/^step-(\d+)$/);
    if (m) {
      alts[slot] = `${recipeTitle} 단계 ${m[1]}`;
    } else if (slot === "final-plated") {
      alts[slot] = `${recipeTitle} 완성`;
    } else {
      alts[slot] = `${recipeTitle} ${slot}`;
    }
  }
  return alts;
};
