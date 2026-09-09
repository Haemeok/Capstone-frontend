"use client";

import { type RefObject, useMemo, useRef } from "react";

import styles from "./AdReportChart.module.css";
import {
  CHART_HEIGHT,
  type DailyAdReport,
  formatDate,
  formatMetricValue,
  getChartLayout,
  getMetricValue,
  getTimelineValueText,
  type MetricKey,
  SERIES,
} from "./adReportChartModel";
import { AdReportChartPlot } from "./AdReportChartPlot";
import { useChartInteraction } from "./useChartInteraction";
import { useChartTooltipPosition } from "./useChartTooltipPosition";
import { useChartWidth } from "./useChartWidth";

type AdReportChartCanvasProps = {
  daily: DailyAdReport[];
  selectedMetrics: MetricKey[];
};

const ChartTooltip = ({
  row,
  selectedMetrics,
  tooltipRef,
}: {
  row: DailyAdReport;
  selectedMetrics: MetricKey[];
  tooltipRef: RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={tooltipRef}
    id="ad-report-chart-tooltip"
    className={styles.tooltip}
    role="status"
  >
    <strong>{formatDate(row.date)}</strong>
    {selectedMetrics.map((metric) => {
      const definition = SERIES[metric];
      return (
        <div className={styles.tooltipRow} key={metric}>
          <span>
            <i
              className={styles.tooltipLine}
              style={{
                borderTopColor: definition.color,
                borderTopStyle: definition.dash ? "dashed" : "solid",
              }}
            />
            {definition.label}{" "}
            {metric === "ctr" ? (
              <span className={styles.english}>(CTR)</span>
            ) : null}
          </span>
          <b>{formatMetricValue(getMetricValue(row, metric), metric)}</b>
        </div>
      );
    })}
  </div>
);

export const AdReportChartCanvas = ({
  daily,
  selectedMetrics,
}: AdReportChartCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const width = useChartWidth(containerRef);
  const layout = useMemo(
    () => getChartLayout(daily, selectedMetrics, width),
    [daily, selectedMetrics, width]
  );
  const {
    activeIndex,
    activePoint,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handlePointerDown,
    handlePointerLeave,
    handlePointerMove,
  } = useChartInteraction({ chartRef, daily, layout });
  const activeRow = activeIndex === null ? null : daily[activeIndex];

  useChartTooltipPosition({
    activePoint,
    chartRef,
    containerRef,
    daily,
    layout,
    selectedMetrics,
    tooltipRef,
  });

  return (
    <div className={styles.chartWrap} ref={containerRef}>
      <svg
        ref={chartRef}
        className={styles.chart}
        viewBox={`0 0 ${layout.width} ${CHART_HEIGHT}`}
        role="group"
        aria-label="날짜별 광고 성과 선그래프"
        preserveAspectRatio="none"
      >
        <AdReportChartPlot
          activeIndex={activeIndex}
          daily={daily}
          layout={layout}
          selectedMetrics={selectedMetrics}
        />
        {daily.length > 0 ? (
          <rect
            className={styles.interactionLayer}
            x={layout.left}
            y={layout.top}
            width={layout.width - layout.left - layout.right}
            height={CHART_HEIGHT - layout.top - layout.bottom}
            fill="transparent"
            tabIndex={0}
            role="slider"
            aria-label="날짜별 성과 탐색"
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={daily.length - 1}
            aria-valuenow={activeIndex ?? 0}
            aria-valuetext={getTimelineValueText(
              daily[activeIndex ?? 0],
              selectedMetrics
            )}
            aria-describedby={
              activeIndex === null ? undefined : "ad-report-chart-tooltip"
            }
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          />
        ) : null}
      </svg>
      {activeRow ? (
        <ChartTooltip
          row={activeRow}
          selectedMetrics={selectedMetrics}
          tooltipRef={tooltipRef}
        />
      ) : null}
    </div>
  );
};
