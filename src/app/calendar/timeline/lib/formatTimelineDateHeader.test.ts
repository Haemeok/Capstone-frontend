import { formatTimelineDateHeader } from "./formatTimelineDateHeader";

const HANGUL = /[가-힣]/;

describe("formatTimelineDateHeader locale (T-10/11)", () => {
  it("en → 한글 없음 (T-10)", () => {
    expect(HANGUL.test(formatTimelineDateHeader("2026-05-03", "en"))).toBe(
      false
    );
  });
  it("ja → 한글 없음 (T-11)", () => {
    expect(HANGUL.test(formatTimelineDateHeader("2026-05-03", "ja"))).toBe(
      false
    );
  });
  it("ko → 기존 한국어 포맷 유지", () => {
    expect(HANGUL.test(formatTimelineDateHeader("2026-05-03", "ko"))).toBe(
      true
    );
  });
});
