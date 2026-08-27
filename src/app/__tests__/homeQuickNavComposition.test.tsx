import { render, screen, within } from "@testing-library/react";

import { getDictionary, type Locale } from "@/shared/i18n";
import { buildSearchResultsUrl } from "@/shared/lib/search/buildSearchResultsUrl";

import { CONTENT_PAGES } from "@/entities/recipe/lib/content-pages";

jest.mock("@/shared/adsense", () => ({
  HomeHeaderAnchorAdSlot: () => <div data-testid="home-header-ad" />,
  HomeAnchorAdSlot: () => <div data-testid="home-anchor-ad" />,
  WebOnlyAdSlot: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="web-only-home-ads">{children}</div>
  ),
}));

jest.mock("@/app/_components/HomeAdsGate", () => ({
  HomeAdsGate: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="home-ads-gate">{children}</div>
  ),
}));

jest.mock("@/app/_components/DesktopYoutubeImportHero", () => ({
  DesktopYoutubeImportHero: () => (
    <section
      data-testid="desktop-youtube-import-hero"
      className="hidden md:block"
    />
  ),
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

jest.mock("@/features/cooking-record-launch", () => ({
  CookingRecordLaunchDrawer: () => <div data-testid="cooking-record-launch" />,
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
      return <div data-testid="home-banner" className="md:hidden" />;
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

    const homeMessages = getDictionary(homeCase.locale).home;
    const quickNavMessages = homeMessages.quickNav;
    const header = screen.getByTestId("home-header");
    const hero = screen.getByTestId("desktop-youtube-import-hero");
    const banner = screen.getByTestId("home-banner");
    const quickNav = screen.getByRole("navigation", {
      name: quickNavMessages.ariaLabel,
    });
    const categoryTabsTitle = screen.getByRole("heading", {
      name: homeMessages.categoryTitle,
    });
    const categoryTabs = categoryTabsTitle.closest("section");
    expect(categoryTabs).not.toBeNull();
    const categoryLinks = within(categoryTabs!).getAllByRole("link");
    expect(categoryLinks).toHaveLength(12);
    CONTENT_PAGES.forEach((page, index) => {
      const copy = getDictionary(homeCase.locale).searchDiscovery.contentPages[
        page.id
      ];
      expect(categoryLinks[index]).toHaveAccessibleName(copy.title);
      expect(categoryLinks[index]).toHaveAttribute(
        "href",
        buildSearchResultsUrl(page.searchParams)
      );
    });
    const homeAdsGate = screen.getByTestId("home-ads-gate");
    const webOnlyHomeAds = screen.getByTestId("web-only-home-ads");
    const headerAd = within(webOnlyHomeAds).getByTestId("home-header-ad");
    const anchorAd = within(webOnlyHomeAds).getByTestId("home-anchor-ad");
    const recipeFeed = screen.getAllByTestId("recipe-feed")[0];

    expectBefore(header, hero);
    expectBefore(hero, banner);
    expectBefore(banner, quickNav);
    expectBefore(quickNav, categoryTabs!);
    expectBefore(categoryTabs!, webOnlyHomeAds);
    expectBefore(quickNav, webOnlyHomeAds);
    expectBefore(headerAd, anchorAd);
    expectBefore(webOnlyHomeAds, recipeFeed);
    expect(within(homeAdsGate).getByTestId("home-banner")).toBe(banner);
    expect(within(homeAdsGate).getAllByTestId("recipe-feed")[0]).toBe(
      recipeFeed
    );
    expect(hero).toHaveClass("hidden", "md:block");
    expect(banner).toHaveClass("md:hidden");
    expect(categoryTabs).toHaveClass("hidden", "md:block");
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

describe("요리기록 출시 안내 조합", () => {
  it("T-03: 한국어 홈에만 출시 드로어를 조합합니다", async () => {
    const ko = render(await KoHomePage());
    expect(screen.getByTestId("cooking-record-launch")).toBeInTheDocument();
    ko.unmount();

    const en = render(await EnHomePage());
    expect(
      screen.queryByTestId("cooking-record-launch")
    ).not.toBeInTheDocument();
    en.unmount();

    render(await JaHomePage());
    expect(
      screen.queryByTestId("cooking-record-launch")
    ).not.toBeInTheDocument();
  });
});
