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
    seasonalPopularTitle: "제철 재료 {ingredient}을 활용한 인기 레시피",
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

import SeasonalPopularSlide from "../SeasonalPopularSlide";

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
    expect(
      await screen.findByText("제철 재료 열무을 활용한 인기 레시피")
    ).toBeInTheDocument();
    expect(await screen.findByText("열무비빔밥")).toBeInTheDocument();
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
