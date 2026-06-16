import { CALORIE_ACTIVITIES } from "@/shared/config/constants/recipe";

import { localizeActivityName } from "../activityNameOverlay";

const HANGUL = /[가-힣]/;

describe("localizeActivityName", () => {
  it("T-03a: 모든 활동 이름이 ja에서 한글 없음", () => {
    for (const { name } of CALORIE_ACTIVITIES) {
      expect(HANGUL.test(localizeActivityName(name, "ja"))).toBe(false);
    }
  });

  it("T-03a: 모든 활동 이름이 en에서 한글 없음", () => {
    for (const { name } of CALORIE_ACTIVITIES) {
      expect(HANGUL.test(localizeActivityName(name, "en"))).toBe(false);
    }
  });

  it("ko는 원문 그대로", () => {
    expect(localizeActivityName("가볍게 달리기", "ko")).toBe("가볍게 달리기");
  });

  it("미등록 이름은 입력 그대로 폴백", () => {
    expect(localizeActivityName("알수없는활동", "ja")).toBe("알수없는활동");
  });
});
