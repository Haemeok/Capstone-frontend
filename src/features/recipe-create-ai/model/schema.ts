import { z } from "zod";

export const aiRecipeFormSchema = z.object({
  ingredients: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .min(3, "최소 3개의 재료를 선택해주세요")
    .default([]),
  dishType: z.string().min(1, "요리 종류를 선택해주세요").default(""),
  cookingTime: z.number().int().min(1, "조리 시간을 선택해주세요").default(0),
  servings: z.number().int().min(1).default(2),
});

export type AIRecipeFormValues = z.infer<typeof aiRecipeFormSchema>;

export const AI_RECIPE_FIELD_LABELS: Record<keyof AIRecipeFormValues, string> =
  {
    ingredients: "재료 (최소 3개)",
    dishType: "요리 종류",
    cookingTime: "조리시간",
    servings: "인분",
  };
