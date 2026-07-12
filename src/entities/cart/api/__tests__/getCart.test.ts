jest.mock("@/shared/api/client", () => ({ api: { get: jest.fn() } }));

import { api } from "@/shared/api/client";

import { getCart } from "../getCart";

const getMock = api.get as jest.Mock;

it("서버가 quantity/unit에 null을 내려주면 빈 문자열로 정규화한다", async () => {
  getMock.mockResolvedValue({
    totalItemCount: 2,
    recipes: [],
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
            cartItemId: "c8Ab7XyZ",
            name: "신김치",
            quantity: null,
            unit: null,
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
        unit: null,
        recipe: { recipeId: "n3Vz8WpR", title: "마라샹궈", deleted: false },
      },
    ],
  });

  const cart = await getCart("ko");

  expect(cart.groups[0].items[0]).toMatchObject({ quantity: "", unit: "" });
  expect(cart.unmatchedItems[0]).toMatchObject({ quantity: "2", unit: "" });
});

it("조회 URL에 현재 앱 언어를 lang으로 붙인다 (T-09)", async () => {
  getMock.mockResolvedValue({
    totalItemCount: 0,
    recipes: [],
    groups: [],
    unmatchedItems: [],
  });

  await getCart("ja");

  expect(getMock).toHaveBeenCalledWith("/me/cart?lang=ja");
});
