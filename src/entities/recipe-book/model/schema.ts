import { z } from "zod";

export const recipeBookFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "레시피북 이름을 입력해주세요")
    .max(50, "50자 이내로 입력해주세요"),
});

export type RecipeBookFormValues = z.infer<typeof recipeBookFormSchema>;
