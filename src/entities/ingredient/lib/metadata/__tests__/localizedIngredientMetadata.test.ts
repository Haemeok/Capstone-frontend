import type { IngredientDetailView } from "../../../model/types";
import {
  generateLocalizedIngredientJsonLd,
  generateLocalizedIngredientMetadata,
} from "../localizedIngredientMetadata";

const detail: IngredientDetailView = {
  id: "ing1",
  name: "Onion",
  imageUrl: null,
  categoryLabel: null,
  storage: { location: null, temperature: null, duration: null, notes: null },
  pairings: { good: [], bad: [] },
  cookingMethods: [],
  coupangLink: null,
  coupang: null,
  nutrition: null,
  seasonMonths: [],
  benefits: null,
};

it("T-20: 번역됨이면 self-canonical(/ja)·hreflang(ko/ja/en)·index", () => {
  const meta = generateLocalizedIngredientMetadata(detail, 3, {
    locale: "ja",
    translated: true,
  });
  expect(meta.alternates?.canonical).toContain("/ja/ingredients/ing1");
  const langs = meta.alternates?.languages ?? {};
  expect(Object.keys(langs)).toEqual(
    expect.arrayContaining(["ko", "ja", "en"])
  );
  expect(meta.robots).toMatchObject({ index: true });
});

it("T-21: 미번역이면 robots noindex", () => {
  const meta = generateLocalizedIngredientMetadata(detail, 0, {
    locale: "ja",
    translated: false,
  });
  expect(meta.robots).toMatchObject({ index: false });
});

it("T-22: JSON-LD ItemList 노드에 inLanguage=locale", () => {
  const jsonLd = generateLocalizedIngredientJsonLd(detail, [], "ja");
  const graph = jsonLd["@graph"] as Array<Record<string, unknown>>;
  const node = graph.find((n) => n["@type"] === "ItemList");
  expect(node?.["inLanguage"]).toBe("ja");
});

it("T-23: JSON-LD에 WebPage 노드(about=Thing)가 locale로 포함된다", () => {
  const jsonLd = generateLocalizedIngredientJsonLd(detail, [], "ja");
  const graph = jsonLd["@graph"] as Array<Record<string, unknown>>;
  const webPage = graph.find((n) => n["@type"] === "WebPage");
  expect(webPage?.["inLanguage"]).toBe("ja");
  expect((webPage?.["about"] as Record<string, unknown>)?.["@type"]).toBe(
    "Thing"
  );
});
