import type { ToneSeed } from "@/entities/curation";

export const pickToneBySlug = (slug: string): ToneSeed => {
  const tail = slug.slice(-2);
  const n = parseInt(tail, 16);
  const bucket = n % 10;
  return bucket < 6 ? "friendly" : "editorial";
};
