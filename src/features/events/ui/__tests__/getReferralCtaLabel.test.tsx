import { eventsMessages } from "@/shared/i18n/eventsMessages";

import { getReferralCtaLabel } from "../AdFreeReferralCta";

const HANGUL = /[가-힣]/;

describe("getReferralCtaLabel (T-E08)", () => {
  it.each(["ja", "en"] as const)(
    "%s: AVAILABLE이면 participate, 아니면 shareCode, 한국어 없음",
    (locale) => {
      const labels = eventsMessages[locale].adFreeJune.referralCta;
      expect(getReferralCtaLabel("AVAILABLE", labels)).toBe(labels.participate);
      expect(getReferralCtaLabel(undefined, labels)).toBe(labels.shareCode);
      expect(HANGUL.test(getReferralCtaLabel("AVAILABLE", labels))).toBe(false);
      expect(HANGUL.test(getReferralCtaLabel(undefined, labels))).toBe(false);
    }
  );
});
