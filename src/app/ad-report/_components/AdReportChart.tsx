"use client";

import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

import styles from "./AdReportChart.module.css";
import { AdReportChartCanvas } from "./AdReportChartCanvas";
import {
  type DailyAdReport,
  DEFAULT_METRICS,
  METRIC_ORDER,
  type MetricKey,
  SERIES,
} from "./adReportChartModel";

export type AdReportChartProps = {
  daily: DailyAdReport[];
};

type MetricControlsProps = {
  selectedMetrics: MetricKey[];
  onToggle: (metric: MetricKey) => void;
};

const MetricControls = ({ selectedMetrics, onToggle }: MetricControlsProps) => (
  <div className={styles.metricControls} aria-label="그래프 지표">
    {METRIC_ORDER.map((metric) => {
      const definition = SERIES[metric];
      return (
        <button
          key={metric}
          type="button"
          aria-pressed={selectedMetrics.includes(metric)}
          onClick={() => onToggle(metric)}
        >
          {definition.label}{" "}
          <span className={styles.english}>({definition.english})</span>
        </button>
      );
    })}
  </div>
);

const ChartLegend = ({ selectedMetrics }: { selectedMetrics: MetricKey[] }) => (
  <div className={styles.legendList} aria-label="그래프 범례">
    {selectedMetrics.map((metric) => {
      const definition = SERIES[metric];
      return (
        <span className={styles.legend} key={metric}>
          <i
            className={styles.legendLine}
            style={{
              borderTopColor: definition.color,
              borderTopStyle: definition.dash ? "dashed" : "solid",
            }}
          />
          {definition.label}{" "}
          <span className={styles.english}>({definition.english})</span>
        </span>
      );
    })}
  </div>
);

export const AdReportChart = ({ daily }: AdReportChartProps) => {
  const [selectedMetrics, setSelectedMetrics] =
    useState<MetricKey[]>(DEFAULT_METRICS);

  const handleMetricToggle = (metric: MetricKey) => {
    const isSelected = selectedMetrics.includes(metric);
    if (isSelected && selectedMetrics.length === 1) return;

    triggerHaptic("Light");
    setSelectedMetrics((current) =>
      current.includes(metric)
        ? current.filter((selected) => selected !== metric)
        : METRIC_ORDER.filter(
            (orderedMetric) =>
              current.includes(orderedMetric) || orderedMetric === metric
          )
    );
  };

  return (
    <section className={styles.root} aria-labelledby="ad-report-chart-title">
      <div className={styles.heading}>
        <h2 id="ad-report-chart-title">날짜별 성과</h2>
        <MetricControls
          selectedMetrics={selectedMetrics}
          onToggle={handleMetricToggle}
        />
      </div>
      <ChartLegend selectedMetrics={selectedMetrics} />
      <AdReportChartCanvas daily={daily} selectedMetrics={selectedMetrics} />
    </section>
  );
};
