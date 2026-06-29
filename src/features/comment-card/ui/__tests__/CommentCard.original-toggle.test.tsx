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

  it("T-02: 원문 보기 클릭 → 본문 원문 교체 + 버튼 번역 보기", () => {
    mockPathname.mockReturnValue("/recipes/r1/comments");
    const t = commentsMessages.ko;
    render(<CommentCard comment={translated} hideReplyButton />);

    fireEvent.click(screen.getByRole("button", { name: t.showOriginal }));

    expect(screen.getByText("美味しいです")).toBeInTheDocument();
    expect(screen.queryByText("맛있어요")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t.showTranslation })
    ).toBeInTheDocument();
  });

  it("T-03: 번역 보기 클릭 → 번역본 복귀", () => {
    mockPathname.mockReturnValue("/recipes/r1/comments");
    const t = commentsMessages.ko;
    render(<CommentCard comment={translated} hideReplyButton />);

    fireEvent.click(screen.getByRole("button", { name: t.showOriginal }));
    fireEvent.click(screen.getByRole("button", { name: t.showTranslation }));

    expect(screen.getByText("맛있어요")).toBeInTheDocument();
    expect(screen.queryByText("美味しいです")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t.showOriginal })
    ).toBeInTheDocument();
    expect(
      screen.getByText(fmt(t.translatedFrom, t.languageNames.ja))
    ).toBeInTheDocument();
  });

  it("T-04: 언어 태그가 표시 locale 언어로 (ja/en)", () => {
    const koSource: Comment = {
      ...translated,
      content: "美味しいです",
      originalContent: "맛있어요",
      sourceLocale: "ko",
    };

    mockPathname.mockReturnValue("/ja/recipes/r1/comments");
    const { unmount } = render(
      <CommentCard comment={koSource} hideReplyButton />
    );
    const ja = commentsMessages.ja;
    expect(
      screen.getByText(fmt(ja.translatedFrom, ja.languageNames.ko))
    ).toBeInTheDocument();
    unmount();

    mockPathname.mockReturnValue("/en/recipes/r1/comments");
    render(<CommentCard comment={koSource} hideReplyButton />);
    const en = commentsMessages.en;
    expect(
      screen.getByText(fmt(en.translatedFrom, en.languageNames.ko))
    ).toBeInTheDocument();
  });

  it("T-05: 미매핑 sourceLocale → 언어 태그 생략, 버튼만", () => {
    mockPathname.mockReturnValue("/recipes/r1/comments");
    const t = commentsMessages.ko;
    const unknown = {
      ...translated,
      sourceLocale: "de",
    } as unknown as Comment;
    render(<CommentCard comment={unknown} hideReplyButton />);

    expect(
      screen.getByRole("button", { name: t.showOriginal })
    ).toBeInTheDocument();
    expect(screen.queryByText(/번역됨/)).not.toBeInTheDocument();
  });

  it("T-06: translated=false → 태그/토글 미노출", () => {
    mockPathname.mockReturnValue("/recipes/r1/comments");
    const t = commentsMessages.ko;
    const notTranslated: Comment = {
      ...translated,
      translated: false,
    };
    render(<CommentCard comment={notTranslated} hideReplyButton />);

    expect(
      screen.queryByRole("button", { name: t.showOriginal })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/번역됨/)).not.toBeInTheDocument();
  });

  it("T-07: originalContent 빈 값 → 토글 미노출", () => {
    mockPathname.mockReturnValue("/recipes/r1/comments");
    const t = commentsMessages.ko;
    const empty: Comment = {
      ...translated,
      originalContent: "",
    };
    render(<CommentCard comment={empty} hideReplyButton />);

    expect(
      screen.queryByRole("button", { name: t.showOriginal })
    ).not.toBeInTheDocument();
  });
});
