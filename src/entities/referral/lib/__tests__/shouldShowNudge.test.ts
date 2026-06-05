import { NUDGE_INTERVAL_MS, shouldShowNudge } from "../shouldShowNudge";

const now = 1_000_000_000_000;

describe("shouldShowNudge", () => {
  it("T-401: 캠페인 활성 + 연 적 없음 → true", () => {
    expect(
      shouldShowNudge({ campaignActive: true, lastOpenedAt: null, now })
    ).toBe(true);
  });
  it("T-402: 방금 열었으면 → false", () => {
    expect(
      shouldShowNudge({ campaignActive: true, lastOpenedAt: now, now })
    ).toBe(false);
  });
  it("T-403: 7일 경계 — 7일+1초 경과 → true, 6일 → false", () => {
    expect(
      shouldShowNudge({
        campaignActive: true,
        lastOpenedAt: now - NUDGE_INTERVAL_MS - 1000,
        now,
      })
    ).toBe(true);
    expect(
      shouldShowNudge({
        campaignActive: true,
        lastOpenedAt: now - 6 * 24 * 3600 * 1000,
        now,
      })
    ).toBe(false);
  });
  it("T-404: 캠페인 비활성 → 항상 false", () => {
    expect(
      shouldShowNudge({ campaignActive: false, lastOpenedAt: null, now })
    ).toBe(false);
  });
  it("T-405: redeem 여부와 무관 — 활성+7일경과면 true", () => {
    expect(
      shouldShowNudge({
        campaignActive: true,
        lastOpenedAt: now - NUDGE_INTERVAL_MS - 1,
        now,
      })
    ).toBe(true);
  });
});
