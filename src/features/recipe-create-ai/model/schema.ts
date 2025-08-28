import { z } from "zod";

export const aiRecipeFormSchema = z.object({
  ingredients: z
    .array(z.string())
    .min(3, "최소 3개의 재료를 선택해주세요")
    .default([]),
  dishType: z.string().default(""),
  cookingTime: z.number().int().min(1).default(10),
  servings: z.number().int().min(1).default(2),
});

export type AIRecipeFormValues = z.infer<typeof aiRecipeFormSchema>;
