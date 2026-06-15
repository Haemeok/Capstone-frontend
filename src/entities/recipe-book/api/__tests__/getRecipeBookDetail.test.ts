jest.mock("@/shared/api/client", () => ({
  api: {
    get: jest.fn().mockResolvedValue({
      id: "b1",
      name: "집밥",
      default: false,
      recipeCount: 0,
      recipes: [],
      hasNext: false,
    }),
  },
}));

import { api } from "@/shared/api/client";

import { getRecipeBookDetail } from "../getRecipeBookDetail";

describe("getRecipeBookDetail lang", () => {
  afterEach(() => jest.clearAllMocks());

  it("ja에서 lang=ja를 params로 전달한다 (T-05)", async () => {
    await getRecipeBookDetail("b1", { lang: "ja" });
    expect(api.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ja" }),
      })
    );
  });

  it("ko에서 lang=ko를 params로 전달한다 (T-06)", async () => {
    await getRecipeBookDetail("b1", { lang: "ko" });
    expect(api.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ko" }),
      })
    );
  });
});
