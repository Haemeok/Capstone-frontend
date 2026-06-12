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
