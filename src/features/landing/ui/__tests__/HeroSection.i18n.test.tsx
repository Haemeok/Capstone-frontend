import { render } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";

import { HeroSection } from "../HeroSection";

describe("HeroSection i18n", () => {
  it("ja dict로 일본어 CTA·서브카피를 렌더한다 (T-01)", () => {
    const t = getDictionary("ja").landing;
    const { getByText } = render(<HeroSection t={t} locale="ja" />);
    expect(getByText(t.hero.cta)).toBeInTheDocument();
  });

  it("en dict로 영어 CTA를 렌더한다 (T-02)", () => {
    const t = getDictionary("en").landing;
    const { getByText } = render(<HeroSection t={t} locale="en" />);
    expect(getByText("Start free")).toBeInTheDocument();
  });

  it("ko는 기존 카피를 유지한다 (T-03)", () => {
    const t = getDictionary("ko").landing;
    const { getByText } = render(<HeroSection t={t} locale="ko" />);
    expect(getByText("무료로 시작하기")).toBeInTheDocument();
  });

  it("ja/en 렌더 트리에 한글이 없다 (T-04)", () => {
    for (const locale of ["ja", "en"] as const) {
      const t = getDictionary(locale).landing;
      const { container } = render(<HeroSection t={t} locale={locale} />);
      expect(container.textContent).not.toMatch(/[가-힣]/);
    }
  });

  it("recipeCountLabel이 locale별로 자연스럽다 (T-05)", () => {
    const ja = getDictionary("ja").landing;
    const { container: jaC } = render(<HeroSection t={ja} locale="ja" />);
    expect(jaC.textContent).toContain(ja.recipeCount.label);
    const en = getDictionary("en").landing;
    const { container: enC } = render(<HeroSection t={en} locale="en" />);
    expect(enC.textContent).toContain("50,000+");
  });

  it("ja Hero form에 localeHome hidden input value가 '/ja'다 (T-31)", () => {
    const t = getDictionary("ja").landing;
    const { container } = render(<HeroSection t={t} locale="ja" />);
    const input = container.querySelector<HTMLInputElement>(
      "input[name='localeHome']"
    );
    expect(input).not.toBeNull();
    expect(input?.value).toBe("/ja");
  });
});
