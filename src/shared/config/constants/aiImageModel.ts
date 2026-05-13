export type ImageGenModel =
  | "gemini-2.5-flash-image"
  | "gpt-image-2-low"
  | "gpt-image-2-medium"
  | "gpt-image-2-high";

export const DEFAULT_IMAGE_GEN_MODEL: ImageGenModel = "gpt-image-2-low";
