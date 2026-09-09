import { useState } from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";

import { AdReportChart } from "./AdReportChart";
import { fetchAdReport, ReportError } from "./reportApi";
import { ReportFiltersBar } from "./ReportFiltersBar";
import { campaignDates, formatReportDate } from "./reportFormat";
import type { AdReport, ReportFilters } from "./reportSchema";
import { ReportStatus } from "./ReportStatus";
import { ReportSummary } from "./ReportSummary";
import { ReportTables } from "./ReportTables";
import styles from "./ReportView.module.css";

const statusLabels: Record<string, string> = {
  DRAFT: "준비 중",
  SCHEDULED: "집행 예정",
  RUNNING: "집행 중",
  PAUSED: "일시 중단",
  ENDED: "집행 종료",
};

export const ReportDashboard = ({
  token,
  sessionId,
  initialReport,
}: {
  token: string;
  sessionId: number;
  initialReport: AdReport;
}) => {
  const [filters, setFilters] = useState<ReportFilters>({
    period: initialReport.period,
  });
  const query = useQuery({
    queryKey: [
      "ad-report",
      sessionId,
      filters.period?.from,
      filters.period?.to,
      filters.placementCode ?? null,
    ],
    queryFn: ({ signal }) => fetchAdReport(token, filters, signal),
    initialData:
      filters.period?.from === initialReport.period.from &&
      filters.period?.to === initialReport.period.to &&
      !filters.placementCode
        ? initialReport
        : undefined,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  });
  const report = query.data ?? initialReport;
  const dates = campaignDates(report);
  if (
    query.error instanceof ReportError &&
    [401, 403].includes(query.error.status)
  )
    return <ReportStatus error={query.error} />;
  return (
    <>
      <p className={styles.advertiser}>{report.campaign.advertiserName}</p>
      <div className={styles.titleRow}>
        <h1>{report.campaign.name}</h1>
        <span
          className={
            report.campaign.displayStatus === "RUNNING"
              ? styles.running
              : styles.campaignStatus
          }
        >
          {statusLabels[report.campaign.displayStatus] ?? "상태 확인 중"}
        </span>
      </div>
      <p className={styles.metadata}>
        집행 기간 {formatReportDate(dates.from)} – {formatReportDate(dates.to)}
      </p>
      <ReportFiltersBar
        filters={filters}
        onChange={setFilters}
        report={report}
        placements={initialReport.byPlacement}
        isFetching={query.isFetching}
        onRefresh={() => void query.refetch()}
      />
      {query.error ? (
        <ReportStatus
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <div aria-busy={query.isFetching}>
          <div className={styles.sectionHead}>
            <h2>
              {!report.period.placementCode &&
              report.period.from === dates.from &&
              report.period.to === dates.maxDate
                ? "캠페인 전체 요약"
                : "선택 기간·위치 요약"}
            </h2>
            <span>
              {query.isFetching
                ? "조회 중…"
                : `${formatReportDate(report.period.from)} – ${formatReportDate(report.period.to)}`}
            </span>
          </div>
          <ReportSummary summary={report.summary} />
          <AdReportChart daily={report.daily} />
          <ReportTables report={report} />
        </div>
      )}
      <details className={styles.details}>
        <summary onClick={() => triggerHaptic("Light")}>
          성과는 어떻게 집계되나요?
        </summary>
        <p>일반 노출은 광고 이미지가 로드되어 표시되기 시작한 횟수입니다.</p>
        <p>
          가시 노출은 광고 면적의 50% 이상이 활성 화면에서 연속 1초 동안 표시된
          횟수입니다. 일반 노출과 합산하지 않습니다.
        </p>
        <p>
          클릭률은 일반 노출 대비 클릭의 백분율입니다. 일반 노출이 없으면 ‘—’로
          표시합니다.
        </p>
      </details>
      <p className={styles.footnote}>
        모든 날짜는 한국 시간 기준입니다. 수신된 광고 이벤트를 기준으로
        집계하며, 늦게 도착한 이벤트에 따라 수치가 달라질 수 있습니다.
      </p>
    </>
  );
};
