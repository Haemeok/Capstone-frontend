import { buildCategoryMetadata } from "../buildCategoryMetadata";

describe("buildCategoryMetadata", () => {
  it("T-09: ja -> ja title + noindex", async () => {
    const meta = await buildCategoryMetadata(
      Promise.resolve({ id: "CHEF_RECIPE" }),
      "ja"
    );
    expect(/[가-힣]/.test(String(meta.title))).toBe(false);
    expect(meta.robots).toMatchObject({ index: false });
  });

  it("T-10: ko -> Korean title preserved", async () => {
    const meta = await buildCategoryMetadata(
      Promise.resolve({ id: "CHEF_RECIPE" }),
      "ko"
    );
    expect(/[가-힣]/.test(String(meta.title))).toBe(true);
  });
});
