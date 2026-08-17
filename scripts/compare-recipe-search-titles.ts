import { parse } from "node-html-parser";

import { selectDistinctiveIngredient } from "../src/entities/recipe/lib/metadata/ingredientTitle";
import { generateRecipeMetadata } from "../src/entities/recipe/lib/metadata/recipeMetadata";
import { toRecipe } from "../src/entities/recipe/model/toRecipe";
import type {
  RawRecipeResponse,
  StaticRecipe,
} from "../src/entities/recipe/model/types";

const API_ORIGIN = "https://api.recipio.kr/api";
const SITE_ORIGIN = "https://www.recipio.kr";
const SAMPLE_SIZE = 10;
const CANDIDATE_SIZE = 30;

type SearchResponse = {
  content: Array<{ id: string }>;
};

type RecipeComparisonRow = {
  id: string;
  recipeTitle: string;
  distinctiveIngredient: string;
  beforeSearchTitle: string;
  afterSearchTitle: string;
  beforeLength: number;
  afterLength: number;
};

type RecipeComparisonDependencies = {
  fetchCandidateIds: () => Promise<string[]>;
  fetchRecipe: (id: string) => Promise<StaticRecipe>;
  fetchCurrentTitle: (id: string) => Promise<string>;
};

type RecipeComparisonResult = {
  rows: RecipeComparisonRow[];
  failures: Array<{ id: string; reason: string }>;
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
};

const fetchCandidateIds = async (): Promise<string[]> => {
  const search = await fetchJson<SearchResponse>(
    `${API_ORIGIN}/recipes/search?page=0&size=${CANDIDATE_SIZE}&sort=createdAt,desc`
  );
  return search.content.map(({ id }) => id);
};

const fetchRecipe = async (id: string): Promise<StaticRecipe> => {
  const raw = await fetchJson<RawRecipeResponse>(`${API_ORIGIN}/recipes/${id}`);
  return toRecipe(raw) as StaticRecipe;
};

const fetchCurrentTitle = async (id: string): Promise<string> => {
  const response = await fetch(`${SITE_ORIGIN}/recipes/${id}`);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const title = parse(await response.text())
    .querySelector("title")
    ?.innerText.trim();
  if (!title) {
    throw new Error("title not found");
  }
  return title;
};

export const collectRecipeComparisons = async (
  dependencies: RecipeComparisonDependencies,
  sampleSize: number
): Promise<RecipeComparisonResult> => {
  const candidateIds = await dependencies.fetchCandidateIds();
  const rows: RecipeComparisonRow[] = [];
  const failures: RecipeComparisonResult["failures"] = [];

  for (const id of candidateIds) {
    if (rows.length === sampleSize) break;

    try {
      const recipe = await dependencies.fetchRecipe(id);
      const beforeSearchTitle = await dependencies.fetchCurrentTitle(id);
      const afterSearchTitle = String(generateRecipeMetadata(recipe, id).title);

      rows.push({
        id,
        recipeTitle: recipe.title,
        distinctiveIngredient: selectDistinctiveIngredient(recipe) ?? "없음",
        beforeSearchTitle,
        afterSearchTitle,
        beforeLength: beforeSearchTitle.length,
        afterLength: afterSearchTitle.length,
      });
    } catch (error) {
      failures.push({
        id,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (rows.length < sampleSize) {
    throw new Error(`성공 표본 부족: ${rows.length}/${sampleSize}`);
  }

  return { rows, failures };
};

const main = async (): Promise<void> => {
  const result = await collectRecipeComparisons(
    { fetchCandidateIds, fetchRecipe, fetchCurrentTitle },
    SAMPLE_SIZE
  );
  console.table(result.rows);
  if (result.failures.length > 0) {
    console.table(result.failures);
  }
};

if (require.main === module) {
  void main();
}
