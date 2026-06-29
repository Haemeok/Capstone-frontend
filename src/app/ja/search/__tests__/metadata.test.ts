/**
 * @jest-environment node
 */
jest.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [] }),
}));
jest.mock("@/entities/recipe/model/api.server", () => ({
  getRecipesOnServer: async () => ({
    content: [],
    slice: { size: 0, number: 0, numberOfElements: 0, hasNext: false },
  }),
}));
jest.mock("@/widgets/SearchDiscovery", () => ({
  SearchDiscoveryClient: () => null,
}));

import { metadata } from "../page";

it("T-06: ja 디스커버리 메타 robots noindex,follow", () => {
  expect(metadata.robots).toEqual({ index: false, follow: true });
});
