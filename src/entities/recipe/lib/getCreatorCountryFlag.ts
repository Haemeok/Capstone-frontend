import type { CreatorCountryTag } from "../model/types";

export type CreatorCountryFlag = {
  variant: "jp" | "us" | "globe";
  labelKey: "jp" | "us" | "other";
};

const FLAGS: Record<Exclude<CreatorCountryTag, "KR">, CreatorCountryFlag> = {
  JP: { variant: "jp", labelKey: "jp" },
  US: { variant: "us", labelKey: "us" },
  OTHER: { variant: "globe", labelKey: "other" },
};

export const getCreatorCountryFlag = (
  tag?: CreatorCountryTag | null
): CreatorCountryFlag | null => {
  if (tag == null || tag === "KR") return null;
  return FLAGS[tag];
};
