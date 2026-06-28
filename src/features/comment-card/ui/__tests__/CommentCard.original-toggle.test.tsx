import { fireEvent, render, screen } from "@testing-library/react";

import { commentsMessages } from "@/shared/i18n/commentsMessages";

import type { Comment } from "@/entities/comment";

import CommentCard from "../CommentCard";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));

jest.mock("@/entities/user", () => ({
  useUserStore: () => ({ user: { id: "viewer" } }),
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
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

const base: Comment = {
  id: "c1",
  content: "맛있어요",
  createdAt: "2026-06-15",
  updatedAt: "2026-06-15",
  author: {
    id: "author",
    nickname: "지수",
    profileImage: "",
    hasFirstRecord: false,
    remainingAiGenerationQuota: 0,
    remainingYoutubeExtractionCredits: 0,
    remainingAiQuota: 0,
    remainingYoutubeQuota: 0,
  },
  likeCount: 0,
  likedByCurrentUser: false,
  replyCount: 0,
  imageUrls: [],
};

const translated: Comment = {
  ...base,
  content: "맛있어요",
  originalContent: "美味しいです",
  sourceLocale: "ja",
  translated: true,
};

const fmt = (tpl: string, lang: string) => tpl.replace("{language}", lang);

describe("CommentCard original-toggle", () => {
  it("T-01: 번역 댓글에 언어 태그 + 원문 보기 노출", () => {
    mockPathname.mockReturnValue("/recipes/r1/comments");
    const t = commentsMessages.ko;
    render(<CommentCard comment={translated} hideReplyButton />);

    expect(screen.getByText("맛있어요")).toBeInTheDocument();
    expect(
      screen.getByText(fmt(t.translatedFrom, t.languageNames.ja))
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t.showOriginal })
    ).toBeInTheDocument();
  });
});
