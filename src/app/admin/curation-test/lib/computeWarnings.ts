import type { CurationParams, CurationWarning } from "@/entities/curation";

type RecipeForWarning = {
  ingredients?: Array<{ id?: string; name: string }>;
};

const splitSections = (markdown: string): string[] => {
  const parts = markdown.split(/^## /m);
  return parts.slice(1);
};

const findMissingSections = (sections: string[], keyword: string): number[] => {
  const needle = keyword.toLowerCase();
  const missing: number[] = [];
  sections.forEach((s, i) => {
    if (!s.toLowerCase().includes(needle)) missing.push(i);
  });
  return missing;
};

const resolveIngredientName = (
  code: string,
  recipes: RecipeForWarning[]
): string | null => {
  for (const r of recipes) {
    const found = r.ingredients?.find((ing) => ing.id === code);
    if (found) return found.name;
  }
  return null;
};

export const computeWarnings = ({
  markdown,
  params,
  recipes,
  expectedSectionCount,
}: {
  markdown: string;
  params: CurationParams;
  recipes: RecipeForWarning[];
  expectedSectionCount: number;
}): CurationWarning[] => {
  const sections = splitSections(markdown);
  if (sections.length !== expectedSectionCount) {
    console.warn(
      `[computeWarnings] section count mismatch: got ${sections.length}, expected ${expectedSectionCount}`
    );
    return [];
  }

  const out: CurationWarning[] = [];

  const q = params.q;
  if (typeof q === "string" && q.trim().length > 0) {
    const missing = findMissingSections(sections, q.trim());
    if (missing.length > 0) {
      out.push({
        kind: "missing-keyword",
        source: "q",
        keyword: q,
        missingSections: missing,
      });
    }
  }

  const ingredientId = params.ingredientIds;
  if (typeof ingredientId === "string" && ingredientId.length > 0) {
    const name = resolveIngredientName(ingredientId, recipes);
    if (!name) {
      console.warn(
        `[computeWarnings] unresolved ingredientId: ${ingredientId}`
      );
    } else {
      const missing = findMissingSections(sections, name);
      if (missing.length > 0) {
        out.push({
          kind: "missing-keyword",
          source: "ingredientIds",
          keyword: name,
          missingSections: missing,
        });
      }
    }
  }

  return out;
};
