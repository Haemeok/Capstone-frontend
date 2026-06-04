import type { BlogTone } from "./toneInserts";

// BlogTone enum 의 표시/할당 순서. 추후 톤 추가 시 끝에 append.
export const ALL_TONES: BlogTone[] = [
  "epigung",
  "ellymom",
  "elarpi",
  "minnie46",
  "haetsal",
  "jjeon_su",
  "chaihyoun",
  "woandos",
  "jaehee1213",
];

export const listAccountsFromEnv = (): string[] => {
  const raw = process.env.NAVER_BLOG_IDS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export const assignTonesToAccounts = (
  tones: BlogTone[],
  accounts: string[]
): Record<string, BlogTone[]> => {
  if (accounts.length === 0) return {};
  const groupSize = Math.ceil(tones.length / accounts.length);
  const out: Record<string, BlogTone[]> = {};
  accounts.forEach((acc, i) => {
    out[acc] = tones.slice(i * groupSize, (i + 1) * groupSize);
  });
  return out;
};

// 단일 tone → blogId 역 lookup. 어느 계정에도 안 속하면 null (예: accounts 빈 배열).
export const blogIdForTone = (tone: BlogTone): string | null => {
  const accounts = listAccountsFromEnv();
  if (accounts.length === 0) return null;
  const map = assignTonesToAccounts(ALL_TONES, accounts);
  for (const [blogId, tones] of Object.entries(map)) {
    if (tones.includes(tone)) return blogId;
  }
  return null;
};
