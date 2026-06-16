import { render } from "@testing-library/react";

import { eventsMessages } from "@/shared/i18n/eventsMessages";

import { AdFreeJuneEventView } from "../AdFreeJuneEventView";

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

describe("AdFreeJuneEventView", () => {
  it.each(["ja", "en"] as const)(
    "T-E06: %s 뷰가 현지화 카피를 렌더하고 한국어가 없다",
    (locale) => {
      const { container, getByText } = render(
        <AdFreeJuneEventView locale={locale} />
      );
      const a = eventsMessages[locale].adFreeJune;
      expect(getByText(a.event1.title)).toBeInTheDocument();
      expect(getByText(a.event2.title)).toBeInTheDocument();
      expect(getByText(eventsMessages[locale].faqHeading)).toBeInTheDocument();
      expect(getByText(a.faq[0].question)).toBeInTheDocument();
      expect(HANGUL.test(container.textContent ?? "")).toBe(false);
    }
  );

  it("T-E07: ko 뷰가 기존 카피를 렌더한다(컴포넌트 이전 후 회귀 앵커)", () => {
    const { getByText } = render(<AdFreeJuneEventView locale="ko" />);
    expect(getByText("참여자 전원, 광고 최대 3개월 제거")).toBeInTheDocument();
  });
});
