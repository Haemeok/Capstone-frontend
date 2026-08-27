import { render } from "@testing-library/react";

import { eventsMessages } from "@/shared/i18n/eventsMessages";

import { AdFreeSeptemberEventView } from "../AdFreeSeptemberEventView";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: jest.fn() }),
  usePathname: () => "/",
}));

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

jest.mock("../AdFreeReferralCta", () => ({
  __esModule: true,
  default: () => <div data-testid="cta" />,
}));

const HANGUL = /[가-힣]/;

describe("AdFreeSeptemberEventView", () => {
  it.each(["ko", "en", "ja"] as const)(
    "T-08: %s 사전은 9월 광고 제거 캠페인을 제공하고 June 표기가 없다",
    (locale) => {
      const septemberCampaign = eventsMessages[locale].adFreeSeptember;

      expect(septemberCampaign).toBeDefined();
      expect(JSON.stringify(septemberCampaign)).not.toMatch(/6월|6月|June/i);
    }
  );

  it.each(["ja", "en"] as const)(
    "T-E06: %s 뷰가 현지화 카피를 렌더하고 한국어가 없다",
    (locale) => {
      const { container, getByText } = render(
        <AdFreeSeptemberEventView locale={locale} />
      );
      const campaign = eventsMessages[locale].adFreeSeptember;
      expect(getByText(campaign.event1.title)).toBeInTheDocument();
      expect(getByText(campaign.event2.title)).toBeInTheDocument();
      expect(getByText(eventsMessages[locale].faqHeading)).toBeInTheDocument();
      expect(getByText(campaign.faq[0].question)).toBeInTheDocument();
      expect(HANGUL.test(container.textContent ?? "")).toBe(false);
    }
  );

  it("T-E07: ko 뷰가 9월 캠페인 카피를 렌더한다", () => {
    const { getByText } = render(<AdFreeSeptemberEventView locale="ko" />);
    expect(getByText("참여자 전원, 광고 최대 3개월 제거")).toBeInTheDocument();
  });
});
