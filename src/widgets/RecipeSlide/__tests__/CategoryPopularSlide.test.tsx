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
    categoryPopularTitle: "오늘은 {category} 어때요?",
    categoryPopularNames: {
      RICE: "밥 요리",
      NOODLE: "면 요리",
      MEAT: "고기 요리",
      SEAFOOD: "해산물 요리",
      SOUP: "국물 요리",
      DESSERT: "디저트",
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

import CategoryPopularSlide from "../CategoryPopularSlide";

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

describe("CategoryPopularSlide", () => {
  it("categoryCode를 이름으로 매핑해 타이틀을 만든다", async () => {
    mockGet.mockResolvedValue({
      categoryCode: "NOODLE",
      content: [card("r1", "잔치국수")],
    });
    renderWithClient(<CategoryPopularSlide locale="ko" />);
    expect(
      await screen.findByText("오늘은 면 요리 어때요?")
    ).toBeInTheDocument();
    expect(await screen.findByText("잔치국수")).toBeInTheDocument();
  });

  it("content가 비면 렌더하지 않는다", async () => {
    mockGet.mockResolvedValue({ categoryCode: "NOODLE", content: [] });
    renderWithClient(<CategoryPopularSlide locale="ko" />);
    await waitFor(() =>
      expect(
        screen.queryByText("오늘은 면 요리 어때요?")
      ).not.toBeInTheDocument()
    );
  });
});
