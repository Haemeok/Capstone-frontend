import { fireEvent, render, screen } from "@testing-library/react";

import { commentsMessages } from "@/shared/i18n/commentsMessages";

import CommentCard from "../CommentCard";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

jest.mock("@/entities/user", () => ({
  useUserStore: () => ({ user: { id: "u1" } }),
}));
jest.mock("@/features/recipe-status", () => ({
  useRecipeStatus: () => ({ recipeId: "r1" }),
}));
jest.mock("@/features/comment-delete", () => ({
  useDeleteCommentMutation: () => ({ mutate: jest.fn() }),
}));
jest.mock("@/features/comment-like/ui/CommentLikeButton", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/shared/lib/date", () => ({ formatTimeAgo: () => "3h" }));

const comment = {
  id: "c1",
  content: "내용",
  createdAt: "2026-06-15",
  author: { id: "u1", nickname: "지수", profileImage: "" },
  imageUrls: [],
  likeCount: 0,
  likedByCurrentUser: false,
  replyCount: 0,
} as never;

const HANGUL = /[가-힣]/;

describe("CommentCard delete i18n (T-30/T-32/T-33)", () => {
  it("ja 삭제 aria + 모달 chrome 한글 0 (T-30/T-32)", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/comments");
    const t = commentsMessages.ja;
    const { baseElement } = render(
      <CommentCard comment={comment} hideReplyButton />
    );
    const delBtn = screen.getByLabelText(t.deleteAria);
    fireEvent.click(delBtn);
    expect(screen.getByText(t.deleteModalTitle)).toBeInTheDocument();
    expect(screen.getByText(t.deleteModalDesc)).toBeInTheDocument();
    const chrome = (baseElement.textContent ?? "")
      .replaceAll("내용", "")
      .replaceAll("지수", "")
      .replaceAll("취소", "")
      .replaceAll("삭제", "");
    expect(HANGUL.test(chrome)).toBe(false);
  });

  it("ko 삭제 모달 회귀 (T-33)", () => {
    mockPathname.mockReturnValue("/recipes/r1/comments");
    render(<CommentCard comment={comment} hideReplyButton />);
    fireEvent.click(screen.getByLabelText("댓글 삭제"));
    expect(screen.getByText("댓글을 삭제하시겠어요?")).toBeInTheDocument();
  });
});
