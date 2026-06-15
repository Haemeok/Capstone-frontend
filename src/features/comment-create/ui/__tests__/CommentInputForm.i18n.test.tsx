import { render, screen } from "@testing-library/react";

import { format } from "@/shared/i18n";
import { commentsMessages } from "@/shared/i18n/commentsMessages";

import CommentInputForm from "../CommentInputForm";

const mockPathname = jest.fn();
jest.mock("next/navigation", () => ({ usePathname: () => mockPathname() }));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

const author = { id: "a1", nickname: "민수" } as never;
const user = { id: "u1", nickname: "지수", profileImage: "" } as never;

describe("CommentInputForm i18n (T-25~T-29)", () => {
  it("ja 댓글 placeholder (T-25)", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/comments");
    const t = commentsMessages.ja;
    render(
      <CommentInputForm author={author} user={user} onSubmit={() => {}} />
    );
    expect(
      screen.getByPlaceholderText(t.commentPlaceholder)
    ).toBeInTheDocument();
  });

  it("ja 답글 placeholder/aria에 nickname 치환 (T-26)", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/comments/c1");
    const t = commentsMessages.ja;
    render(
      <CommentInputForm
        author={author}
        user={user}
        commentId="c1"
        onSubmit={() => {}}
      />
    );
    expect(
      screen.getByPlaceholderText(
        format(t.replyPlaceholder, { nickname: "민수" })
      )
    ).toBeInTheDocument();
  });

  it("ja 비로그인 loginRequired (T-27)", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/comments");
    const t = commentsMessages.ja;
    render(
      <CommentInputForm author={author} user={null} onSubmit={() => {}} />
    );
    expect(screen.getByPlaceholderText(t.loginRequired)).toBeInTheDocument();
  });

  it("ja 작성 aria (T-28)", () => {
    mockPathname.mockReturnValue("/ja/recipes/r1/comments");
    const t = commentsMessages.ja;
    render(
      <CommentInputForm author={author} user={user} onSubmit={() => {}} />
    );
    expect(screen.getAllByLabelText(t.commentAria).length).toBeGreaterThan(0);
  });

  it("ko 댓글 placeholder 회귀 (T-29)", () => {
    mockPathname.mockReturnValue("/recipes/r1/comments");
    render(
      <CommentInputForm author={author} user={user} onSubmit={() => {}} />
    );
    expect(screen.getByPlaceholderText("댓글 남기기...")).toBeInTheDocument();
  });
});
