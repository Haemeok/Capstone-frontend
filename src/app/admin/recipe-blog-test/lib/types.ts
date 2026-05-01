export type SequenceCategory = "step" | "final";
export type SequenceSubcategory = "step" | "final_plated";

export type SequenceImage = {
  id: string;
  category: SequenceCategory;
  subcategory: SequenceSubcategory;
  label: string;
  prompt: string;
  requiresReference?: boolean;
  referenceFromImageId?: string;
};

export type SequenceModelId = "gpt-image-2-low";

export const SEQUENCE_MODEL_IDS: readonly SequenceModelId[] = [
  "gpt-image-2-low",
] as const;
