jest.mock("@/shared/api/client", () => ({ api: { post: jest.fn() } }));

import { api } from "@/shared/api/client";

import { addCartItems } from "../addCartItems";

const postMock = api.post as jest.Mock;

it("추가 URL에 lang을 붙이고 body에는 lang을 넣지 않는다 (T-10)", async () => {
  postMock.mockResolvedValue({
    addedCount: 1,
    skippedCount: 0,
    cartItemIds: [],
  });
  const body = { items: [{ recipeIngredientId: "KelNMQOw" }] };

  await addCartItems(body, "ja");

  expect(postMock).toHaveBeenCalledWith("/me/cart/items?lang=ja", body);
  expect(JSON.stringify(body)).not.toContain("lang");
});
