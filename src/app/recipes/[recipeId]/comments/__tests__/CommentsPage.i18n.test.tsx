import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { format, plural } from "@/shared/i18n";
import { commentsMessages } from "@/shared/i18n/commentsMessages";

import CommentsPage from "../page";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useParams: () => ({ recipeId: "r1" }),
  useRouter: () => ({ back: jest.fn() }),
}));

const getComments = jest.fn();
jest.mock("@/entities/comment", () => ({
  getComments: (...a: unknown[]) => getComments(...a),
}));
jest.mock("@/entities/recipe", () => ({
  useRecipeDetailQuery: () => ({
    recipeData: { author: { id: "a1", nickname: "민수" } },
  }),
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

const page = (totalElements: number, content: unknown[]) => ({
  content,
  page: { totalElements, totalPages: 1, number: 0 },
});

const wrapper = ({ children }: { children: ReactNode }) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

const HANGUL = /[가-힣]/;
const flush = () => new Promise((r) => setTimeout(r, 0));

describe("CommentsPage i18n (T-15/T-16/T-17/T-19/T-20)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("ja 빈 목록 chrome 한글 0 + 정렬 라벨 (T-15/T-17)", async () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/comments");
    getComments.mockResolvedValue(page(0, []));
    const t = commentsMessages.ja;
    const { container } = render(<CommentsPage />, { wrapper });
    await waitFor(() =>
      expect(screen.getByText(t.emptyTitle)).toBeInTheDocument()
    );
    expect(screen.getByText(t.title)).toBeInTheDocument();
    expect(screen.getByText(t.sort.latest)).toBeInTheDocument();
    expect(screen.getByText(t.sort.popular)).toBeInTheDocument();
    expect(HANGUL.test(container.textContent ?? "")).toBe(false);
  });

  it("en 카운트 단복수 (T-16)", async () => {
    mockPathname.mockReturnValue("/en/recipes/r1/comments");
    const t = commentsMessages.en;
    getComments.mockResolvedValue(page(1, [{ id: "c1" }]));
    render(<CommentsPage />, { wrapper });
    await waitFor(() =>
      expect(
        screen.getByText(format(plural(1, t.count), { count: 1 }))
      ).toBeInTheDocument()
    );
    // 단복수 형태가 실제로 다름
    expect(format(plural(1, t.count), { count: 1 })).not.toBe(
      format(plural(2, t.count), { count: 2 })
    );
  });

  it("ja 정렬 선택해도 API sort는 canonical 코드 (T-19)", async () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/comments");
    getComments.mockResolvedValue(page(1, [{ id: "c1" }]));
    const t = commentsMessages.ja;
    render(<CommentsPage />, { wrapper });
    await flush();
    fireEvent.click(screen.getByText(t.sort.popular));
    await flush();
    expect(getComments).toHaveBeenCalledWith(
      expect.objectContaining({ sort: "popularityScore,DESC" })
    );
  });

  it("ko 목록 chrome 회귀 (T-20)", async () => {
    mockPathname.mockReturnValue("/recipes/r1/comments");
    getComments.mockResolvedValue(page(0, []));
    render(<CommentsPage />, { wrapper });
    await waitFor(() => expect(screen.getByText("댓글")).toBeInTheDocument());
    expect(screen.getByText("최신순")).toBeInTheDocument();
  });
});
