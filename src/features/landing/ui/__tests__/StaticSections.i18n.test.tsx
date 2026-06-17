import { createRef } from "react";

import { render } from "@testing-library/react";

import { getDictionary } from "@/shared/i18n";
import { ScrollContext } from "@/shared/lib/ScrollContext";

import { FeatureShowcase } from "../FeatureShowcase";
import { FinalCTA } from "../FinalCTA";
import { ProblemCards } from "../ProblemCards";
import { StatsSection } from "../StatsSection";
import { TagChipsSection } from "../TagChipsSection";

const renderWithScroll = (ui: React.ReactElement) =>
  render(
    <ScrollContext.Provider value={{ motionRef: createRef() }}>
      {ui}
    </ScrollContext.Provider>
  );

describe("StaticSections i18n", () => {
  it("ja dict로 Problem 섹션 일본어를 렌더한다 (T-10)", () => {
    const t = getDictionary("ja").landing;
    const { getByText } = renderWithScroll(<ProblemCards t={t} locale="ja" />);
    expect(getByText(t.problems.items[0].title)).toBeInTheDocument();
  });

  it("ja dict로 Feature 섹션 일본어를 렌더한다 (T-11)", () => {
    const t = getDictionary("ja").landing;
    const { getByText } = renderWithScroll(
      <FeatureShowcase t={t} locale="ja" />
    );
    expect(getByText(t.features.items[0].title)).toBeInTheDocument();
  });

  it("en dict로 FinalCTA 영어를 렌더한다 (T-12)", () => {
    const t = getDictionary("en").landing;
    const { container } = renderWithScroll(<FinalCTA t={t} locale="en" />);
    expect(container.textContent).toContain("Start free");
  });

  it("Stats metric: 3 locale 모두 45%·48·98%를 포함한다 (T-13)", () => {
    for (const locale of ["ko", "ja", "en"] as const) {
      const t = getDictionary(locale).landing;
      const { container } = renderWithScroll(
        <StatsSection t={t} locale={locale} />
      );
      expect(container.textContent).toContain("45%");
      expect(container.textContent).toContain("98%");
      expect(container.textContent).toContain(t.stats.items[2].metric);
    }
  });

  it("Stats metric 단위: 로케일별 시간 metric이 자기 단위만 포함한다 (T-14)", () => {
    const ja = getDictionary("ja").landing;
    const en = getDictionary("en").landing;
    const ko = getDictionary("ko").landing;
    const jaMetric = ja.stats.items[2].metric;
    const enMetric = en.stats.items[2].metric;
    const koMetric = ko.stats.items[2].metric;

    const { container: jaC } = renderWithScroll(
      <StatsSection t={ja} locale="ja" />
    );
    expect(jaC.textContent).toContain(jaMetric);
    expect(jaC.textContent).not.toContain(enMetric);

    const { container: enC } = renderWithScroll(
      <StatsSection t={en} locale="en" />
    );
    expect(enC.textContent).toContain(enMetric);
    expect(enC.textContent).not.toContain(jaMetric);

    const { container: koC } = renderWithScroll(
      <StatsSection t={ko} locale="ko" />
    );
    expect(koC.textContent).toContain(koMetric);
    expect(koC.textContent).not.toContain(jaMetric);
    expect(koC.textContent).not.toContain(enMetric);
  });

  it("ja dict로 TagChip name 일본어를 렌더한다 (T-15)", () => {
    const t = getDictionary("ja").landing;
    const { container } = renderWithScroll(
      <TagChipsSection t={t} locale="ja" />
    );
    expect(container.textContent).toContain(t.tagChips.chipNames.HOME_PARTY);
  });

  it("ja FinalCTA 보조 CTA href === '/ja/search', ko === '/search' (T-32)", () => {
    const ja = getDictionary("ja").landing;
    const { container: jaC } = renderWithScroll(
      <FinalCTA t={ja} locale="ja" />
    );
    const jaLink = jaC.querySelector<HTMLAnchorElement>('a[href$="/search"]');
    expect(jaLink).not.toBeNull();
    expect(jaLink?.getAttribute("href")).toBe("/ja/search");

    const ko = getDictionary("ko").landing;
    const { container: koC } = renderWithScroll(
      <FinalCTA t={ko} locale="ko" />
    );
    const koLink = koC.querySelector<HTMLAnchorElement>('a[href$="/search"]');
    expect(koLink).not.toBeNull();
    expect(koLink?.getAttribute("href")).toBe("/search");
  });

  it("HOME_PARTY 칩의 href는 /search/results?tags=HOME_PARTY (T-16)", () => {
    const t = getDictionary("ko").landing;
    const { container } = renderWithScroll(
      <TagChipsSection t={t} locale="ko" />
    );
    const link = container.querySelector(
      'a[href="/search/results?tags=HOME_PARTY"]'
    );
    expect(link).not.toBeNull();
  });

  it("ja/en 4섹션 렌더 트리에 한글이 없고 ko는 한글을 포함한다 (T-17)", () => {
    for (const locale of ["ja", "en"] as const) {
      const t = getDictionary(locale).landing;

      const { container: problemC } = renderWithScroll(
        <ProblemCards t={t} locale={locale} />
      );
      expect(problemC.textContent).not.toMatch(/[가-힣]/);

      const { container: statsC } = renderWithScroll(
        <StatsSection t={t} locale={locale} />
      );
      expect(statsC.textContent).not.toMatch(/[가-힣]/);

      const { container: featureC } = renderWithScroll(
        <FeatureShowcase t={t} locale={locale} />
      );
      expect(featureC.textContent).not.toMatch(/[가-힣]/);

      const { container: tagC } = renderWithScroll(
        <TagChipsSection t={t} locale={locale} />
      );
      expect(tagC.textContent).not.toMatch(/[가-힣]/);
    }

    const koT = getDictionary("ko").landing;
    const { container: koC } = renderWithScroll(
      <ProblemCards t={koT} locale="ko" />
    );
    expect(koC.textContent).toMatch(/[가-힣]/);
  });
});
