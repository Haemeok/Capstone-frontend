import { triggerHaptic } from "@/shared/lib/bridge";

import { formatCount, formatCtr, formatReportDate } from "./reportFormat";
import type { AdReport, ReportMetrics } from "./reportSchema";
import styles from "./ReportView.module.css";

const MetricCells = ({ metrics }: { metrics: ReportMetrics }) => (
  <>
    {[metrics.impressions, metrics.viewableImpressions, metrics.clicks].map(
      (value, index) => (
        <td key={index}>
          <span className={styles.exactNumber}>{formatCount(value)}</span>
          <span
            className={styles.compactNumber}
            aria-label={formatCount(value)}
          >
            {value >= 100000
              ? new Intl.NumberFormat("ko-KR", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(value)
              : formatCount(value)}
          </span>
        </td>
      )
    )}
    <td>{formatCtr(metrics.ctrPercent)}</td>
  </>
);

const TableHead = ({ first }: { first: string }) => (
  <thead>
    <tr>
      <th scope="col">{first}</th>
      {[
        ["일반 노출", "Impressions"],
        ["가시 노출", "Viewable"],
        ["클릭", "Clicks"],
        ["클릭률", "CTR"],
      ].map(([label, english]) => (
        <th key={label} scope="col">
          {label}
          <span className={styles.english}> ({english})</span>
        </th>
      ))}
    </tr>
  </thead>
);

export const ReportTables = ({ report }: { report: AdReport }) => (
  <>
    <div className={styles.sectionHead}>
      <h2>광고 위치별 성과</h2>
      <span>선택한 조회 기간 기준</span>
    </div>
    <table className={styles.table}>
      <caption className={styles.srOnly}>광고 위치별 성과</caption>
      <TableHead first="광고 위치" />
      <tbody>
        {report.byPlacement.map((row) => (
          <tr key={row.placementCode}>
            <th scope="row">{row.placementName ?? row.placementCode}</th>
            <MetricCells metrics={row} />
          </tr>
        ))}
        {!report.byPlacement.length ? (
          <tr>
            <td colSpan={5}>이 기간에 집계된 광고 위치가 없습니다.</td>
          </tr>
        ) : null}
      </tbody>
    </table>
    <details className={styles.details}>
      <summary onClick={() => triggerHaptic("Light")}>
        날짜별 수치 자세히 보기
      </summary>
      <table className={styles.table}>
        <caption className={styles.srOnly}>날짜별 성과</caption>
        <TableHead first="날짜" />
        <tbody>
          {report.daily.map((row) => (
            <tr key={row.date}>
              <th scope="row">
                {formatReportDate(row.date).split(". ").slice(1).join(". ")}
              </th>
              <MetricCells metrics={row} />
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  </>
);
