import { render, screen, within } from "@testing-library/react";

import { getDictionary, type Locale } from "@/shared/i18n";

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

import EnHomePage from "../en/page";
import JaHomePage from "../ja/page";
import KoHomePage from "../page";

type HomeCase = {
  locale: Locale;
  renderPage: () => ReturnType<typeof KoHomePage>;
  chefHref: string;
  youtubeHref: string;
  trendHref: string;
};

const HOME_CASES: HomeCase[] = [
  {
    locale: "ko",
    renderPage: KoHomePage,
    chefHref: "/recipes/category/CHEF_RECIPE",
    youtubeHref: "/search/results?types=YOUTUBE",
    trendHref: "/search/results?types=YOUTUBE&sort=createdAt%2CDESC",
  },
  {
    locale: "en",
    renderPage: EnHomePage,
    chefHref: "/en/recipes/category/CHEF_RECIPE",
    youtubeHref: "/en/search/results?types=YOUTUBE",
    trendHref: "/en/search/results?types=YOUTUBE&sort=createdAt%2CDESC",
  },
  {
    locale: "ja",
    renderPage: JaHomePage,
    chefHref: "/ja/recipes/category/CHEF_RECIPE",
    youtubeHref: "/ja/search/results?types=YOUTUBE",
    trendHref: "/ja/search/results?types=YOUTUBE&sort=createdAt%2CDESC",
  },
];

const expectBefore = (current: HTMLElement, next: HTMLElement) => {
  expect(
    current.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
};

describe.each(HOME_CASES)("$locale 홈 빠른 탐색 흐름", (homeCase) => {
  it("헤더부터 기존 레시피 피드까지 새 탐색 순서로 연결한다", async () => {
    render(await homeCase.renderPage());

    const quickNavMessages = getDictionary(homeCase.locale).home.quickNav;
    const header = screen.getByTestId("home-header");
    const banner = screen.getByTestId("home-banner");
    const quickNav = screen.getByRole("navigation", {
      name: quickNavMessages.ariaLabel,
    });
    const headerAd = screen.getByTestId("home-header-ad");
    const anchorAd = screen.getByTestId("home-anchor-ad");
    const recipeFeed = screen.getAllByTestId("recipe-feed")[0];

    expectBefore(header, banner);
    expectBefore(banner, quickNav);
    expectBefore(quickNav, headerAd);
    expectBefore(headerAd, anchorAd);
    expectBefore(anchorAd, recipeFeed);
  });

  it("현재 언어의 이름과 경로를 빠른 탐색에 연결한다", async () => {
    render(await homeCase.renderPage());

    const quickNavMessages = getDictionary(homeCase.locale).home.quickNav;
    const quickNav = screen.getByRole("navigation", {
      name: quickNavMessages.ariaLabel,
    });

    expect(
      within(quickNav).getByRole("link", {
        name: quickNavMessages.items.chef,
      })
    ).toHaveAttribute("href", homeCase.chefHref);
    expect(
      within(quickNav).getByRole("link", {
        name: quickNavMessages.items.youtube,
      })
    ).toHaveAttribute("href", homeCase.youtubeHref);
    expect(
      within(quickNav).getByRole("link", { name: quickNavMessages.trendMore })
    ).toHaveAttribute("href", homeCase.trendHref);
  });
});
