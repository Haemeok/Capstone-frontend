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
    youtubeVerifiedTitle: "유튜브 조회수 1000만회로 검증된 인기 레시피",
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

import YoutubeVerifiedSlide from "../YoutubeVerifiedSlide";

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

describe("YoutubeVerifiedSlide", () => {
  it("고정 타이틀과 카드를 보여준다", async () => {
    mockGet.mockResolvedValue({ content: [card("r1", "백종원 김치찌개")] });
    renderWithClient(<YoutubeVerifiedSlide locale="ko" />);
    expect(
      await screen.findByText("유튜브 조회수 1000만회로 검증된 인기 레시피")
    ).toBeInTheDocument();
    expect(await screen.findByText("백종원 김치찌개")).toBeInTheDocument();
  });

  it("content가 비면 렌더하지 않는다", async () => {
    mockGet.mockResolvedValue({ content: [] });
    renderWithClient(<YoutubeVerifiedSlide locale="ko" />);
    await waitFor(() =>
      expect(
        screen.queryByText("유튜브 조회수 1000만회로 검증된 인기 레시피")
      ).not.toBeInTheDocument()
    );
  });
});
