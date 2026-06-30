import type { CreatorCountryTag } from "../model/types";

export type CountryFlagView = {
  variant: "jp" | "us" | "globe";
  labelKey: "jp" | "us" | "other";
};

const FLAGS: Record<Exclude<CreatorCountryTag, "KR">, CountryFlagView> = {
  JP: { variant: "jp", labelKey: "jp" },
  US: { variant: "us", labelKey: "us" },
  OTHER: { variant: "globe", labelKey: "other" },
};

export const getCreatorCountryFlag = (
  tag?: CreatorCountryTag | null
): CountryFlagView | null => {
  if (tag == null || tag === "KR") return null;
  return FLAGS[tag];
};
