/**
 * @jest-environment node
 */
import type { Robots } from "next/dist/lib/metadata/types/metadata-types";

import { generateLocalizedRecipeMetadata } from "../localizedRecipeMetadata";
import { generateRecipeMetadata } from "../recipeMetadata";
import { makeBaseRecipe, makeJpRecipe } from "./fixtures/recipeFactory";

const robotsOf = (robots: unknown) => robots as Robots;

describe("리믹스 레시피 상세 noindex (ko)", () => {
  it("isRemix면 robots·googleBot 모두 noindex, follow는 유지한다", () => {
    const meta = generateRecipeMetadata(
      makeBaseRecipe({ isRemix: true, isIndexed: true }),
      "remix-1"
    );
    const robots = robotsOf(meta.robots);

    expect(robots.index).toBe(false);
    expect(robots.follow).toBe(true);
    expect(robotsOf(robots.googleBot).index).toBe(false);
  });

  it("isRemix가 아니면 기존 index 정책을 그대로 따른다", () => {
    const meta = generateRecipeMetadata(
      makeBaseRecipe({ isIndexed: true }),
      "plain-1"
    );
    const robots = robotsOf(meta.robots);

    expect(robots.index).toBe(true);
    expect(robotsOf(robots.googleBot).index).toBe(true);
  });
});

describe("리믹스 레시피 상세 noindex (ja/en)", () => {
  it.each(["ja", "en"] as const)(
    "%s: 번역·isIndexed여도 isRemix면 noindex + canonical/languages 미출력",
    (locale) => {
      const meta = generateLocalizedRecipeMetadata(
        makeJpRecipe({ isRemix: true, isIndexed: true }),
        "remix-1",
        { locale, translated: true }
      );

      expect(meta.robots).toEqual({ index: false, follow: true });
      expect(meta.alternates?.canonical).toBeUndefined();
      expect(meta.alternates?.languages).toBeUndefined();
    }
  );

  it("isRemix가 아니면 번역된 레시피는 그대로 index된다", () => {
    const meta = generateLocalizedRecipeMetadata(
      makeJpRecipe({ isIndexed: true }),
      "plain-1",
      { locale: "ja", translated: true }
    );

    expect(meta.robots).toEqual({ index: true, follow: true });
    expect(meta.alternates?.canonical).toBe(
      "https://www.recipio.kr/ja/recipes/plain-1"
    );
  });
});
