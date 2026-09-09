import { formatCount, formatCtr } from "./reportFormat";
import type { ReportMetrics } from "./reportSchema";
import styles from "./ReportView.module.css";

export const ReportSummary = ({ summary }: { summary: ReportMetrics }) => (
  <div className={styles.metrics}>
    {[
      {
        label: "일반 노출",
        value: formatCount(summary.impressions),
        description: "광고가 표시된 횟수",
      },
      {
        label: "가시 노출",
        value: formatCount(summary.viewableImpressions),
        description: "50% 이상 · 연속 1초",
      },
      {
        label: "클릭",
        value: formatCount(summary.clicks),
        description: "광고 링크를 누른 횟수",
      },
      {
        label: "클릭률",
        value: formatCtr(summary.ctrPercent),
        description: "일반 노출 대비 클릭 비율",
        english: " (CTR)",
      },
    ].map(({ label, value, description, english }) => (
      <div key={label} className={styles.metric}>
        <div>
          {label}
          <span className={styles.english}>{english}</span>
        </div>
        <strong className={styles.number}>{value}</strong>
        <small>{description}</small>
      </div>
    ))}
  </div>
);
