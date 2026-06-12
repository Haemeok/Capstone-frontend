import { getDictionary } from "../getDictionary";

describe("getDictionary", () => {
  it("T-01: locale별로 다른 dictionary를 반환한다", () => {
    const ko = getDictionary("ko");
    const ja = getDictionary("ja");
    expect(ko).not.toBe(ja);
    expect(ko.errors.video).not.toBe(ja.errors.video);
  });
  it("T-02: ko errors는 현재 한국어 문자열과 동일하다 (무회귀 앵커)", () => {
    const ko = getDictionary("ko");
    expect(ko.errors.video).toBe("비디오를 불러올 수 없어요");
    expect(ko.errors.comments).toBe("댓글을 불러올 수 없어요");
    expect(ko.errors.ingredients).toBe("재료 정보를 불러올 수 없어요");
    expect(ko.errors.steps).toBe("조리 순서를 불러올 수 없어요");
    expect(ko.errors.searchResults).toBe("검색 결과를 표시할 수 없어요");
    expect(ko.errors.sectionGeneric).toBe("이 영역을 불러올 수 없어요");
  });
});
