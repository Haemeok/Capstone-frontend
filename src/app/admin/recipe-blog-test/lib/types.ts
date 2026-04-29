export type SequenceCategory = "step" | "final";
export type SequenceSubcategory = "step" | "final_theme";

export type FinalThemeKey = "korean_mom_phone";

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
