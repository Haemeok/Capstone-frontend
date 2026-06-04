import type { CreatorCountryTag } from "../model/types";

export type CreatorCountryFlag = {
  emoji: string;
  label: string;
};

const FLAGS: Record<Exclude<CreatorCountryTag, "KR">, CreatorCountryFlag> = {
  JP: { emoji: "🇯🇵", label: "일본 채널" },
  OTHER: { emoji: "🌐", label: "해외 채널" },
};

export const getCreatorCountryFlag = (
  tag?: CreatorCountryTag | null
): CreatorCountryFlag | null => {
  if (tag == null || tag === "KR") return null;
  return FLAGS[tag];
};
