jest.mock("@/shared/api/client", () => ({
  api: { get: jest.fn().mockResolvedValue([]) },
}));

import { api } from "@/shared/api/client";

import { getRecipeHistoryItems } from "../api";

describe("getRecipeHistoryItems lang (T-12)", () => {
  afterEach(() => jest.clearAllMocks());

  it("lang을 params로 전달한다", async () => {
    await getRecipeHistoryItems("2026-05-03", "ja");
    expect(api.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ja" }),
      })
    );
  });
});
