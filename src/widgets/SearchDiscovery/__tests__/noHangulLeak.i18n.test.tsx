import { usePathname } from "next/navigation";

import { render } from "@testing-library/react";

import SearchDiscoveryDefault from "../SearchDiscoveryDefault";
import SearchDiscoveryFocused from "../SearchDiscoveryFocused";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("@/shared/hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: () => ({ data: undefined, isPending: false, error: null }),
}));
jest.mock("@/shared/hooks/useRecentSearches", () => ({
  useRecentSearches: () => ({
    searches: [],
    isLoaded: true,
    removeSearch: jest.fn(),
    clearAll: jest.fn(),
  }),
}));
jest.mock("@/shared/hooks/useRecentlyViewedRecipes", () => ({
  useRecentlyViewedRecipes: () => ({
    recipes: [],
    isLoaded: true,
    clearAll: jest.fn(),
  }),
}));
jest.mock("@/shared/ui/image/Image", () => ({ Image: () => null }));
jest.mock("@/features/recipe-create/ui/FloatingCreateRecipeButton", () => ({
  __esModule: true,
  default: () => null,
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);
const hangul = /[가-힣]/;

describe("디스커버리 한글 누락 가드", () => {
  it("T-04: ja·en Default 렌더에 한글 0", () => {
    setPath("/ja/search");
    const { container, rerender, unmount } = render(<SearchDiscoveryDefault />);
    expect(hangul.test(container.textContent ?? "")).toBe(false);
    setPath("/en/search");
    rerender(<SearchDiscoveryDefault />);
    expect(hangul.test(container.textContent ?? "")).toBe(false);
    unmount();
  });

  it("T-14: ja·en Focused 렌더에 한글 0", () => {
    setPath("/ja/search");
    const { container, rerender } = render(<SearchDiscoveryFocused />);
    expect(hangul.test(container.textContent ?? "")).toBe(false);
    setPath("/en/search");
    rerender(<SearchDiscoveryFocused />);
    expect(hangul.test(container.textContent ?? "")).toBe(false);
  });
});
