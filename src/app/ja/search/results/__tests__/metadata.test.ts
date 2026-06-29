/**
 * @jest-environment node
 */
jest.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [] }),
}));
jest.mock("@/widgets/SearchClient", () => ({
  __esModule: true,
  SearchClient: () => null,
}));
jest.mock("@/entities/recipe/model/api.server", () => ({
  getRecipesOnServer: async () => ({
    content: [],
    slice: { size: 0, number: 0, numberOfElements: 0, hasNext: false },
  }),
}));

import { generateMetadata } from "../page";

it("T-19: ja 검색 메타 robots는 noindex,follow", async () => {
  const meta = await generateMetadata({
    searchParams: Promise.resolve({ q: "丼" }),
  });
  expect(meta.robots).toEqual({ index: false, follow: true });
});
