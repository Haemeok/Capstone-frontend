import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";

const mockGet = jest.fn();
const mockPost = jest.fn();
jest.mock("@/shared/api/client", () => ({
  api: {
    get: (...a: unknown[]) => mockGet(...a),
    post: (...a: unknown[]) => mockPost(...a),
  },
}));
jest.mock("@/shared/hooks/useInViewOnce", () => ({
  useInViewOnce: () => ({ ref: { current: null }, inView: true }),
}));
jest.mock("@/shared/i18n/useSearchDiscoveryDict", () => ({
  useSearchDiscoveryDict: () => ({
    seasonalPopularTitle:
      "{adjective} {month}월엔 {ingredient} 활용 레시피 어떠세요?",
    seasonalAdjectives: {
      spring: "따뜻한",
      summer: "무더운",
      autumn: "선선한",
      winter: "추운",
    },
    recipeSlideViewMore: "더보기",
    recipeSlideError: "에러",
    recipeSlideEmpty: "비어있음",
  }),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

import { monthToSeason } from "../season";
import SeasonalPopularSlide from "../SeasonalPopularSlide";

const SEASON_ADJECTIVE: Record<string, string> = {
  spring: "따뜻한",
  summer: "무더운",
  autumn: "선선한",
  winter: "추운",
};

const card = (id: string, title: string) => ({
  id,
  title,
  imageUrl: "",
  authorName: "a",
  authorId: "a1",
  profileImage: "",
  createdAt: "2026-01-01T00:00:00",
  avgRating: 0,
  ratingCount: 0,
  tags: [],
});

const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

beforeEach(() => {
  mockGet.mockReset();
  mockPost.mockReset();
  mockPost.mockResolvedValue({});
});

describe("SeasonalPopularSlide", () => {
  it("seasonalIngredientName으로 타이틀을 만든다", async () => {
    mockGet.mockResolvedValue({
      seasonalIngredientName: "열무",
      content: [card("r1", "열무비빔밥")],
    });
    renderWithClient(<SeasonalPopularSlide locale="ko" />);
    const month = new Date().getMonth() + 1;
    const adjective = SEASON_ADJECTIVE[monthToSeason(month)];
    expect(
      await screen.findByText(
        `${adjective} ${month}월엔 열무 활용 레시피 어떠세요?`
      )
    ).toBeInTheDocument();
    expect(await screen.findByText("열무비빔밥")).toBeInTheDocument();
  });

  it.each([
    [3, "spring"],
    [5, "spring"],
    [6, "summer"],
    [8, "summer"],
    [9, "autumn"],
    [11, "autumn"],
    [12, "winter"],
    [1, "winter"],
    [2, "winter"],
  ])("월 %i는 %s 계절로 매핑된다", (month, season) => {
    expect(monthToSeason(month)).toBe(season);
  });

  it("seasonalIngredientName이 null이면 렌더하지 않는다", async () => {
    mockGet.mockResolvedValue({
      seasonalIngredientName: null,
      content: [card("r1", "열무비빔밥")],
    });
    renderWithClient(<SeasonalPopularSlide locale="ko" />);
    await waitFor(() =>
      expect(screen.queryByText("열무비빔밥")).not.toBeInTheDocument()
    );
  });
});
