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
  md.replace(/([^\n]) +(#{1,3} )/g, "$1\n\n$2").trim();

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

export const parseAndValidateRecipeBlogBody = (
  md: string,
  { expectedStepNumbers }: ValidateBodyInput
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
  if (kitchenTips.length === 0 && kitchenTipsRaw) {
    errors.push("kitchenTips 섹션을 `- 항목` 불릿으로 작성해 주세요.");
  }

  // bonusVariation 은 "none" 또는 빈 섹션이면 null.
  let bonusVariation: string | null = null;
  if (bonusRaw !== null) {
    const trimmed = bonusRaw.trim();
    if (trimmed && trimmed.toLowerCase() !== "none") {
      bonusVariation = trimmed;
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

export const synthesizeAlts = (
  recipeTitle: string,
  slots: string[]
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
