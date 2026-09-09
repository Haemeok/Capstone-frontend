import { type RefObject, useLayoutEffect } from "react";

import {
  type ChartLayout,
  type DailyAdReport,
  getMetricValue,
  type MetricKey,
} from "./adReportChartModel";
import type { ActiveChartPoint } from "./useChartInteraction";

type UseChartTooltipPositionParams = {
  activePoint: ActiveChartPoint | null;
  chartRef: RefObject<SVGSVGElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  daily: DailyAdReport[];
  layout: ChartLayout;
  selectedMetrics: MetricKey[];
  tooltipRef: RefObject<HTMLDivElement | null>;
};

export const useChartTooltipPosition = ({
  activePoint,
  chartRef,
  containerRef,
  daily,
  layout,
  selectedMetrics,
  tooltipRef,
}: UseChartTooltipPositionParams) => {
  useLayoutEffect(() => {
    const chart = chartRef.current;
    const container = containerRef.current;
    const tooltip = tooltipRef.current;
    const row = activePoint ? daily[activePoint.index] : undefined;
    if (!activePoint || !chart || !container || !tooltip || !row) return;

    const chartRect = chart.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const scaleX = chartRect.width / layout.width;
    const scaleY = chartRect.height / layout.height;
    const anchorX =
      layout.getX(activePoint.index) * scaleX +
      chartRect.left -
      containerRect.left;
    const yValues = selectedMetrics.flatMap((metric) => {
      const value = getMetricValue(row, metric);
      return value === null ? [] : [layout.getY(value, metric)];
    });
    const fallbackY = yValues.length > 0 ? Math.min(...yValues) : layout.top;
    const anchorY =
      activePoint.pointerClientY === null
        ? fallbackY * scaleY + chartRect.top - containerRect.top
        : activePoint.pointerClientY - containerRect.top;
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    let left = anchorX + 14;

    if (left + tooltipWidth > containerRect.width - 8) {
      left = anchorX - tooltipWidth - 14;
    }

    left = Math.max(8, Math.min(left, containerRect.width - tooltipWidth - 8));
    const top = Math.max(
      8,
      Math.min(
        anchorY - tooltipHeight - 14,
        chartRect.top - containerRect.top + chartRect.height - tooltipHeight - 8
      )
    );

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }, [
    activePoint,
    chartRef,
    containerRef,
    daily,
    layout,
    selectedMetrics,
    tooltipRef,
  ]);
};
