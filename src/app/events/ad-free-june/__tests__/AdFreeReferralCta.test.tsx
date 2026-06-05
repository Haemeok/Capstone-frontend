import { getReferralCtaLabel } from "../AdFreeReferralCta";

describe("getReferralCtaLabel", () => {
  it("추천인 입력 가능(AVAILABLE) 상태면 '이벤트 참여하기'를 보여준다", () => {
    expect(getReferralCtaLabel("AVAILABLE")).toBe("이벤트 참여하기");
  });

  it("입력 불가/미정 상태면 '초대 코드 공유하기'를 보여준다", () => {
    expect(getReferralCtaLabel("ALREADY_REDEEMED")).toBe("초대 코드 공유하기");
    expect(getReferralCtaLabel("NOT_ELIGIBLE_OLD_USER")).toBe(
      "초대 코드 공유하기"
    );
    expect(getReferralCtaLabel(undefined)).toBe("초대 코드 공유하기");
  });
});
