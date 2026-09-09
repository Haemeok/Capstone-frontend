"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { ko } from "date-fns/locale";
import { CalendarDays, ChevronDown } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { DayPickerDynamic } from "@/shared/ui/DayPickerDynamic";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/shadcn/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/shadcn/popover";

import {
  type AdReportDateRange,
  formatCalendarDate,
  formatRangeSummary,
  formatTriggerRange,
  getInclusiveDayCount,
  getRecentRange,
  isSameRange,
  parseCalendarDate,
} from "./adReportDatePicker.helpers";
import styles from "./AdReportDatePicker.module.css";

const MAX_RANGE_DAY_COUNT = 93;
const MOBILE_QUERY = "(max-width: 650px)";

type AdReportDatePickerProps = {
  value: AdReportDateRange;
  minDate: string;
  maxDate: string;
  onApply: (range: AdReportDateRange) => void;
  disabled?: boolean;
};

type DatePickerPanelProps = {
  draft: DateRange;
  minDate: string;
  maxDate: string;
  month: Date;
  title: React.ReactNode;
  onDraftChange: (range: DateRange | undefined, selectedDate: Date) => void;
  onMonthChange: (month: Date) => void;
  onPresetSelect: (range: AdReportDateRange) => void;
  onCancel: () => void;
  onApply: () => void;
};

const toDateRange = (range: AdReportDateRange): DateRange => ({
  from: parseCalendarDate(range.from),
  to: parseCalendarDate(range.to),
});

const toCompleteRange = (range: DateRange): AdReportDateRange | null =>
  range.from && range.to
    ? {
        from: formatCalendarDate(range.from),
        to: formatCalendarDate(range.to),
      }
    : null;

const DatePickerPanel = ({
  draft,
  minDate,
  maxDate,
  month,
  title,
  onDraftChange,
  onMonthChange,
  onPresetSelect,
  onCancel,
  onApply,
}: DatePickerPanelProps) => {
  const min = parseCalendarDate(minDate);
  const max = parseCalendarDate(maxDate);
  const completeDraft = toCompleteRange(draft);
  const availableRange = { from: minDate, to: maxDate };
  const availableDayCount = getInclusiveDayCount(availableRange);
  const primaryPreset =
    availableDayCount <= MAX_RANGE_DAY_COUNT
      ? availableRange
      : getRecentRange(maxDate, minDate, MAX_RANGE_DAY_COUNT);
  const primaryPresetLabel =
    availableDayCount <= MAX_RANGE_DAY_COUNT ? "전체 기간" : "최근 93일";
  const recentSevenDays = getRecentRange(maxDate, minDate, 7);
  const isValid =
    completeDraft !== null &&
    getInclusiveDayCount(completeDraft) <= MAX_RANGE_DAY_COUNT;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>{title}</div>
      <div className={styles.presets} aria-label="빠른 기간 선택">
        <button
          type="button"
          aria-pressed={
            completeDraft !== null && isSameRange(completeDraft, primaryPreset)
          }
          onClick={() => onPresetSelect(primaryPreset)}
        >
          {primaryPresetLabel}
        </button>
        <button
          type="button"
          aria-pressed={
            completeDraft !== null &&
            isSameRange(completeDraft, recentSevenDays)
          }
          onClick={() => onPresetSelect(recentSevenDays)}
        >
          최근 7일
        </button>
      </div>
      <DayPickerDynamic
        animate
        mode="range"
        locale={ko}
        month={month}
        selected={draft}
        startMonth={min}
        endMonth={max}
        disabled={[{ before: min }, { after: max }]}
        max={MAX_RANGE_DAY_COUNT - 1}
        onSelect={onDraftChange}
        onMonthChange={onMonthChange}
        className={styles.calendar}
        classNames={{
          months: styles.months,
          month: styles.month,
          month_caption: styles.monthCaption,
          caption_label: styles.captionLabel,
          nav: styles.navigation,
          button_previous: styles.navigationButton,
          button_next: styles.navigationButton,
          month_grid: styles.monthGrid,
          weekdays: styles.weekdays,
          weekday: styles.weekday,
          week: styles.week,
          day: styles.day,
          day_button: styles.dayButton,
          outside: styles.outside,
          disabled: styles.disabledDay,
          range_start: styles.rangeStart,
          range_middle: styles.rangeMiddle,
          range_end: styles.rangeEnd,
          selected: styles.selected,
        }}
        formatters={{
          formatCaption: (date) =>
            `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
        }}
        labels={{
          labelPrevious: () => "이전 달",
          labelNext: () => "다음 달",
        }}
      />
      <p className={styles.summary} aria-live="polite">
        {completeDraft
          ? formatRangeSummary(completeDraft)
          : "종료일을 선택해 주세요. 최대 93일까지 조회할 수 있습니다."}
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          취소
        </button>
        <button
          type="button"
          className={styles.applyButton}
          disabled={!isValid}
          onClick={onApply}
        >
          적용
        </button>
      </div>
    </div>
  );
};

export const AdReportDatePicker = ({
  value,
  minDate,
  maxDate,
  onApply,
  disabled = false,
}: AdReportDatePickerProps) => {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(() => toDateRange(value));
  const [month, setMonth] = useState(() => parseCalendarDate(value.to));
  const triggerLabel = formatTriggerRange(value);

  const resetDraft = () => {
    setDraft(toDateRange(value));
    setMonth(parseCalendarDate(value.to));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      resetDraft();
      triggerHaptic("Light");
    } else {
      resetDraft();
    }

    setIsOpen(nextOpen);
  };

  const handleDraftChange = (
    nextRange: DateRange | undefined,
    selectedDate: Date
  ) => {
    if (!nextRange) {
      return;
    }

    triggerHaptic("Light");
    setDraft(
      draft.from && draft.to ? { from: selectedDate, to: undefined } : nextRange
    );
  };

  const handlePresetSelect = (range: AdReportDateRange) => {
    const nextDraft = toDateRange(range);
    const currentRange = toCompleteRange(draft);

    if (currentRange && isSameRange(currentRange, range)) {
      return;
    }

    triggerHaptic("Light");
    setDraft(nextDraft);
    setMonth(nextDraft.to ?? nextDraft.from ?? parseCalendarDate(maxDate));
  };

  const handleMonthChange = (nextMonth: Date) => {
    triggerHaptic("Light");
    setMonth(nextMonth);
  };

  const handleApply = () => {
    const range = toCompleteRange(draft);

    if (!range || getInclusiveDayCount(range) > MAX_RANGE_DAY_COUNT) {
      return;
    }

    onApply(range);
    setIsOpen(false);
  };

  const trigger = (
    <button
      type="button"
      className={styles.trigger}
      disabled={disabled}
      aria-label={`조회 기간 선택, 현재 ${triggerLabel}`}
      title="조회 기간 선택"
    >
      <CalendarDays aria-hidden="true" />
      <span>{triggerLabel}</span>
      <ChevronDown aria-hidden="true" />
    </button>
  );

  const panelProps = {
    draft,
    minDate,
    maxDate,
    month,
    onDraftChange: handleDraftChange,
    onMonthChange: handleMonthChange,
    onPresetSelect: handlePresetSelect,
    onCancel: () => handleOpenChange(false),
    onApply: handleApply,
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent
          className={styles.drawerContent}
          closeLabel="조회 기간 선택 닫기"
        >
          <DatePickerPanel
            {...panelProps}
            title={
              <DrawerTitle className={styles.title}>조회 기간 선택</DrawerTitle>
            }
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className={styles.popoverContent}
        align="start"
        sideOffset={8}
        aria-label="조회 기간 선택"
      >
        <DatePickerPanel
          {...panelProps}
          title={<h2 className={styles.title}>조회 기간 선택</h2>}
        />
      </PopoverContent>
    </Popover>
  );
};
