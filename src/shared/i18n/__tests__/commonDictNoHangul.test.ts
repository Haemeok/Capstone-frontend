import { commonMessages } from "../commonMessages";
import { ratingsMessages } from "../ratingsMessages";

const hasHangul = (v: unknown): boolean =>
  typeof v === "string"
    ? /[가-힣]/.test(v)
    : typeof v === "object" && v !== null
      ? Object.values(v).some(hasHangul)
      : false;

describe("common/ratings 사전 no-Hangul 가드 (T-25)", () => {
  it("ja common 사전에 한글이 없다", () => {
    expect(hasHangul(commonMessages.ja)).toBe(false);
  });

  it("en common 사전에 한글이 없다", () => {
    expect(hasHangul(commonMessages.en)).toBe(false);
  });

  it("ja/en ratings.starSelect에 한글이 없다", () => {
    expect(hasHangul(ratingsMessages.ja.starSelect)).toBe(false);
    expect(hasHangul(ratingsMessages.en.starSelect)).toBe(false);
  });
});
