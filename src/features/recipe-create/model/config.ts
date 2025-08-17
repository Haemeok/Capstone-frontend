import { z } from "zod";

const ingredientSchema = z.object({
  name: z.string(),
  quantity: z.string().min(1, "수량을 입력해주세요"),
  unit: z.string(),
});

const stepIngredientSchema = z.object({
  name: z.string(),
  quantity: z.string().optional(),
  unit: z.string(),
});

const stepSchema = z.object({
  instruction: z.string().min(1, "조리 방법을 입력해주세요"),
  stepNumber: z.number().min(0),
  imageFile: z
    .instanceof(FileList)
    .refine((file) => file.length > 0, "레시피 대표 이미지를 등록해주세요.")
    .nullable(),
  ingredients: z.array(stepIngredientSchema).default([]),
  imageKey: z.string().optional().nullable(),
});

export const recipeFormSchema = z.object({
  title: z.string().min(5, "제목은 5자 이상 입력해주세요"),
  imageFile: z
    .instanceof(FileList, {
      message: "레시피 대표 이미지를 등록해주세요",
    })
    .nullable(),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "최소 1개의 재료를 추가해주세요"),
  cookingTime: z.coerce.number().min(1, "1분 이상 입력해주세요"),
  servings: z.coerce.number().min(1, "1인분 이상 선택해주세요"),
  dishType: z.string().min(1, "카테고리를 선택해주세요"),
  description: z.string().min(10, "설명은 10자 이상 입력해주세요"),
  steps: z.array(stepSchema).min(1, "최소 1개의 조리 단계를 추가해주세요"),
  cookingTools: z.array(z.string()).default([]),
  tagNames: z.array(z.string()).default([]),
  imageKey: z.string().optional().nullable(),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
export type IngredientPayload = z.infer<typeof ingredientSchema>;
export type StepPayload = z.infer<typeof stepSchema>;

export const RECIPE_FORM_DEFAULT_VALUES: RecipeFormValues = {
  title: "",
  imageFile: null,
  ingredients: [],
  cookingTime: undefined as any,
  servings: 1,
  dishType: "",
  description: "",
  steps: [
    {
      instruction: "",
      stepNumber: 0,
      imageFile: null,
      ingredients: [],
    },
  ],
  cookingTools: [],
  tagNames: [],
};
