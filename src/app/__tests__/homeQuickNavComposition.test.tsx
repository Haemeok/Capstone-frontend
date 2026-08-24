import { render, screen } from "@testing-library/react";

jest.mock("@/shared/adsense", () => ({
  HomeHeaderAnchorAdSlot: () => <div data-testid="home-header-ad" />,
  HomeAnchorAdSlot: () => <div data-testid="home-anchor-ad" />,
  WebOnlyAdSlot: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@/shared/lib/metadata", () => ({
  buildHomeMetadata: () => ({}),
}));

jest.mock("@/shared/ui/Container", () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));

jest.mock("@/shared/ui/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@/shared/ui/SectionErrorFallback", () => () => null);

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt?: string }) => (
    <img src={src} alt={alt ?? ""} />
  ),
}));

jest.mock("@/entities/recipe/lib/metadata/schema", () => ({
  createOrganizationStructuredData: () => ({}),
  createWebsiteStructuredData: () => ({}),
}));

jest.mock("@/entities/recipe/model/api.server", () => ({
  getStaticRecipesOnServer: async () => ({
    content: [],
    fetchFailed: false,
  }),
}));

jest.mock(
  "@/widgets/CategoryTabs",
  () =>
    function MockCategoryTabs() {
      return <div data-testid="category-tabs" />;
    }
);

jest.mock("@/widgets/Footer/DesktopFooter", () => () => null);

jest.mock(
  "@/widgets/Header/HomeHeader",
  () =>
    function MockHomeHeader() {
      return <div data-testid="home-header" />;
    }
);

jest.mock(
  "@/widgets/HomeBannerCarousel",
  () =>
    function MockHomeBannerCarousel() {
      return <div data-testid="home-banner" />;
    }
);

jest.mock("@/widgets/HomeBannerCarousel/slides", () => ({
  HOME_BANNER_SLIDES: [],
}));

jest.mock(
  "@/widgets/RecipeSlide/RecipeSlideWithErrorBoundary",
  () =>
    function MockRecipeSlide() {
      return <div data-testid="recipe-feed" />;
    }
);

jest.mock("@/widgets/RecipeSlide/server", () => ({
  CategoryPopularServerSlide: () => null,
  CountryPopularServerSlide: () => null,
  QuickPopularServerSlide: () => null,
  SeasonalPopularServerSlide: () => null,
  YoutubeVerifiedServerSlide: () => null,
}));

jest.mock("@/widgets/ToastDebugPanel", () => ({
  ToastDebugButton: () => null,
}));

import HomePage from "../page";

const expectBefore = (current: HTMLElement, next: HTMLElement) => {
  expect(
    current.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
};

describe("한국어 홈 탐색 흐름", () => {
  it("검색 헤더 다음에 배너와 빠른 탐색을 연속 배치하고 광고와 레시피는 그 아래 둔다", async () => {
    render(await HomePage());

    const header = screen.getByTestId("home-header");
    const banner = screen.getByTestId("home-banner");
    const quickNav = screen.getByRole("navigation", {
      name: "레시피 바로가기",
    });
    const headerAd = screen.getByTestId("home-header-ad");
    const anchorAd = screen.getByTestId("home-anchor-ad");
    const recipeFeed = screen.getAllByTestId("recipe-feed")[0];

    expect(screen.queryByTestId("category-tabs")).not.toBeInTheDocument();
    expectBefore(header, banner);
    expectBefore(banner, quickNav);
    expectBefore(quickNav, headerAd);
    expectBefore(headerAd, anchorAd);
    expectBefore(anchorAd, recipeFeed);
  });
});
