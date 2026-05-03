import type { ToneSeed } from "@/entities/curation";

export const pickToneBySlug = (slug: string): ToneSeed => {
  // slug의 마지막 hex 두 글자를 0..255 정수로 → mod 10
  // 0..5(60%) → friendly, 6..9(40%) → editorial
  const tail = slug.slice(-2);
  const n = parseInt(tail, 16);
  const bucket = n % 10;
  return bucket < 6 ? "friendly" : "editorial";
};
