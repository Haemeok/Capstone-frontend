import type { BlogTone } from "./toneInserts";

// BlogTone enum 의 표시/할당 순서. 추후 톤 추가 시 끝에 append.
export const ALL_TONES: BlogTone[] = [
  "epigung",
  "ellymom",
  "elarpi",
  "minnie46",
  "haetsal",
];

// 발행 계정 (NAVER 블로그 ID) 목록. capstone 환경 변수 NAVER_BLOG_IDS=acc1,acc2,acc3.
// 등록 0개면 빈 배열 → tone → blogId 매핑 전체 null (발행부에서 free pick fallback).
export const listAccountsFromEnv = (): string[] => {
  const raw = process.env.NAVER_BLOG_IDS?.trim();
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
};

// tones 를 accounts 순서대로 ceil(N/M) 단위 그룹 분배.
//   6톤/3계정 → [2,2,2]
//   9톤/3계정 → [3,3,3]
//   5톤/3계정 → [2,2,1]
//   7톤/3계정 → [3,3,1]
// accounts 빈 배열이면 빈 map.
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
