import { formatCompactNumber } from "../format";

describe("formatCompactNumber", () => {
  it("T-09: ko -> 만 약어", () => {
    expect(formatCompactNumber(12300, "ko")).toBe("1.2만");
  });
  it("T-10: ja -> 万 약어", () => {
    expect(formatCompactNumber(12300, "ja")).toBe("1.2万");
  });
  it("T-11: en -> K 약어", () => {
    expect(formatCompactNumber(12300, "en")).toBe("12.3K");
  });
  it("T-12: 1000 미만 -> 정수", () => {
    expect(formatCompactNumber(999, "ko")).toBe("999");
  });
});
