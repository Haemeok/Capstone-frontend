import { z } from "zod";

import type { UserPagesDict } from "@/shared/i18n/types";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

type Validation = UserPagesDict["recipeBooks"]["validation"];

export const buildRecipeBookFormSchema = (v: Validation) =>
  z.object({
    name: z.string().trim().min(1, v.nameRequired).max(50, v.nameMax),
  });

export const recipeBookFormSchema = buildRecipeBookFormSchema(
  userPagesMessages.ko.recipeBooks.validation
);

export type RecipeBookFormValues = z.infer<typeof recipeBookFormSchema>;
