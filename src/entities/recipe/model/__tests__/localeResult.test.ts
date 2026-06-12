/**
 * @jest-environment node
 */
import { parseLocalizedRecipeResult } from "../localeResult";

describe("parseLocalizedRecipeResult — status+code로 locale 결과 판별", () => {
  it("T-01: 200 + 본문이면 ok와 recipe를 반환한다", () => {
    const result = parseLocalizedRecipeResult(200, { title: "親子丼" });
    expect(result.kind).toBe("ok");
    if (result.kind === "ok") expect(result.recipe.title).toBe("親子丼");
  });

  it("T-09: 404 + code 213이면 notTranslated와 ja 메시지를 반환한다", () => {
    const result = parseLocalizedRecipeResult(404, {
      code: "213",
      message: "このレシピはまだ翻訳されていません。",
    });
    expect(result.kind).toBe("notTranslated");
    if (result.kind === "notTranslated")
      expect(result.message).toBe("このレシピはまだ翻訳されていません。");
  });

  it("T-13: 404 + code 201이면 notFound다", () => {
    expect(parseLocalizedRecipeResult(404, { code: "201" }).kind).toBe(
      "notFound"
    );
  });

  it("T-14: 403이면 notFound다", () => {
    expect(parseLocalizedRecipeResult(403, { code: "210" }).kind).toBe(
      "notFound"
    );
  });
});
