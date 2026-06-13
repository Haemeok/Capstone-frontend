import { z } from "zod";

import { format } from "@/shared/i18n";
import { recipeFormMessages } from "@/shared/i18n/recipeFormMessages";
import type { RecipeFormDict } from "@/shared/i18n/types";

import {
  COOKING_TIME,
  DESCRIPTION,
  INGREDIENTS,
  isUnitlessQuantity,
  SERVINGS,
  TITLE,
} from "./constants";
import { STEPS } from "./constants";

type Validation = RecipeFormDict["validation"];

export const buildRecipeFormSchema = (v: Validation) => {
  const imageSchema = z
    .union([
      z.instanceof(File, { message: v.imageRequired }),
      z.url(),
      z.null(),
    ])
    .optional();

  const mainImageSchema = z
    .union([z.instanceof(File), z.url(), z.null()])
    .refine((val) => val !== null, {
      message: v.imageRequired,
    });

  const ingredientSchema = z
    .object({
      ingredientId: z.string(),
      name: z.string(),
      quantity: z.string().min(1, v.quantityRequired),
      unit: z.string(),
    })
    .superRefine((val, ctx) => {
      if (!isUnitlessQuantity(val.quantity) && val.unit.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["unit"],
          message: v.unitRequired,
        });
      }
    });

  const stepIngredientSchema = z.object({
    ingredientId: z.string(),
    name: z.string(),
    quantity: z.string(),
    unit: z.string(),
  });

  const stepSchema = z.object({
    instruction: z.string().min(1, v.instructionRequired),
    stepNumber: z.number().min(0),
    image: imageSchema,
    ingredients: z.array(stepIngredientSchema).default([]),
    imageKey: z.string().optional().nullable(),
  });

  return z.object({
    title: z
      .string()
      .min(TITLE.MIN, format(v.titleMin, { min: TITLE.MIN }))
      .max(TITLE.MAX, format(v.titleMax, { max: TITLE.MAX })),
    image: mainImageSchema,
    ingredients: z
      .array(ingredientSchema)
      .min(INGREDIENTS.MIN, format(v.ingredientsMin, { min: INGREDIENTS.MIN })),
    cookingTime: z.coerce
      .number()
      .min(
        COOKING_TIME.MIN,
        format(v.cookingTimeMin, { min: COOKING_TIME.MIN })
      ),
    servings: z.coerce
      .number()
      .min(SERVINGS.MIN, format(v.servingsMin, { min: SERVINGS.MIN })),
    dishType: z.string().min(1, v.categoryRequired),
    description: z
      .string()
      .min(DESCRIPTION.MIN, format(v.descriptionMin, { min: DESCRIPTION.MIN })),
    steps: z
      .array(stepSchema)
      .min(STEPS.MIN, format(v.stepsMin, { min: STEPS.MIN })),
    cookingTools: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    imageKey: z.string().optional().nullable(),
  });
};

export const recipeFormSchema = buildRecipeFormSchema(
  recipeFormMessages.ko.validation
);

export type RecipeFormSchema = ReturnType<typeof buildRecipeFormSchema>;
export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
export type IngredientPayload = RecipeFormValues["ingredients"][number];
export type StepPayload = RecipeFormValues["steps"][number];
export type ImageType = RecipeFormValues["steps"][number]["image"];

export const RECIPE_FORM_DEFAULT_VALUES: RecipeFormValues = {
  title: "",
  image: null,
  ingredients: [],
  cookingTime: undefined as unknown as number,
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
