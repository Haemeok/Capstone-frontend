export type PromptInput = {
  title: string;
  description?: string;
  mainIngredients?: string[];
};

const MAX_INGREDIENTS = 5;

export const buildPrompt = ({ title, description, mainIngredients }: PromptInput): string => {
  const ingredients = (mainIngredients ?? []).slice(0, MAX_INGREDIENTS).join(", ");
  const descPart = description ? ` ${description}.` : "";
  const ingPart = ingredients ? ` Main ingredients: ${ingredients}.` : "";

  return [
    `A professional Korean food photography shot of ${title}.${descPart}${ingPart}`,
    "Overhead 45-degree angle, natural daylight, shallow depth of field,",
    "styled on a rustic ceramic plate over a linen cloth, editorial magazine quality,",
    "photorealistic, vivid colors, appetizing, no text, no watermark.",
  ].join(" ");
};
