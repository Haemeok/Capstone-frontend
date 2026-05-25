import type { StaticRecipe } from "@/entities/recipe/model/types";

import type { ParsedBlogBody } from "./parseBlogBody";
import {
  type BlogTone,
  buildOutroSuffix,
  buildSectionFragments,
  toneHeading,
} from "./toneInserts";

export const buildStepsBlock = (recipe: StaticRecipe): string =>
  recipe.steps
    .filter((s) => s.instruction.trim().length > 0)
    .map((s) => `${s.stepNumber}. ${s.instruction.trim()}`)
    .join("\n");

export const assembleBlogBody = (
  parsed: ParsedBlogBody,
  recipes: StaticRecipe[],
  tone: BlogTone,
  slug: string,
): string => {
  const blocks: string[] = [];

  blocks.push(`<!-- intro -->\n${parsed.intro}`);

  parsed.sections.forEach((section, i) => {
    const recipe = recipes[i];
    const headingText = toneHeading(tone, i, recipe.title);
    const fragments = buildSectionFragments(tone, recipe);
    const stepsBlock = buildStepsBlock(recipe);

    const parts: string[] = [
      `<!-- recipe:${recipe.id} -->`,
      `## ${headingText}`,
    ];
    if (fragments.beforeBody) parts.push("", fragments.beforeBody);
    if (section.body) parts.push("", section.body);
    parts.push("", `{{ingredients:${recipe.id}}}`);
    if (stepsBlock) parts.push("", stepsBlock);
    if (fragments.afterBody) parts.push("", fragments.afterBody);
    parts.push("", `{{nutrition:${recipe.id}}}`);

    blocks.push(parts.join("\n"));
  });

  const outro = `${parsed.outro}\n\n${buildOutroSuffix(tone, slug)}`;
  blocks.push(`<!-- outro -->\n${outro}`);

  return blocks.join("\n\n");
};
