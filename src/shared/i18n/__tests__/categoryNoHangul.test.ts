import { categoryMessages } from "../categoryMessages";
import type { Locale } from "../types";

const HANGUL = /[가-힣]/;

const collectStrings = (value: unknown, acc: string[] = []): string[] => {
  if (typeof value === "string") acc.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, acc));
  else if (value && typeof value === "object")
    Object.values(value).forEach((v) => collectStrings(v, acc));
  return acc;
};

describe("category dict no-Hangul guard", () => {
  it.each<Locale>(["ja", "en"])(
    "%s category dict에 한글이 남아있지 않다",
    (locale) => {
      const offenders = collectStrings(categoryMessages[locale]).filter((s) =>
        HANGUL.test(s)
      );
      expect(offenders).toEqual([]);
    }
  );
});
