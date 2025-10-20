import { z } from "zod";
import {
  COOKING_TIME,
  DESCRIPTION,
  INGREDIENTS,
  SERVINGS,
  TITLE,
} from "./constants";
import { STEPS } from "./constants";
import { MSG } from "./messages";

const imageSchema = z
  .union([
    z.instanceof(File, { message: MSG.IMAGE.REQUIRED }),
    z.url(),
    z.null(),
  ])
  .optional();

const mainImageSchema = z
  .union([z.instanceof(File), z.url(), z.null()])
  .refine((val) => val !== null, {
    message: MSG.IMAGE.REQUIRED,
  });

const ingredientSchema = z.object({
  name: z.string(),
  quantity: z.string().min(1, MSG.DESCRIPTION.QUANTITY),
  unit: z.string(),
});

const stepIngredientSchema = z.object({
  name: z.string(),
  quantity: z.string().optional(),
  unit: z.string(),
});

const stepSchema = z.object({
  instruction: z.string().min(1, MSG.STEPS.INSTRUCTION),
  stepNumber: z.number().min(0),
  image: imageSchema,
  ingredients: z.array(stepIngredientSchema).default([]),
  imageKey: z.string().optional().nullable(),
});

export const recipeFormSchema = z.object({
  title: z.string().min(TITLE.MIN, MSG.TITLE.MIN).max(TITLE.MAX, MSG.TITLE.MAX),
  image: mainImageSchema,
  ingredients: z
    .array(ingredientSchema)
    .min(INGREDIENTS.MIN, MSG.INGREDIENTS.MIN),
  cookingTime: z.coerce.number().min(COOKING_TIME.MIN, MSG.COOKING_TIME.MIN),
  servings: z.coerce.number().min(SERVINGS.MIN, MSG.SERVINGS.MIN),
  dishType: z.string().min(1, MSG.CATEGORY.REQUIRED),
  description: z.string().min(DESCRIPTION.MIN, MSG.DESCRIPTION.MIN),
  steps: z.array(stepSchema).min(STEPS.MIN, MSG.STEPS.MIN),
  cookingTools: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  imageKey: z.string().optional().nullable(),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
export type IngredientPayload = z.infer<typeof ingredientSchema>;
export type StepPayload = z.infer<typeof stepSchema>;
export type ImageType = z.infer<typeof imageSchema>;

export const RECIPE_FORM_DEFAULT_VALUES: RecipeFormValues = {
  title: "",
  image: null,
  ingredients: [],
  cookingTime: undefined as any,
  servings: 1,
  dishType: "",
  description: "",
  steps: [
    {
      instruction: "",
      stepNumber: 0,
      image: null,
      ingredients: [],
    },
  ],
  cookingTools: [],
  tags: [],
};
