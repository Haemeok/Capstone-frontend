export const reportFixture = {
  campaign: {
    id: "101",
    name: "가을 식탁, 간편한 한 끼",
    advertiserName: "다담식품",
    startAt: "2026-09-01T00:00:00+09:00",
    endAt: "2026-10-01T00:00:00+09:00",
    status: "ACTIVE",
    displayStatus: "RUNNING",
  },
  period: {
    from: "2026-09-01",
    to: "2026-09-08",
    timezone: "Asia/Seoul",
    placementCode: null,
  },
  measurement: {
    impressionRule: "CREATIVE_LOADED_AND_RENDER_STARTED",
    viewableImpressionRule: "VISIBLE_50_PERCENT_1_CONTINUOUS_SECOND",
    clickRule: "EACH_CLICK_EXCLUDING_RETRANSMISSIONS",
    ctrFormula: "clicks / impressions * 100",
  },
  summary: {
    impressions: 10000,
    viewableImpressions: 6400,
    clicks: 80,
    ctrPercent: 0.8,
  },
  daily: [
    {
      date: "2026-09-01",
      impressions: 4000,
      viewableImpressions: 2500,
      clicks: 30,
      ctrPercent: 0.75,
    },
    {
      date: "2026-09-02",
      impressions: 6000,
      viewableImpressions: 3900,
      clicks: 50,
      ctrPercent: 0.83,
    },
  ],
  byPlacement: [
    {
      placementCode: "recipe_info_bottom",
      placementName: "레시피 정보 하단",
      impressions: 6000,
      viewableImpressions: 4000,
      clicks: 50,
      ctrPercent: 0.83,
    },
    {
      placementCode: "recipe_steps_top",
      placementName: "조리과정 상단",
      impressions: 4000,
      viewableImpressions: 2400,
      clicks: 30,
      ctrPercent: 0.75,
    },
  ],
  generatedAt: "2026-09-09T09:00:00+09:00",
};
