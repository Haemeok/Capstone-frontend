import Page from "../page";

const mockEnvironment = { isDevelopment: true };
jest.mock("@/shared/config/development", () => ({
  get isDevelopment() {
    return mockEnvironment.isDevelopment;
  },
}));
jest.mock("../_components/CookingRecordUiPreview", () => ({
  CookingRecordUiPreview: () => null,
}));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));
test("the UI preview is reachable only in development", () => {
  expect(Page()).not.toBeNull();
  mockEnvironment.isDevelopment = false;
  expect(() => Page()).toThrow("NOT_FOUND");
});
