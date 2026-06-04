import { getGridItemAuthor } from "../gridItemAuthor";

const base = {
  authorId: "author-1",
  authorName: "작성자",
  profileImage: "https://img/author.webp",
};

describe("getGridItemAuthor", () => {
  it("유튜브 레시피는 추출자 정보를 사용한다", () => {
    expect(
      getGridItemAuthor({
        ...base,
        source: "YOUTUBE",
        youtubeExtractorId: "extractor-1",
        youtubeExtractorName: "차경환",
        youtubeExtractorProfileImage: "https://img/extractor.webp",
      })
    ).toEqual({
      authorId: "extractor-1",
      authorName: "차경환",
      profileImage: "https://img/extractor.webp",
    });
  });

  it("유튜브여도 추출자 이름이 없으면 작성자로 폴백한다", () => {
    expect(getGridItemAuthor({ ...base, source: "YOUTUBE" })).toEqual(base);
  });

  it("추출자 id/이미지가 비면 작성자 값으로 채운다", () => {
    expect(
      getGridItemAuthor({
        ...base,
        source: "YOUTUBE",
        youtubeExtractorName: "차경환",
      })
    ).toEqual({
      authorId: "author-1",
      authorName: "차경환",
      profileImage: "https://img/author.webp",
    });
  });

  it("유튜브가 아니면 작성자 정보를 그대로 사용한다", () => {
    expect(
      getGridItemAuthor({
        ...base,
        source: "USER",
        youtubeExtractorName: "차경환",
      })
    ).toEqual(base);
  });
});
