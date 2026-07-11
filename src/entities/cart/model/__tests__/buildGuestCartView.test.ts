import type { CoupangRecipeItem } from "@/shared/coupang";

import { buildGuestCartView } from "../buildGuestCartView";
import type { GuestCartItem } from "../guestCartStore";

const guestItems: GuestCartItem[] = [
  {
    recipeIngredientId: "ri8AbKcQ",
    name: "배추김치",
    quantity: "100",
    unit: "g",
    recipe: {
      recipeId: "r7KpQ2mA",
      title: "김치찌개",
      imageUrl: "https://example.com/r7.webp",
    },
  },
  {
    recipeIngredientId: "ri9KmQ2c",
    name: "김치",
    quantity: "1",
    unit: "큰술",
    recipe: {
      recipeId: "r7KpQ2mA",
      title: "김치찌개",
      imageUrl: "https://example.com/r7.webp",
    },
  },
  {
    recipeIngredientId: "ri4QsNwE",
    name: "수제 고추기름",
    quantity: "2",
    unit: "큰술",
    recipe: {
      recipeId: "n3Vz8WpR",
      title: "마라샹궈",
      imageUrl: "https://example.com/n3.webp",
    },
  },
];

const kimchiCoupang: CoupangRecipeItem = {
  recipeIngredientId: "ri8AbKcQ",
  coupangName: "김치",
  landingUrl: "https://link.coupang.com/kimchi",
  lastCollectedAt: "2026-07-09T03:20:15+09:00",
  products: [],
};

it("T-29: 같은 coupangName은 한 그룹으로 병합하고 미매칭·탭을 분류한다", () => {
  const byIngredientId = new Map([
    ["ri8AbKcQ", kimchiCoupang],
    ["ri9KmQ2c", { ...kimchiCoupang, recipeIngredientId: "ri9KmQ2c" }],
  ]);

  const view = buildGuestCartView(guestItems, {
    byIngredientId,
    deletedRecipeIds: new Set(),
  });

  expect(view.totalItemCount).toBe(3);
  expect(view.groups).toHaveLength(1);
  expect(view.groups[0].coupangInfo.coupangName).toBe("김치");
  expect(view.groups[0].items.map((i) => i.cartItemId)).toEqual([
    "ri8AbKcQ",
    "ri9KmQ2c",
  ]);
  expect(view.unmatchedItems.map((i) => i.name)).toEqual(["수제 고추기름"]);
  expect(view.recipes).toEqual([
    {
      recipeId: "r7KpQ2mA",
      title: "김치찌개",
      imageUrl: "https://example.com/r7.webp",
      itemCount: 2,
      deleted: false,
    },
    {
      recipeId: "n3Vz8WpR",
      title: "마라샹궈",
      imageUrl: "https://example.com/n3.webp",
      itemCount: 1,
      deleted: false,
    },
  ]);
});

it("T-30: 삭제된 레시피의 항목은 미매칭으로 강등되고 탭은 deleted 처리된다", () => {
  const byIngredientId = new Map([["ri8AbKcQ", kimchiCoupang]]);

  const view = buildGuestCartView(guestItems, {
    byIngredientId,
    deletedRecipeIds: new Set(["n3Vz8WpR"]),
  });

  const maratang = view.recipes.find((r) => r.recipeId === "n3Vz8WpR");
  expect(maratang).toMatchObject({ deleted: true, imageUrl: null });
  const chili = view.unmatchedItems.find((i) => i.name === "수제 고추기름");
  expect(chili).toBeDefined();
  expect(chili?.recipe.deleted).toBe(true);
});
