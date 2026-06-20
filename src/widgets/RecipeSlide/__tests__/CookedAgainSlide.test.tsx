import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

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
let mockUser: unknown = { id: "u1" };
jest.mock("@/entities/user/model/store", () => ({
  useUserStore: () => ({ user: mockUser }),
}));
jest.mock("@/shared/i18n/useSearchDiscoveryDict", () => ({
  useSearchDiscoveryDict: () => ({
    cookedAgainTitle: "전에 했던 요리, 다시 만들어볼까요?",
    recipeSlideViewMore: "더보기",
    recipeSlideError: "에러",
    recipeSlideEmpty: "비어있음",
    remixBadge: "리믹스",
  }),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

import CookedAgainSlide from "../CookedAgainSlide";

const card = (
  id: string,
  title: string,
  extra: Record<string, unknown> = {}
) => ({
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
  ...extra,
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
  mockUser = { id: "u1" };
});

describe("CookedAgainSlide", () => {
  it("로그인 + content 있으면 타이틀을 보여준다 (T-D1)", async () => {
    mockGet.mockResolvedValue({ content: [card("r1", "김치찌개")] });
    renderWithClient(<CookedAgainSlide locale="ko" />);
    expect(
      await screen.findByText("전에 했던 요리, 다시 만들어볼까요?")
    ).toBeInTheDocument();
  });

  it("비로그인이면 렌더하지 않는다 (T-D2)", () => {
    mockUser = null;
    const { container } = renderWithClient(<CookedAgainSlide locale="ko" />);
    expect(container).toBeEmptyDOMElement();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("isRemix true 카드엔 리믹스 배지가 보인다 (T-D3)", async () => {
    mockGet.mockResolvedValue({
      content: [card("r1", "김치찌개", { isRemix: true })],
    });
    renderWithClient(<CookedAgainSlide locale="ko" />);
    expect(await screen.findByText("리믹스")).toBeInTheDocument();
  });

  it("isRemix 없으면 배지가 없다 (T-D4)", async () => {
    mockGet.mockResolvedValue({ content: [card("r1", "김치찌개")] });
    renderWithClient(<CookedAgainSlide locale="ko" />);
    await screen.findByText("김치찌개");
    expect(screen.queryByText("리믹스")).not.toBeInTheDocument();
  });
});
