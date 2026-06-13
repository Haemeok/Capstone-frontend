import { api } from "@/shared/api/client";

import { createAIRecipeJobV2 } from "../api";
import type { IngredientFocusRequest } from "../types";

jest.mock("@/shared/api/client", () => ({
  api: { post: jest.fn(async () => ({ jobId: "ai-1" })) },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const request = {
  type: "INGREDIENT_FOCUS",
  ingredients: ["감자"],
} as unknown as IngredientFocusRequest;

describe("AI recipe api lang (T-13/T-14/T-15)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("T-13: ja 생성 시 params에 lang=ja", async () => {
    await createAIRecipeJobV2(
      request,
      "INGREDIENT_FOCUS",
      "key-1",
      undefined,
      "ja"
    );
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/ai",
      { aiRequest: request },
      expect.objectContaining({
        params: expect.objectContaining({
          lang: "ja",
          concept: "INGREDIENT_FOCUS",
        }),
      })
    );
  });

  it("T-13: en 생성 시 params에 lang=en", async () => {
    await createAIRecipeJobV2(
      request,
      "INGREDIENT_FOCUS",
      "key-1",
      undefined,
      "en"
    );
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/ai",
      { aiRequest: request },
      expect.objectContaining({
        params: expect.objectContaining({ lang: "en" }),
      })
    );
  });

  it("T-14: concept가 FINE_DINING이어도 lang=ja 그대로 부착", async () => {
    await createAIRecipeJobV2(request, "FINE_DINING", "key-1", undefined, "ja");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/ai",
      { aiRequest: request },
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ja", concept: "FINE_DINING" }),
      })
    );
  });

  it("T-15: ko 생성 시 params에 lang 없음", async () => {
    await createAIRecipeJobV2(
      request,
      "INGREDIENT_FOCUS",
      "key-1",
      undefined,
      "ko"
    );
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/ai",
      { aiRequest: request },
      expect.objectContaining({
        params: expect.not.objectContaining({ lang: expect.anything() }),
      })
    );
  });
});
