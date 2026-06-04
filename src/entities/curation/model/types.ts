import type { CurationCategory } from "./categories";

export type CurationParams = Record<string, string | number>;

export type ToneSeed = "friendly" | "editorial";

export type CurationErrorCode =
  | "INSUFFICIENT_RECIPES"
  | "VALIDATION_FAILED"
  | "LLM_ERROR";

export class CurationError extends Error {
  constructor(
    public readonly code: CurationErrorCode,
    message: string,
    public readonly meta?: Record<string, unknown>
  ) {
    super(message);
    this.name = "CurationError";
  }
}

export type GenerateCurationInput = {
  params: CurationParams;
  recipeCount?: number;
  forceToneSeed?: ToneSeed;
};

export type CurationWarning = {
  kind: "missing-keyword";
  source: "q" | "ingredientIds";
  keyword: string;
  missingSections: number[];
};

export type GenerateCurationOutput = {
  slug: string;
  h1: string;
  dek: string;
  markdown: string;
  recipeIds: string[];
  toneSeed: ToneSeed;
  thumbnailUrl: string;
  provider: string;
  category: CurationCategory;
  coverImageKey: string | null;
  warnings: CurationWarning[];
};

export type SavedCurationRecord = GenerateCurationOutput & {
  savedAt: string;
};
