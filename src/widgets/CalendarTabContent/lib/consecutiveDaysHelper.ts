import { RecipeDailySummary } from "@/entities/user";

import { ConsecutiveRange } from "../types";
import { getFlameLevel } from "./streakCalculator";

const toMidnight = (dateInput: string | Date): number => {
  const date = new Date(dateInput);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const isSameDay = (d1: Date, d2: Date) => {
  return d1.toDateString() === d2.toDateString();
};

const pushRange = (ranges: ConsecutiveRange[], currentRange: Date[]) => {
  if (currentRange.length > 0) {
    const flameConfig = getFlameLevel(currentRange.length);
    ranges.push({
      startDate: currentRange[0],
      endDate: currentRange[currentRange.length - 1],
      dates: [...currentRange],
      flameLevel: flameConfig.level,
    });
  }
};

export const findConsecutiveRanges = (
  dailySummaries: RecipeDailySummary[]
): ConsecutiveRange[] => {
  if (!dailySummaries.length) return [];

  const uniqueTimestamps = Array.from(
    new Set(dailySummaries.map((s) => toMidnight(s.date)))
  ).sort((a, b) => a - b);

  const ranges: ConsecutiveRange[] = [];

  if (uniqueTimestamps.length === 0) return [];

  let currentRange: Date[] = [new Date(uniqueTimestamps[0])];

  for (let i = 1; i < uniqueTimestamps.length; i++) {
    const prevTime = uniqueTimestamps[i - 1];
    const currTime = uniqueTimestamps[i];

    const oneDayInMs = 1000 * 60 * 60 * 24;
    const diff = currTime - prevTime;

    if (diff === oneDayInMs) {
      currentRange.push(new Date(currTime));
    } else {
      pushRange(ranges, currentRange);
      currentRange = [new Date(currTime)];
    }
  }

  pushRange(ranges, currentRange);

  return ranges;
};

export const isDateInRange = (
  date: Date,
  range: ConsecutiveRange
): boolean => {
  const targetTime = toMidnight(date);
  const startTime = toMidnight(range.startDate);
  const endTime = toMidnight(range.endDate);

  return targetTime >= startTime && targetTime <= endTime;
};

export const getRangeForDay = (
  date: Date,
  ranges: ConsecutiveRange[]
): ConsecutiveRange | undefined => {
  return ranges.find((range) => isDateInRange(date, range));
};

export const isFirstInRange = (date: Date, range: ConsecutiveRange): boolean => {
  return isSameDay(date, range.startDate);
};

export const isLastInRange = (date: Date, range: ConsecutiveRange): boolean => {
  return isSameDay(date, range.endDate);
};
