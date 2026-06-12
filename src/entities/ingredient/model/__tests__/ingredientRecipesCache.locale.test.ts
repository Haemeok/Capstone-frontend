import { api } from "@/shared/api/client";

import { getIngredientDetail } from "../api";
import { ingredientRecipesQueryKey } from "../hooks";

jest.mock("@/shared/api/client", () => ({
  api: { get: jest.fn().mockResolvedValue({ id: "ing1", recipes: [] }) },
}));

describe("ingredientRecipesQueryKey — 로케일 분리", () => {
  it("T-04: ja/ko queryKey가 다르고 ja 키가 ja로 끝난다", () => {
    const ko = ingredientRecipesQueryKey("ing1", "ko");
    const ja = ingredientRecipesQueryKey("ing1", "ja");
    expect(ja).not.toEqual(ko);
    expect(ja[ja.length - 1]).toBe("ja");
  });

  it("T-04: ko 키엔 로케일 토큰이 없다(루트 캐시와 동일)", () => {
    expect(ingredientRecipesQueryKey("ing1", "ko")).toEqual(
      ingredientRecipesQueryKey("ing1")
    );
  });
});

describe("getIngredientDetail — lang 전파", () => {
  it("T-05: ja면 params.lang=ja로 호출한다", async () => {
    await getIngredientDetail("ing1", "ja");
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining("ing1"), {
      params: { lang: "ja" },
    });
  });

  it("T-05: ko면 lang 없이 호출한다", async () => {
    (api.get as jest.Mock).mockClear();
    await getIngredientDetail("ing1", "ko");
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining("ing1"));
  });
});
