import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { commentsMessages } from "@/shared/i18n/commentsMessages";

import DiscussionPage from "../page";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useParams: () => ({ recipeId: "r1", commentId: "c1" }),
  useRouter: () => ({ back: jest.fn() }),
}));

const getReplies = jest.fn();
jest.mock("@/entities/comment", () => ({
  getReplies: (...a: unknown[]) => getReplies(...a),
}));
jest.mock("@/features/recipe-status", () => ({
  RecipeStatusProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}));
jest.mock("@/features/comment-card/ui/CommentCard", () => ({
  __esModule: true,
  default: () => <div data-testid="comment-card" />,
}));
jest.mock("@/features/comment-create", () => ({ CommentInput: () => null }));
jest.mock("@/features/comment-create/ui/CommentInputModal", () => ({
  __esModule: true,
  default: () => null,
}));

const emptyParent = {
  id: "c1",
  author: { id: "a1", nickname: "민수" },
  replies: {
    content: [],
    page: { totalElements: 0, totalPages: 0, number: 0 },
  },
};

const wrapper = ({ children }: { children: ReactNode }) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

const HANGUL = /[가-힣]/;
const flush = () => new Promise((r) => setTimeout(r, 0));

describe("RepliesPage i18n (T-21/T-23/T-24)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("ja 빈 답글 chrome 한글 0 + 제목 (T-21/T-23)", async () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/comments/c1");
    getReplies.mockResolvedValue(emptyParent);
    const t = commentsMessages.ja;
    const { container } = render(<DiscussionPage />, { wrapper });
    await flush();
    expect(screen.getByText(t.repliesTitle)).toBeInTheDocument();
    expect(screen.getByText(t.repliesEmptyTitle)).toBeInTheDocument();
    // CommentCard(부모, 닉네임)는 mock이라 콘텐츠 한글 없음
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("ko 답글 chrome 회귀 (T-24)", async () => {
    mockPathname.mockReturnValue("/recipes/r1/comments/c1");
    getReplies.mockResolvedValue(emptyParent);
    render(<DiscussionPage />, { wrapper });
    await flush();
    expect(screen.getByText("답글")).toBeInTheDocument();
  });
});
