jest.mock("@/shared/api/client", () => ({
  api: { get: jest.fn().mockResolvedValue([]) },
}));

import { api } from "@/shared/api/client";

import { getRecipeBooks } from "../getRecipeBooks";

describe("getRecipeBooks lang (T-08)", () => {
  afterEach(() => jest.clearAllMocks());

  it("lang을 params로 전달한다", async () => {
    await getRecipeBooks("ja");
    expect(api.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ja" }),
      })
    );
  });
});
