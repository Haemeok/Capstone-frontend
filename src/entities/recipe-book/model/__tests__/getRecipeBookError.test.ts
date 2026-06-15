import { ApiError } from "@/shared/api/client";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { getRecipeBookError } from "../errorMessages";

const apiError = (code: number) => new ApiError(400, "Bad Request", { code });

describe("getRecipeBookError", () => {
  it("1107 → {code, ja 중복메시지} (T-22)", () => {
    const r = getRecipeBookError(apiError(1107), "ja");
    expect(r.code).toBe(1107);
    expect(r.message).toBe(userPagesMessages.ja.recipeBooks.errors[1107]);
  });
  it("1104 → {code, ja 기본책메시지} (T-23)", () => {
    expect(getRecipeBookError(apiError(1104), "ja")).toEqual({
      code: 1104,
      message: userPagesMessages.ja.recipeBooks.errors[1104],
    });
  });
  it("미매핑/비ApiError → ja fallback (T-24)", () => {
    expect(getRecipeBookError(apiError(9999), "ja").message).toBe(
      userPagesMessages.ja.recipeBooks.errors.fallback
    );
    expect(getRecipeBookError(new Error("x"), "ja")).toEqual({
      code: null,
      message: userPagesMessages.ja.recipeBooks.errors.fallback,
    });
  });
  it("ko: 1107 한국어 메시지 (T-28)", () => {
    expect(getRecipeBookError(apiError(1107), "ko").message).toBe(
      userPagesMessages.ko.recipeBooks.errors[1107]
    );
  });
});
