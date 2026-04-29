export type QuotaMode = "single" | "combined";

export type FinalThemeKey =
  | "korean_mom_phone"
  | "family_table_wide"
  | "magazine_flat_lay"
  | "steam_hero";

export type SequenceCategory = "prep" | "action" | "final";

export type SequenceSubcategory =
  | "vegetable"
  | "seasoning_main"
  | "seasoning_minor_combined"
  | "seasoning_minor_single"
  | "meat"
  | "action"
  | "final_theme";

export type SequenceImage = {
  id: string;
  category: SequenceCategory;
  subcategory: SequenceSubcategory;
  label: string;
  prompt: string;
  themeKey?: FinalThemeKey;
};

export type SequenceModelId = "gpt-image-2-low" | "gpt-image-2-medium";

export const SEQUENCE_MODEL_IDS: readonly SequenceModelId[] = [
  "gpt-image-2-low",
  "gpt-image-2-medium",
] as const;
