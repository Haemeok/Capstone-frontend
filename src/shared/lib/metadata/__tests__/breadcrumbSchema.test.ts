import { createRecipeBreadcrumb } from "../breadcrumbSchema";

it("T-06 en: breadcrumb 라벨 [Recipio, Recipes, title], 한글 없음", () => {
  const b = createRecipeBreadcrumb("Kimchi Stew", "abc", "en");
  expect(b.itemListElement.map((i) => i.name)).toEqual([
    "Recipio",
    "Recipes",
    "Kimchi Stew",
  ]);
  expect(JSON.stringify(b)).not.toMatch(/[가-힣]/);
});

it("T-07 ja: 목록 라벨 レシピ + URL은 /ja/recipes", () => {
  const b = createRecipeBreadcrumb("レシピ名", "abc", "ja");
  expect(b.itemListElement[1].name).toBe("レシピ");
  expect(b.itemListElement[2].item).toMatch(/\/ja\/recipes\/abc$/);
});

it("ko 기본값 회귀: 레시피 라벨 유지 + ko URL", () => {
  const b = createRecipeBreadcrumb("김치찌개", "abc");
  expect(b.itemListElement[1].name).toBe("레시피");
  expect(b.itemListElement[2].item).not.toMatch(/\/(en|ja)\//);
});
