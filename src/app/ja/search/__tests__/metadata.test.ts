/**
 * @jest-environment node
 */
jest.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [] }),
}));
jest.mock("@/entities/recipe/model/api.server", () => ({
  getRecipesOnServer: async () => ({
    content: [],
    page: { size: 0, number: 0, totalElements: 0, totalPages: 0 },
  }),
}));
jest.mock("@/widgets/SearchDiscovery", () => ({
  SearchDiscoveryClient: () => null,
}));

import { metadata } from "../page";

it("T-06: ja 디스커버리 메타 robots noindex,follow", () => {
  expect(metadata.robots).toEqual({ index: false, follow: true });
});
