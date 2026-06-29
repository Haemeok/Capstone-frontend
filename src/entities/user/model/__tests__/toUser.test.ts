import { toUser } from "../api";
import type { RawUserResponse } from "../types";

const base: RawUserResponse = {
  id: "u1",
  nickname: "민지",
  profileImage: "",
  hasFirstRecord: false,
};

describe("toUser", () => {
  it("긴 이름(remainingAiGenerationQuota)을 canonical로 정규화한다", () => {
    expect(
      toUser({ ...base, remainingAiGenerationQuota: 5 }).remainingAiQuota
    ).toBe(5);
  });
  it("긴 이름(remainingYoutubeExtractionCredits)을 canonical로 정규화한다", () => {
    expect(
      toUser({ ...base, remainingYoutubeExtractionCredits: 7 })
        .remainingYoutubeQuota
    ).toBe(7);
  });
  it("짧은 이름을 그대로 쓴다", () => {
    const r = toUser({
      ...base,
      remainingAiQuota: 3,
      remainingYoutubeQuota: 2,
    });
    expect(r.remainingAiQuota).toBe(3);
    expect(r.remainingYoutubeQuota).toBe(2);
  });
  it("둘 다 없으면 0이다", () => {
    const r = toUser(base);
    expect(r.remainingAiQuota).toBe(0);
    expect(r.remainingYoutubeQuota).toBe(0);
  });
});
