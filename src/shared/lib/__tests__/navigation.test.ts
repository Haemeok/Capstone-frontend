import { shouldHideNavbar } from "../navigation";

describe("shouldHideNavbar", () => {
  describe("always hidden (앱/웹 무관)", () => {
    it.each([
      "/login",
      "/recipes/new/youtube",
      "/recipes/new/ai/price",
      "/recipes/new/ai/ingredient",
      "/recipes/new/ai/nutrition",
      "/recipes/new/ai/finedining",
      "/recipes/abc123/slide-show",
    ])("hides on %s", (path) => {
      expect(shouldHideNavbar(path, { isApp: true })).toBe(true);
      expect(shouldHideNavbar(path, { isApp: false })).toBe(true);
    });
  });

  describe("app-only hidden (콘텐츠 상세)", () => {
    it.each([
      "/recipes/abc123",
      "/recipe-books/bookId01",
      "/curation/some-slug",
    ])("hides on %s in app, shows on web", (path) => {
      expect(shouldHideNavbar(path, { isApp: true })).toBe(true);
      expect(shouldHideNavbar(path, { isApp: false })).toBe(false);
    });
  });

  describe("reserved segments under /recipes are not detail", () => {
    it.each([
      "/recipes/new",
      "/recipes/my-fridge",
      "/recipes/admin",
      "/recipes/category",
    ])("shows on %s regardless of isApp", (path) => {
      expect(shouldHideNavbar(path, { isApp: true })).toBe(false);
      expect(shouldHideNavbar(path, { isApp: false })).toBe(false);
    });
  });

  describe("non-matching paths", () => {
    it.each(["/", "/search", "/search/results", "/users/abc"])(
      "shows on %s",
      (path) => {
        expect(shouldHideNavbar(path, { isApp: true })).toBe(false);
        expect(shouldHideNavbar(path, { isApp: false })).toBe(false);
      }
    );
  });
});
