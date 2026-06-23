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
    cookedPopularTitle: "레시피오 유저들이 많이 요리한 레시피",
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

import CookedPopularSlide from "../CookedPopularSlide";

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

describe("CookedPopularSlide", () => {
  it("content가 있으면 타이틀과 카드를 보여준다 (T-B1)", async () => {
    mockGet.mockResolvedValue({
      content: [card("r1", "된장찌개"), card("r2", "김밥")],
    });
    renderWithClient(<CookedPopularSlide locale="ko" />);
    expect(
      await screen.findByText("레시피오 유저들이 많이 요리한 레시피")
    ).toBeInTheDocument();
    expect(await screen.findByText("된장찌개")).toBeInTheDocument();
  });

  it("저장상태를 카드 id로 조회해 머지한다 (T-B3)", async () => {
    mockGet.mockResolvedValue({ content: [card("r1", "된장찌개")] });
    renderWithClient(<CookedPopularSlide locale="ko" />);
    await screen.findByText("된장찌개");
    await waitFor(() =>
      expect(mockPost).toHaveBeenCalledWith("/dev/recipes/status", {
        recipeIds: ["r1"],
      })
    );
  });

  it("content가 비면 렌더하지 않는다 (T-B2 wiring)", async () => {
    mockGet.mockResolvedValue({ content: [] });
    const { container } = renderWithClient(<CookedPopularSlide locale="ko" />);
    await waitFor(() =>
      expect(
        screen.queryByText("레시피오 유저들이 많이 요리한 레시피")
      ).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(container.querySelector("[aria-hidden]")).not.toBeInTheDocument()
    );
  });
});
