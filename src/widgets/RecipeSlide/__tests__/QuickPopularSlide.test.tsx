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
    quickPopularTitle: "시간이 부족해요. 빠른 {minutes}분 완성 레시피",
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

import QuickPopularSlide from "../QuickPopularSlide";

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
  return {
    client,
    ...render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>),
  };
};

beforeEach(() => {
  mockGet.mockReset();
  mockPost.mockReset();
  mockPost.mockResolvedValue({});
});

describe("QuickPopularSlide", () => {
  it("maxCookingTime을 타이틀에 반영한다", async () => {
    mockGet.mockResolvedValue({
      maxCookingTime: 20,
      content: [card("r1", "20분 파스타")],
    });
    renderWithClient(<QuickPopularSlide locale="ko" />);
    expect(
      await screen.findByText("시간이 부족해요. 빠른 20분 완성 레시피")
    ).toBeInTheDocument();
    expect(await screen.findByText("20분 파스타")).toBeInTheDocument();
  });

  it("content가 비면 렌더하지 않는다", async () => {
    mockGet.mockResolvedValue({ maxCookingTime: 20, content: [] });
    renderWithClient(<QuickPopularSlide locale="ko" />);
    await waitFor(() =>
      expect(
        screen.queryByText("시간이 부족해요. 빠른 20분 완성 레시피")
      ).not.toBeInTheDocument()
    );
  });

  it("maxCookingTime이 null이면 빈 분 라벨 없이 숨긴다 (T-S5-2)", async () => {
    mockGet.mockResolvedValue({
      maxCookingTime: null,
      content: [card("r1", "된장찌개")],
    });
    const { client } = renderWithClient(<QuickPopularSlide locale="ko" />);
    await waitFor(() =>
      expect(
        client.getQueryData(["recipes", "quick-popular", "ko"])
      ).toBeDefined()
    );

    expect(screen.queryByText("된장찌개")).not.toBeInTheDocument();
    expect(
      screen.queryByText("시간이 부족해요. 빠른 분 완성 레시피")
    ).not.toBeInTheDocument();
  });
});
