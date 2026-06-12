export type Plural = { one: string; other: string };

export type Locale = "ko" | "ja" | "en";
export const LOCALES: readonly Locale[] = ["ko", "ja", "en"];

export type Dictionary = {
  errors: {
    sectionGeneric: string;
    video: string;
    comments: string;
    ingredients: string;
    steps: string;
    searchResults: string;
  };
};
