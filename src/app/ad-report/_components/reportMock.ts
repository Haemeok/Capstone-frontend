import { seoulDate } from "./reportFormat";
import type { AdReport, ReportFilters, ReportMetrics } from "./reportSchema";

const placements = [
  { placementCode: "recipe_info_bottom", placementName: "레시피 정보 하단" },
  { placementCode: "recipe_steps_top", placementName: "조리과정 상단" },
];

const dateOffset = (date: string, days: number) => {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
};

const sumMetrics = (rows: ReportMetrics[]): ReportMetrics => {
  const totals = rows.reduce(
    (sum, row) => ({
      impressions: sum.impressions + row.impressions,
      viewableImpressions: sum.viewableImpressions + row.viewableImpressions,
      clicks: sum.clicks + row.clicks,
    }),
    { impressions: 0, viewableImpressions: 0, clicks: 0 }
  );
  return {
    ...totals,
    ctrPercent: totals.impressions
      ? (totals.clicks / totals.impressions) * 100
      : null,
  };
};

export const createMockReport = (filters: ReportFilters): AdReport => {
  const today = seoulDate(new Date());
  const start = dateOffset(today, -13);
  const period = filters.period ?? { from: start, to: today };
  const rows = Array.from({ length: 14 }, (_, day) =>
    placements.map((placement, index) => {
      const impressions = Math.round(
        2800 + day * 160 + Math.sin(day * 1.3 + index) * 900 + index * 1100
      );
      const clicks = Math.round(
        impressions * (0.009 + (Math.sin(day * 0.8 + index) + 1) * 0.004)
      );
      return {
        ...placement,
        date: dateOffset(start, day),
        impressions,
        viewableImpressions: Math.round(
          impressions * (0.58 + (day % 4) * 0.04)
        ),
        clicks,
        ctrPercent: (clicks / impressions) * 100,
      };
    })
  )
    .flat()
    .filter(
      (row) =>
        row.date >= period.from &&
        row.date <= period.to &&
        (!filters.placementCode || row.placementCode === filters.placementCode)
    );
  return {
    campaign: {
      id: "demo-autumn-campaign",
      name: "가을 식탁, 간편한 한 끼",
      advertiserName: "다담식품",
      startAt: `${start}T00:00:00+09:00`,
      endAt: `${dateOffset(today, 22)}T00:00:00+09:00`,
      status: "ACTIVE",
      displayStatus: "RUNNING",
    },
    period: {
      ...period,
      timezone: "Asia/Seoul",
      placementCode: filters.placementCode ?? null,
    },
    measurement: {
      impressionRule: "CREATIVE_LOADED_AND_RENDER_STARTED",
      viewableImpressionRule: "VISIBLE_50_PERCENT_1_CONTINUOUS_SECOND",
      clickRule: "EACH_CLICK_EXCLUDING_RETRANSMISSIONS",
      ctrFormula: "clicks / impressions * 100",
    },
    summary: sumMetrics(rows),
    daily: [...new Set(rows.map((row) => row.date))].map((date) => ({
      date,
      ...sumMetrics(rows.filter((row) => row.date === date)),
    })),
    byPlacement: placements
      .filter(
        (placement) =>
          !filters.placementCode ||
          placement.placementCode === filters.placementCode
      )
      .map((placement) => ({
        ...placement,
        ...sumMetrics(
          rows.filter((row) => row.placementCode === placement.placementCode)
        ),
      })),
    generatedAt: new Date().toISOString(),
  };
};
