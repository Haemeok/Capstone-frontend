/**
 * @jest-environment node
 */
import {
  generateJaRecipeJsonLd,
  generateJaRecipeMetadata,
} from "../jaRecipeMetadata";
import { makeJpRecipe } from "./fixtures/recipeFactory";

describe("generateJaRecipeMetadata — 번역된 ja 상세", () => {
  const recipe = makeJpRecipe({ title: "親子丼", description: "ふわとろ卵丼" });

  it("T-04: translated면 robots index,follow + canonical은 ja URL 자신이다", () => {
    const meta = generateJaRecipeMetadata(recipe, "abc123", {
      translated: true,
    });
    expect(meta.robots).toEqual({ index: true, follow: true });
    expect(meta.alternates?.canonical).toBe(
      "https://www.recipio.kr/ja/recipes/abc123"
    );
  });

  it("T-05: title은 번역 제목에서 나오고 한국어 훅 브래킷이 없다", () => {
    const meta = generateJaRecipeMetadata(recipe, "abc123", {
      translated: true,
    });
    expect(meta.title).toContain("親子丼");
    expect(String(meta.title)).not.toContain("현지레시피");
    expect(String(meta.title)).not.toContain("분 완성");
  });

  it("T-06: og:locale은 ja_JP, jsonld Recipe 노드 inLanguage는 ja", () => {
    const meta = generateJaRecipeMetadata(recipe, "abc123", {
      translated: true,
    });
    expect((meta.openGraph as { locale?: string })?.locale).toBe("ja_JP");

    const jsonLd = generateJaRecipeJsonLd(recipe, "abc123");
    const recipeNode = jsonLd["@graph"].find(
      (n: { "@type"?: string }) => n["@type"] === "Recipe"
    );
    expect(recipeNode?.inLanguage).toBe("ja");
  });
});

describe("generateJaRecipeMetadata — 미번역 fallback", () => {
  it("T-11: translated=false면 robots noindex,nofollow + canonical 미출력", () => {
    const recipe = makeJpRecipe({ title: "親子丼" });
    const meta = generateJaRecipeMetadata(recipe, "abc123", {
      translated: false,
    });
    expect(meta.robots).toEqual({ index: false, follow: false });
    expect(meta.alternates?.canonical).toBeUndefined();
  });
});
