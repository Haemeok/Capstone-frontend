/**
 * @jest-environment node
 */
import { getSameIngredientOnServer } from "../api.server";

describe("getSameIngredientOnServer (T-FETCH-recipeId)", () => {
  it("URL에 recipeId 포함 + ingredientName 반환", async () => {
    const body = { ingredientName: "감자", content: [] };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => body,
    }) as unknown as typeof fetch;
    const out = await getSameIngredientOnServer("rec-123", "ko");
    expect(String((global.fetch as jest.Mock).mock.calls[0][0])).toContain(
      "/dev/recipes/rec-123/same-ingredient"
    );
    expect(out.ingredientName).toBe("감자");
  });
  it("실패하면 빈 fallback", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;
    expect((await getSameIngredientOnServer("rec-123", "ko")).content).toEqual(
      []
    );
  });
});
