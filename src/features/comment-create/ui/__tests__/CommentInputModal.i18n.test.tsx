import { fireEvent, render, screen } from "@testing-library/react";

import { format } from "@/shared/i18n";
import { commentsMessages } from "@/shared/i18n/commentsMessages";

import CommentInputModal from "../CommentInputModal";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/features/comment-create/model/hooks", () => ({
  __esModule: true,
  default: () => ({ createComment: jest.fn(), isPending: false }),
}));
jest.mock("@/features/recipe-status", () => ({
  useRecipeStatus: () => ({ recipeId: "r1" }),
}));
jest.mock("@/entities/user/model/store", () => ({
  useUserStore: () => ({ user: { id: "u1", nickname: "지수" } }),
}));

const author = { id: "a1", nickname: "민수" } as never;
const HANGUL = /[가-힣]/;

describe("CommentInputModal i18n (T-26 modal)", () => {
  it("ja 답글 다이얼로그 제목에 nickname 치환 (portal=baseElement)", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/comments/c1");
    const t = commentsMessages.ja;
    const { baseElement } = render(
      <CommentInputModal author={author} commentId="c1" />
    );
    fireEvent.click(screen.getByLabelText(t.modalTriggerAria));
    expect(
      screen.getByText(format(t.modalReplyTitle, { nickname: "민수" }))
    ).toBeInTheDocument();
    // 닉네임(민수)은 콘텐츠라 허용 → 제거 후 chrome 한글 0
    const chrome = (baseElement.textContent ?? "").replaceAll("민수", "");
    expect(HANGUL.test(chrome)).toBe(false);
  });
});
