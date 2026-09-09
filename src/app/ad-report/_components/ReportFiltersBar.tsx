import { RefreshCw } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { AdReportDatePicker } from "./AdReportDatePicker";
import { campaignDates, formatGeneratedAt } from "./reportFormat";
import type { AdReport, ReportFilters } from "./reportSchema";
import styles from "./ReportView.module.css";

type Props = {
  filters: ReportFilters;
  onChange: (filters: ReportFilters) => void;
  report: AdReport;
  placements: AdReport["byPlacement"];
  isFetching: boolean;
  onRefresh: () => void;
};

const mobilePlacementLabels: Record<string, string> = {
  recipe_info_bottom: "정보 하단",
  recipe_steps_top: "조리 상단",
  recipe_steps_mid: "조리 중간",
  recipe_bottom_anchor: "하단 고정",
};

export const ReportFiltersBar = ({
  filters,
  onChange,
  report,
  placements,
  isFetching,
  onRefresh,
}: Props) => {
  const dates = campaignDates(report);
  return (
    <div className={styles.filters}>
      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>조회 기간</span>
        <AdReportDatePicker
          value={filters.period ?? report.period}
          minDate={dates.from}
          maxDate={dates.maxDate}
          onApply={(period) => onChange({ ...filters, period })}
        />
      </div>
      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>광고 위치</span>
        <div
          className={styles.placementChips}
          role="group"
          aria-label="광고 위치"
        >
          {[{ placementCode: "", placementName: "전체" }, ...placements].map(
            (placement) => (
              <button
                type="button"
                key={placement.placementCode}
                aria-label={placement.placementName ?? placement.placementCode}
                aria-pressed={
                  (filters.placementCode ?? "") === placement.placementCode
                }
                onClick={() => {
                  if ((filters.placementCode ?? "") === placement.placementCode)
                    return;
                  triggerHaptic("Light");
                  onChange({
                    ...filters,
                    placementCode: placement.placementCode || undefined,
                  });
                }}
              >
                <span className={styles.desktopPlacement}>
                  {placement.placementName ?? placement.placementCode}
                </span>
                <span className={styles.mobilePlacement}>
                  {mobilePlacementLabels[placement.placementCode] ??
                    placement.placementName ??
                    placement.placementCode}
                </span>
              </button>
            )
          )}
          <div className={styles.refreshGroup}>
            <button
              type="button"
              aria-label="새로고침"
              disabled={isFetching}
              onClick={() => {
                triggerHaptic("Light");
                onRefresh();
              }}
            >
              <RefreshCw
                size={14}
                aria-hidden="true"
                className={isFetching ? styles.spinning : undefined}
              />
              <span className={styles.desktopPlacement}>새로고침</span>
            </button>
            <small>{formatGeneratedAt(report.generatedAt)}</small>
          </div>
        </div>
      </div>
    </div>
  );
};
