import styles from "./AdReportChart.module.css";
import {
  CHART_HEIGHT,
  type ChartLayout,
  type DailyAdReport,
  formatShortDate,
  getDateTickIndices,
  getMetricValue,
  getSeriesPath,
  type MetricKey,
  SERIES,
} from "./adReportChartModel";

type ChartPlotProps = {
  activeIndex: number | null;
  daily: DailyAdReport[];
  layout: ChartLayout;
  selectedMetrics: MetricKey[];
};

const TICKS = [0, 1, 2, 3, 4];

const formatCountTick = (value: number): string =>
  value >= 1000 ? `${value / 1000}천` : String(value);

const ChartAxes = ({
  daily,
  layout,
}: {
  daily: DailyAdReport[];
  layout: ChartLayout;
}) => (
  <>
    {layout.hasCount ? (
      <text x={layout.left} y={14}>
        횟수
      </text>
    ) : null}
    {layout.hasCtr ? (
      <text x={layout.width - layout.right} y={14} textAnchor="end">
        <tspan className={styles.desktopAxisLabel}>CTR</tspan>
        <tspan className={styles.mobileAxisLabel}>클릭률</tspan> (%)
      </text>
    ) : null}
    {TICKS.map((tick) => {
      const y =
        CHART_HEIGHT -
        layout.bottom -
        ((CHART_HEIGHT - layout.top - layout.bottom) * tick) / 4;
      return (
        <g key={tick}>
          <line
            className={styles.gridLine}
            x1={layout.left}
            x2={layout.width - layout.right}
            y1={y}
            y2={y}
          />
          {layout.hasCount ? (
            <text x={layout.left - 9} y={y + 4} textAnchor="end">
              {formatCountTick((layout.countMax * tick) / 4)}
            </text>
          ) : null}
          {layout.hasCtr ? (
            <text x={layout.width - layout.right + 8} y={y + 4}>
              {((layout.percentMax * tick) / 4).toFixed(2)}
            </text>
          ) : null}
        </g>
      );
    })}
    {getDateTickIndices(daily.length, layout.width).map((index) => {
      const row = daily[index];
      return row ? (
        <text
          key={row.date}
          data-date-tick
          x={layout.getX(index)}
          y={CHART_HEIGHT - 10}
          textAnchor="middle"
        >
          {formatShortDate(row.date)}
        </text>
      ) : null;
    })}
  </>
);

const ChartSeries = ({
  daily,
  layout,
  selectedMetrics,
}: Omit<ChartPlotProps, "activeIndex">) => (
  <>
    {selectedMetrics.map((metric) => {
      const definition = SERIES[metric];
      return (
        <g key={metric}>
          <path
            className={styles.seriesPath}
            data-series={metric}
            d={getSeriesPath(daily, metric, layout)}
            fill="none"
            stroke={definition.color}
            strokeDasharray={definition.dash}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            vectorEffect="non-scaling-stroke"
          />
          {daily.map((row, index) => {
            const value = getMetricValue(row, metric);
            return value === null ? null : (
              <circle
                key={row.date}
                cx={layout.getX(index)}
                cy={layout.getY(value, metric)}
                fill="white"
                r={3.5}
                stroke={definition.color}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>
      );
    })}
  </>
);

const ActiveGuide = ({
  activeIndex,
  daily,
  layout,
  selectedMetrics,
}: ChartPlotProps) => {
  if (activeIndex === null) return null;
  const row = daily[activeIndex];
  if (!row) return null;
  const x = layout.getX(activeIndex);

  return (
    <g aria-hidden="true">
      <line
        className={styles.guideLine}
        x1={x}
        x2={x}
        y1={layout.top}
        y2={CHART_HEIGHT - layout.bottom}
      />
      {selectedMetrics.map((metric) => {
        const value = getMetricValue(row, metric);
        return value === null ? null : (
          <circle
            key={metric}
            cx={x}
            cy={layout.getY(value, metric)}
            fill="white"
            r={5}
            stroke={SERIES[metric].color}
            strokeWidth={2.5}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </g>
  );
};

export const AdReportChartPlot = ({
  activeIndex,
  daily,
  layout,
  selectedMetrics,
}: ChartPlotProps) => (
  <>
    <ChartAxes daily={daily} layout={layout} />
    <ChartSeries
      daily={daily}
      layout={layout}
      selectedMetrics={selectedMetrics}
    />
    <ActiveGuide
      activeIndex={activeIndex}
      daily={daily}
      layout={layout}
      selectedMetrics={selectedMetrics}
    />
  </>
);
