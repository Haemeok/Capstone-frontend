export type DailyAdReport = {
  date: string;
  impressions: number;
  viewableImpressions: number;
  clicks: number;
  ctrPercent: number | null;
};

export type MetricKey =
  | "impressions"
  | "viewableImpressions"
  | "clicks"
  | "ctr";

export type SeriesDefinition = {
  label: string;
  english: string;
  color: string;
  dash?: string;
};

export type ChartLayout = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  countMax: number;
  percentMax: number;
  hasCount: boolean;
  hasCtr: boolean;
  getX: (index: number) => number;
  getY: (value: number, metric: MetricKey) => number;
};

export const CHART_HEIGHT = 280;

export const DEFAULT_METRICS: MetricKey[] = ["impressions", "clicks", "ctr"];

export const METRIC_ORDER: MetricKey[] = [
  "impressions",
  "viewableImpressions",
  "clicks",
  "ctr",
];

export const SERIES: Record<MetricKey, SeriesDefinition> = {
  impressions: {
    label: "일반 노출",
    english: "Impressions",
    color: "#43c278",
  },
  viewableImpressions: {
    label: "가시 노출",
    english: "Viewable",
    color: "#0d9488",
    dash: "7 5",
  },
  clicks: {
    label: "클릭",
    english: "Clicks",
    color: "#a855f7",
  },
  ctr: {
    label: "클릭률",
    english: "CTR",
    color: "#60a5fa",
    dash: "3 4",
  },
};

export const getMetricValue = (
  row: DailyAdReport,
  metric: MetricKey
): number | null => {
  if (metric === "impressions") return row.impressions;
  if (metric === "viewableImpressions") return row.viewableImpressions;
  if (metric === "clicks") return row.clicks;
  return row.ctrPercent;
};

const getCountMax = (
  daily: DailyAdReport[],
  selectedMetrics: MetricKey[]
): number => {
  let rawCount = 1;

  for (const row of daily) {
    for (const metric of selectedMetrics) {
      if (metric === "ctr") continue;
      rawCount = Math.max(rawCount, getMetricValue(row, metric) ?? 0);
    }
  }

  const step =
    rawCount > 1000 ? 2000 : rawCount > 100 ? 100 : rawCount > 20 ? 20 : 4;
  return Math.ceil(rawCount / step) * step;
};

const getPercentMax = (daily: DailyAdReport[]): number => {
  let rawPercent = 0;

  for (const row of daily) {
    rawPercent = Math.max(rawPercent, row.ctrPercent ?? 0);
  }

  return Math.max(1, Math.ceil(rawPercent * 2) / 2);
};

export const getChartLayout = (
  daily: DailyAdReport[],
  selectedMetrics: MetricKey[],
  width: number
): ChartLayout => {
  const hasCtr = selectedMetrics.includes("ctr");
  const hasCount = selectedMetrics.some((metric) => metric !== "ctr");
  const left = 43;
  const right = hasCtr ? 47 : 16;
  const top = 32;
  const bottom = 36;
  const plotWidth = width - left - right;
  const countMax = getCountMax(daily, selectedMetrics);
  const percentMax = getPercentMax(daily);

  return {
    width,
    height: CHART_HEIGHT,
    left,
    right,
    top,
    bottom,
    countMax,
    percentMax,
    hasCount,
    hasCtr,
    getX: (index) =>
      left +
      plotWidth *
        (daily.length === 1 ? 0.5 : index / Math.max(1, daily.length - 1)),
    getY: (value, metric) =>
      CHART_HEIGHT -
      bottom -
      ((CHART_HEIGHT - top - bottom) * value) /
        (metric === "ctr" ? percentMax : countMax),
  };
};

export const getSeriesPath = (
  daily: DailyAdReport[],
  metric: MetricKey,
  layout: ChartLayout
): string => {
  let path = "";
  let hasPreviousPoint = false;

  daily.forEach((row, index) => {
    const value = getMetricValue(row, metric);
    if (value === null) {
      hasPreviousPoint = false;
      return;
    }

    path += `${hasPreviousPoint ? "L" : "M"}${layout.getX(index).toFixed(2)},${layout.getY(value, metric).toFixed(2)} `;
    hasPreviousPoint = true;
  });

  return path.trim();
};

export const getNearestDateIndex = (
  clientX: number,
  svgRect: DOMRect,
  layout: ChartLayout,
  rowCount: number
): number => {
  if (rowCount <= 1 || svgRect.width <= 0) return 0;

  const svgX = ((clientX - svgRect.left) / svgRect.width) * layout.width;
  const plotWidth = layout.width - layout.left - layout.right;
  const rawIndex = Math.round(
    ((svgX - layout.left) / plotWidth) * (rowCount - 1)
  );

  return Math.max(0, Math.min(rowCount - 1, rawIndex));
};

export const getDateTickIndices = (
  rowCount: number,
  width: number
): number[] => {
  if (rowCount <= 0) return [];

  const targetTickCount = width < 500 ? 4 : width < 800 ? 6 : 8;
  if (rowCount <= targetTickCount) {
    return Array.from({ length: rowCount }, (_, index) => index);
  }

  return Array.from({ length: targetTickCount }, (_, index) =>
    Math.round((index * (rowCount - 1)) / (targetTickCount - 1))
  );
};

export const formatDate = (date: string): string => {
  const [, month = "", day = ""] = date.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
};

export const formatShortDate = (date: string): string => {
  const [, month = "", day = ""] = date.split("-");
  return `${Number(month)}.${Number(day)}`;
};

export const formatMetricValue = (
  value: number | null,
  metric: MetricKey
): string => {
  if (value === null) return "—";
  if (metric === "ctr") return formatCtr(value);
  return `${formatCount(value)}회`;
};

export const getTimelineValueText = (
  row: DailyAdReport,
  selectedMetrics: MetricKey[]
): string =>
  `${formatDate(row.date)}, ${selectedMetrics
    .map((metric) => {
      const definition = SERIES[metric];
      return `${definition.label} ${formatMetricValue(getMetricValue(row, metric), metric)}`;
    })
    .join(", ")}`;
import { formatCount, formatCtr } from "./reportFormat";
