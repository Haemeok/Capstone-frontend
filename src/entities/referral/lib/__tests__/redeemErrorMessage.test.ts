import { redeemErrorMessage } from "../redeemErrorMessage";

describe("redeemErrorMessage (T-303)", () => {
  it("알려진 코드는 전용 문구", () => {
    expect(redeemErrorMessage("1301")).toContain("찾을 수 없");
    expect(redeemErrorMessage("1302")).toContain("본인");
    expect(redeemErrorMessage("1303")).toContain("이미");
    expect(redeemErrorMessage("1304")).toContain("이벤트 시작");
    expect(redeemErrorMessage("1305")).toContain("기간");
    expect(redeemErrorMessage("1306")).toContain("이벤트가 없어요");
  });
  it("각 알려진 코드는 서로 다른 문구를 반환한다", () => {
    const codes = ["1301", "1302", "1303", "1304", "1305", "1306"] as const;
    const messages = codes.map((c) => redeemErrorMessage(c));
    const unique = new Set(messages);
    expect(unique.size).toBe(codes.length);
  });
  it("미지의 코드는 generic 폴백", () => {
    expect(redeemErrorMessage("9999")).toContain("실패");
    expect(redeemErrorMessage(undefined)).toContain("실패");
  });
});
