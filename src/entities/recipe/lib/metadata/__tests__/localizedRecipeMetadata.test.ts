/**
 * @jest-environment node
 */
import {
  generateLocalizedRecipeJsonLd,
  generateLocalizedRecipeMetadata,
} from "../localizedRecipeMetadata";
import { generateRecipeJsonLd } from "../recipeMetadata";
import { makeBaseRecipe, makeJpRecipe } from "./fixtures/recipeFactory";

const recipe = makeJpRecipe({
  title: "Oyakodon",
  description: "egg rice bowl",
  isIndexed: true,
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

it("T-32: en translated지만 isIndexed 아님 → noindex,follow + canonical/languages 미출력", () => {
  const notIndexed = makeJpRecipe({
    title: "Oyakodon",
    description: "egg rice bowl",
    isIndexed: false,
  });
  const meta = generateLocalizedRecipeMetadata(notIndexed, "abc123", {
    locale: "en",
    translated: true,
  });
  expect(meta.robots).toEqual({ index: false, follow: true });
  expect(meta.alternates?.canonical).toBeUndefined();
  expect(meta.alternates?.languages).toBeUndefined();
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
  expect(meta.title).toBe("Oyakodon by きょうの料理 | Recipio");
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

const recipeNode = (jsonLd: ReturnType<typeof generateLocalizedRecipeJsonLd>) =>
  jsonLd["@graph"].find(
    (n: { "@type"?: string }) => n["@type"] === "Recipe"
  ) as Record<string, unknown> | undefined;

it("T-08/09 en: 모든 url에 /en/recipes, step url #step-1", () => {
  const r = makeBaseRecipe({
    steps: [
      {
        stepNumber: 1,
        instruction: "s1",
        stepImageUrl: "",
        stepImageKey: null,
      },
    ],
  });
  const jl = generateLocalizedRecipeJsonLd(r, "abc", "en");
  expect(JSON.stringify(jl)).not.toMatch(/recipio\.kr\/recipes\//);
  const node = recipeNode(jl);
  expect((node?.recipeInstructions as Array<{ url: string }>)[0].url).toMatch(
    /\/en\/recipes\/abc#step-1$/
  );
  expect(node?.url).toMatch(/\/en\/recipes\/abc$/);
});

it("T-10 ko 회귀: url에 /en|/ja 없음", () => {
  const jl = generateRecipeJsonLd(makeBaseRecipe({}), "abc");
  expect(JSON.stringify(jl)).not.toMatch(/\/(en|ja)\/recipes/);
});

it("T-11 en, savings>0: description에 cost prefix 없음", () => {
  const r = makeBaseRecipe({
    marketPrice: 5000,
    totalIngredientCost: 4000,
    description: "Tasty pickles.",
  });
  const node = recipeNode(generateLocalizedRecipeJsonLd(r, "abc", "en"));
  expect(node?.description).toBe("Tasty pickles.");
  expect(node?.description as string).not.toMatch(/절약/);
});

it("T-12 ko, savings>0: cost prefix 유지", () => {
  const r = makeBaseRecipe({
    marketPrice: 5000,
    totalIngredientCost: 4000,
    description: "맛있는 피클.",
  });
  const node = (
    generateRecipeJsonLd(r, "abc")["@graph"] as Array<Record<string, unknown>>
  ).find((n) => n["@type"] === "Recipe");
  expect(node?.description as string).toMatch(/^\[1,000원 절약 레시피\] /);
});

it("T-13 en, youtubeUrl 有: VideoObject.name에 만들기 없음", () => {
  const r = makeBaseRecipe({
    youtubeUrl: "https://youtu.be/x",
    title: "Pickles",
    youtubeChannelName: undefined as unknown as string,
    youtubeVideoTitle: undefined as unknown as string,
    youtubeThumbnailUrl: undefined as unknown as string,
  });
  const node = recipeNode(generateLocalizedRecipeJsonLd(r, "abc", "en"));
  expect(JSON.stringify(node?.video)).not.toMatch(/만들기/);
});

it("T-13b en, youtube 풀메타: video 노드 한국어 없음", () => {
  const r = makeBaseRecipe({
    youtubeUrl: "https://youtu.be/x",
    youtubeChannelName: "SomeChef",
    youtubeSubscriberCount: 1200000,
    title: "Pickles",
    description: "Tasty.",
    tags: ["salad", "quick"],
  });
  const jsonLd = generateLocalizedRecipeJsonLd(r, "abc", "en");
  const node = recipeNode(jsonLd);
  expect(JSON.stringify(node?.video)).not.toMatch(/[가-힣]/);
});
