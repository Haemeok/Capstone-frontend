import { generateLocalizedIngredientMetadata } from "@/entities/ingredient/lib/metadata/localizedIngredientMetadata";
import type { IngredientDetailView } from "@/entities/ingredient/model/types";
import { generateLocalizedRecipeMetadata } from "@/entities/recipe/lib/metadata/localizedRecipeMetadata";
import type { StaticRecipe } from "@/entities/recipe/model/types";

import { metadata as enMetadata } from "../en/layout";
import { metadata as jaMetadata } from "../ja/layout";

const LOCALES = ["en", "ja"] as const;

const recipe = {
  id: "r1",
  title: "Kimchi Stew",
  description: "desc",
  imageUrl: "https://cdn.example.com/a.jpg",
  isIndexed: true,
} as unknown as StaticRecipe;

const ingredient = {
  id: "i1",
  name: "Onion",
} as unknown as IngredientDetailView;

describe("ja/en 네이버(Yeti) noindex", () => {
  it.each(LOCALES)(
    "T-201: %s 로케일 레이아웃이 Yeti noindex,follow 메타를 내보낸다",
    (locale) => {
      const metadata = locale === "ja" ? jaMetadata : enMetadata;
      expect(metadata.other).toEqual({ Yeti: "noindex, follow" });
    }
  );

  it.each(LOCALES)(
    "T-202: %s 레시피 상세는 other를 정의하지 않아 레이아웃의 Yeti 태그가 살아남는다",
    (locale) => {
      const metadata = generateLocalizedRecipeMetadata(recipe, "r1", {
        locale,
        translated: true,
      });
      expect(metadata.other).toBeUndefined();
    }
  );

  it.each(LOCALES)(
    "T-203: %s 재료 상세는 other를 정의하지 않아 레이아웃의 Yeti 태그가 살아남는다",
    (locale) => {
      const metadata = generateLocalizedIngredientMetadata(ingredient, 3, {
        locale,
        translated: true,
      });
      expect(metadata.other).toBeUndefined();
    }
  );
});
