import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

export const buildDefaultVideoPrompt = (
  recipe?: Pick<DetailedRecipeGridItem, "title">
) => {
  const subject = recipe?.title ?? "the dish";
  return [
    `Subtle cinematic motion of ${subject}.`,
    "Slow camera dolly-in, shallow depth of field.",
    "Soft warm rim light, gentle steam rising from the dish.",
    "No people, no text, no logos. 5 seconds.",
  ].join(" ");
};
