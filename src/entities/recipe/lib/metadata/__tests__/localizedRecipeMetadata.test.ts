/**
 * @jest-environment node
 */
import {
  generateLocalizedRecipeJsonLd,
  generateLocalizedRecipeMetadata,
} from "../localizedRecipeMetadata";
import { makeJpRecipe } from "./fixtures/recipeFactory";

const recipe = makeJpRecipe({
  title: "Oyakodon",
  description: "egg rice bowl",
});

it("T-30: en translated → og:locale en_US, inLanguage en, indexable, canonical en URL", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
    locale: "en",
    translated: true,
  });
  expect((meta.openGraph as { locale?: string })?.locale).toBe("en_US");
  expect(meta.robots).toEqual({ index: true, follow: true });
  expect(meta.alternates?.canonical).toBe(
    "https://www.recipio.kr/en/recipes/abc123"
  );
  const jsonLd = generateLocalizedRecipeJsonLd(recipe, "abc123", "en");
  const node = jsonLd["@graph"].find(
    (n: { "@type"?: string }) => n["@type"] === "Recipe"
  );
  expect(node?.inLanguage).toBe("en");
});

it("T-31: en not translated → noindex,nofollow + canonical 미출력", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
    locale: "en",
    translated: false,
  });
  expect(meta.robots).toEqual({ index: false, follow: false });
  expect(meta.alternates?.canonical).toBeUndefined();
});

it("T-30(ja 회귀): ja translated → og:locale ja_JP, inLanguage ja, canonical ja URL", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
    locale: "ja",
    translated: true,
  });
  expect((meta.openGraph as { locale?: string })?.locale).toBe("ja_JP");
  expect(meta.alternates?.canonical).toBe(
    "https://www.recipio.kr/ja/recipes/abc123"
  );
  const jsonLd = generateLocalizedRecipeJsonLd(recipe, "abc123", "ja");
  const node = jsonLd["@graph"].find(
    (n: { "@type"?: string }) => n["@type"] === "Recipe"
  );
  expect(node?.inLanguage).toBe("ja");
});

it("ja 미번역 회귀: translated=false → noindex,nofollow", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
    locale: "ja",
    translated: false,
  });
  expect(meta.robots).toEqual({ index: false, follow: false });
});

it("T-01 en: og:site_name=Recipio, title 접미사 Recipio", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc", {
    locale: "en",
    translated: true,
  });
  expect(meta.openGraph?.siteName).toBe("Recipio");
  expect(meta.title).toBe("Oyakodon | Recipio");
});

it("T-02 ja: og:site_name=レシピオ", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc", {
    locale: "ja",
    translated: true,
  });
  expect(meta.openGraph?.siteName).toBe("レシピオ");
});

it("T-05 en: openGraph.locale=en_US + alternateLocale ko/ja", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc", {
    locale: "en",
    translated: true,
  });
  expect(meta.openGraph?.locale).toBe("en_US");
  const openGraphWithAlternates = meta.openGraph as {
    alternateLocale?: string[];
  };
  expect(openGraphWithAlternates?.alternateLocale).toEqual(
    expect.arrayContaining(["ko_KR", "ja_JP"])
  );
});

it("T-50: translated면 alternates.languages에 ko·ja·en·x-default", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
    locale: "en",
    translated: true,
  });
  const langs = meta.alternates?.languages ?? {};
  expect(Object.keys(langs)).toEqual(
    expect.arrayContaining(["ko", "ja", "en", "x-default"])
  );
  expect(langs.en).toBe("https://www.recipio.kr/en/recipes/abc123");
  expect(langs.ko).toBe("https://www.recipio.kr/recipes/abc123");
  expect(langs.ja).toBe("https://www.recipio.kr/ja/recipes/abc123");
});

it("T-51: not translated(noindex)면 languages를 광고하지 않는다", () => {
  const meta = generateLocalizedRecipeMetadata(recipe, "abc123", {
    locale: "en",
    translated: false,
  });
  expect(meta.alternates?.languages).toBeUndefined();
});
