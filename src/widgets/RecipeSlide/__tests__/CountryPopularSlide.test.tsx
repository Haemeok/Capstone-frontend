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
    countryPopularTitle: "{country}의 인기 레시피를 만나보세요",
    countryPopularNames: { US: "미국", JP: "일본" },
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

import CountryPopularSlide from "../CountryPopularSlide";

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

describe("CountryPopularSlide", () => {
  it("countryCode를 로컬라이즈해 타이틀을 만든다 (서버 countryName 미사용)", async () => {
    mockGet.mockResolvedValue({
      countryCode: "US",
      countryName: "무시되는값",
      content: [card("r1", "버섯 치킨")],
    });
    renderWithClient(<CountryPopularSlide locale="ko" />);
    expect(
      await screen.findByText("미국의 인기 레시피를 만나보세요")
    ).toBeInTheDocument();
    expect(await screen.findByText("버섯 치킨")).toBeInTheDocument();
  });

  it("content가 비면 렌더하지 않는다", async () => {
    mockGet.mockResolvedValue({
      countryCode: "US",
      countryName: "미국",
      content: [],
    });
    renderWithClient(<CountryPopularSlide locale="ko" />);
    await waitFor(() =>
      expect(
        screen.queryByText("미국의 인기 레시피를 만나보세요")
      ).not.toBeInTheDocument()
    );
  });
});
