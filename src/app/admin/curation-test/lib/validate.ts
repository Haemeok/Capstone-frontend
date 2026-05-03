export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: string[] };

const ALLOWED_KEYS = ["img", "recipe", "yt"] as const;
type AllowedKey = (typeof ALLOWED_KEYS)[number];

const SLOT_RE = /\{\{([a-zA-Z]+):(\d+)\}\}/g;

export const validateMarkdown = (md: string, n: number): ValidationResult => {
  const errors: string[] = [];

  // 1. 길이
  if (md.length < 800) errors.push(`본문 길이 ${md.length}자 (최소 800)`);
  if (md.length > 5000) errors.push(`본문 길이 ${md.length}자 (최대 5000)`);

  // 2. 슬롯 카운트 (key, index) → count
  const counts = new Map<string, number>();
  let m: RegExpExecArray | null;
  SLOT_RE.lastIndex = 0;
  while ((m = SLOT_RE.exec(md))) {
    const [, key, idxStr] = m;
    if (!ALLOWED_KEYS.includes(key as AllowedKey)) {
      errors.push(`알 수 없는 슬롯 키: {{${key}:${idxStr}}}`);
      continue;
    }
    const idx = Number(idxStr);
    if (idx < 0 || idx >= n) {
      errors.push(`정의되지 않은 인덱스: {{${key}:${idxStr}}} (유효 범위 0..${n - 1})`);
      continue;
    }
    const k = `${key}:${idx}`;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  for (const key of ALLOWED_KEYS) {
    for (let i = 0; i < n; i++) {
      const c = counts.get(`${key}:${i}`) ?? 0;
      if (c === 0) errors.push(`{{${key}:${i}}} 슬롯이 누락됨`);
      else if (c > 1) errors.push(`{{${key}:${i}}} 슬롯이 ${c}회 등장 (정확히 1회여야 함)`);
    }
  }

  // 3. H1/H2 카운트
  // newline 또는 문서 시작 직후의 `# ` / `## `만 카운트.
  // (Grok이 단락 간 진짜 newline 대신 double-space로 끊어 출력하는 경우가 있어
  //  단순 line-split 매칭은 0개로 잡혀 false-positive를 만든다.)
  const h1Count = (md.match(/(?:^|\n)# (?!#)/g) ?? []).length;
  const h2Count = (md.match(/(?:^|\n)## (?!#)/g) ?? []).length;
  if (h1Count > 0) errors.push(`본문에 H1이 ${h1Count}회 등장 (h1은 별도 필드)`);
  if (h2Count !== n) errors.push(`H2 개수 ${h2Count}개 (예상 ${n}개)`);

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
};
