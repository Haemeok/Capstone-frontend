import { commentsMessages } from "@/shared/i18n/commentsMessages";

import { resolveCommentSortLabel } from "../commentSortLabel";

describe("resolveCommentSortLabel (T-18)", () => {
  it("ja: 최신순/인기순 → ja 라벨", () => {
    const ja = commentsMessages.ja.sort;
    expect(resolveCommentSortLabel("최신순", ja)).toBe(ja.latest);
    expect(resolveCommentSortLabel("인기순", ja)).toBe(ja.popular);
  });

  it("ko: 한글 라벨 항등", () => {
    const ko = commentsMessages.ko.sort;
    expect(resolveCommentSortLabel("최신순", ko)).toBe("최신순");
    expect(resolveCommentSortLabel("인기순", ko)).toBe("인기순");
  });
});
