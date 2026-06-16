import { createRef } from "react";

import { render } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";
import { ScrollContext } from "@/shared/lib/ScrollContext";

import { TestimonialCarousel } from "../TestimonialCarousel";

const renderWithScroll = (ui: React.ReactElement) =>
  render(
    <ScrollContext.Provider value={{ motionRef: createRef() }}>
      {ui}
    </ScrollContext.Provider>
  );

describe("TestimonialCarousel i18n", () => {
  it("인디케이터 개수가 dict items 수와 일치한다 (T-23)", () => {
    for (const locale of ["ko", "ja", "en"] as const) {
      const t = getDictionary(locale).landing;
      const { container } = renderWithScroll(
        <TestimonialCarousel t={t} locale={locale} />
      );
      const indicators = container.querySelectorAll(
        "[aria-label^='Go to testimonial']"
      );
      expect(indicators.length).toBe(t.testimonials.items.length);
    }
  });

  it("ja/en 현재 표시 후기에 한글이 없다 (T-24)", () => {
    for (const locale of ["ja", "en"] as const) {
      const t = getDictionary(locale).landing;
      const { container } = renderWithScroll(
        <TestimonialCarousel t={t} locale={locale} />
      );
      expect(container.textContent).not.toMatch(/[가-힣]/);
    }
  });
});
