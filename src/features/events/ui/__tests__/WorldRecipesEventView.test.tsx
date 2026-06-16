import { render } from "@testing-library/react";

import { eventsMessages } from "@/shared/i18n/eventsMessages";

import { WorldRecipesEventView } from "../WorldRecipesEventView";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: jest.fn() }),
  usePathname: () => "/",
}));

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

const HANGUL = /[가-힣]/;

describe("WorldRecipesEventView", () => {
  it.each(["ja", "en"] as const)(
    "T-E02: %s 뷰가 현지화 카피를 렌더하고 한국어가 없다",
    (locale) => {
      const { container, getByText } = render(
        <WorldRecipesEventView locale={locale} />
      );
      const w = eventsMessages[locale].worldRecipes;
      expect(getByText(w.intro.title)).toBeInTheDocument();
      expect(getByText(w.howTo.cta)).toBeInTheDocument();
      expect(getByText(eventsMessages[locale].faqHeading)).toBeInTheDocument();
      expect(getByText(w.faq[0].question)).toBeInTheDocument();
      expect(HANGUL.test(container.textContent ?? "")).toBe(false);
    }
  );

  it("T-E03: ko 뷰가 기존 카피를 렌더한다(회귀 앵커)", () => {
    const { getByText } = render(<WorldRecipesEventView locale="ko" />);
    expect(getByText("다른 나라 레시피, 이제 자유롭게")).toBeInTheDocument();
  });

  it("T-E05: CTA href가 ja에서 locale prefix된다", () => {
    const { getByText } = render(<WorldRecipesEventView locale="ja" />);
    const cta = getByText(eventsMessages.ja.worldRecipes.howTo.cta).closest(
      "a"
    );
    expect(cta?.getAttribute("href")).toMatch(/^\/ja\/search\/results\?/);
  });
});
