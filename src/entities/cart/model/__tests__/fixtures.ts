import type { CartResponse } from "@/entities/cart/api";

// 핸드오프 문서(2026-07-09)의 GET /api/me/cart 예시 축약판
export const cartFixture: CartResponse = {
  totalItemCount: 5,
  recipes: [
    {
      recipeId: "r7KpQ2mA",
      title: "김치찌개",
      imageUrl: "https://example.com/r7.webp",
      itemCount: 3,
      deleted: false,
    },
    {
      recipeId: "b9Lx2QaZ",
      title: "김치볶음밥",
      imageUrl: null,
      itemCount: 1,
      deleted: true,
    },
    {
      recipeId: "n3Vz8WpR",
      title: "마라샹궈",
      imageUrl: "https://example.com/n3.webp",
      itemCount: 1,
      deleted: false,
    },
  ],
  groups: [
    {
      coupangInfo: {
        coupangName: "김치",
        landingUrl: "https://link.coupang.com/kimchi",
        lastCollectedAt: "2026-07-09T03:20:15+09:00",
        products: [
          {
            rank: 1,
            name: "종가집 포기김치 1kg",
            price: 12900,
            imageUrl: "https://example.com/p1.jpg",
            url: "https://link.coupang.com/p1",
            categoryName: "식품",
            rocket: true,
            freeShipping: false,
          },
          {
            rank: 2,
            name: "비비고 썰은배추김치 500g",
            price: 7900,
            imageUrl: "https://example.com/p2.jpg",
            url: "https://link.coupang.com/p2",
            categoryName: "식품",
            rocket: false,
            freeShipping: true,
          },
        ],
      },
      items: [
        {
          cartItemId: "c9Lm2PqA",
          name: "김치",
          quantity: "1",
          unit: "큰술",
          recipe: { recipeId: "b9Lx2QaZ", title: "김치볶음밥", deleted: true },
        },
        {
          cartItemId: "c8Ab7XyZ",
          name: "배추김치",
          quantity: "100",
          unit: "g",
          recipe: { recipeId: "r7KpQ2mA", title: "김치찌개", deleted: false },
        },
      ],
    },
    {
      coupangInfo: {
        coupangName: "돼지고기 앞다리살",
        landingUrl: "https://link.coupang.com/pork",
        lastCollectedAt: "2026-07-09T02:11:00+09:00",
        products: [
          {
            rank: 1,
            name: "한돈 앞다리살 전지 1kg",
            price: 12900,
            imageUrl: "https://example.com/p3.jpg",
            url: "https://link.coupang.com/p3",
            categoryName: "식품",
            rocket: true,
            freeShipping: false,
          },
        ],
      },
      items: [
        {
          cartItemId: "c6Rt4MnB",
          name: "돼지고기",
          quantity: "60",
          unit: "g",
          recipe: { recipeId: "r7KpQ2mA", title: "김치찌개", deleted: false },
        },
      ],
    },
    {
      coupangInfo: {
        coupangName: "대파",
        landingUrl: "https://link.coupang.com/daepa",
        lastCollectedAt: "2026-07-09T01:03:45+09:00",
        products: [],
      },
      items: [
        {
          cartItemId: "c5Uv1GhD",
          name: "대파",
          quantity: "1/2",
          unit: "대",
          recipe: { recipeId: "r7KpQ2mA", title: "김치찌개", deleted: false },
        },
      ],
    },
  ],
  unmatchedItems: [
    {
      cartItemId: "c4Qs9NwE",
      name: "수제 고추기름",
      quantity: "2",
      unit: "큰술",
      recipe: { recipeId: "n3Vz8WpR", title: "마라샹궈", deleted: false },
    },
  ],
};

// 같은 재료(신김치)를 두 레시피에서 담은 케이스 — 이름 그룹핑 + 총량 합산 검증용
export const sameIngredientCartFixture: CartResponse = {
  totalItemCount: 2,
  recipes: [
    {
      recipeId: "r7KpQ2mA",
      title: "김치찌개",
      imageUrl: null,
      itemCount: 1,
      deleted: false,
    },
    {
      recipeId: "z2Cd5TeF",
      title: "김치전",
      imageUrl: null,
      itemCount: 1,
      deleted: false,
    },
  ],
  groups: [
    {
      coupangInfo: {
        coupangName: "신김치",
        landingUrl: "https://link.coupang.com/kimchi",
        lastCollectedAt: "2026-07-09T03:20:15+09:00",
        products: [],
      },
      items: [
        {
          cartItemId: "c2Fg6JkL",
          name: "신김치",
          quantity: "200",
          unit: "g",
          recipe: { recipeId: "r7KpQ2mA", title: "김치찌개", deleted: false },
        },
        {
          cartItemId: "c3Hj8PqS",
          name: "신김치",
          quantity: "100",
          unit: "g",
          recipe: { recipeId: "z2Cd5TeF", title: "김치전", deleted: false },
        },
      ],
    },
  ],
  unmatchedItems: [],
};

export const emptyCartFixture: CartResponse = {
  totalItemCount: 0,
  recipes: [],
  groups: [],
  unmatchedItems: [],
};
