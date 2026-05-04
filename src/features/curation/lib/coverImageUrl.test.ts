import { coverImageUrlFromKey } from "./coverImageUrl";

describe("coverImageUrlFromKey", () => {
  it("null 입력은 null 반환", () => {
    expect(coverImageUrlFromKey(null)).toBeNull();
  });

  it("빈 문자열은 null 반환", () => {
    expect(coverImageUrlFromKey("")).toBeNull();
  });

  it("'images/articles/...' 키를 절대 URL로 변환", () => {
    expect(
      coverImageUrlFromKey("images/articles/7/abc.webp"),
    ).toBe(
      "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/images/articles/7/abc.webp",
    );
  });

  it("'images/'로 시작하지 않는 키도 그대로 prepend", () => {
    expect(coverImageUrlFromKey("recipes/x.webp")).toBe(
      "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/recipes/x.webp",
    );
  });

  it("이미 절대 URL이면 그대로 반환", () => {
    const abs = "https://example.com/foo.webp";
    expect(coverImageUrlFromKey(abs)).toBe(abs);
  });
});
