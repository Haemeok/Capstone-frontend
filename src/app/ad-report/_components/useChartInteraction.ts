import {
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
  useState,
} from "react";

import {
  type ChartLayout,
  type DailyAdReport,
  getNearestDateIndex,
} from "./adReportChartModel";

export type ActiveChartPoint = {
  index: number;
  pointerClientY: number | null;
};

type UseChartInteractionParams = {
  chartRef: RefObject<SVGSVGElement | null>;
  daily: DailyAdReport[];
  layout: ChartLayout;
};

export const useChartInteraction = ({
  chartRef,
  daily,
  layout,
}: UseChartInteractionParams) => {
  const [activePoint, setActivePoint] = useState<ActiveChartPoint | null>(null);
  const activeIndex =
    activePoint && daily[activePoint.index] ? activePoint.index : null;

  const selectNearestDate = (
    clientX: number,
    pointerClientY: number | null
  ) => {
    const chartRect = chartRef.current?.getBoundingClientRect();
    if (!chartRect || daily.length === 0) return;

    setActivePoint({
      index: getNearestDateIndex(clientX, chartRect, layout, daily.length),
      pointerClientY,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<SVGRectElement>) => {
    if (daily.length === 0) return;
    const currentIndex = activeIndex ?? 0;
    let nextIndex = currentIndex;

    if (event.key === "ArrowLeft") nextIndex = Math.max(0, currentIndex - 1);
    else if (event.key === "ArrowRight")
      nextIndex = Math.min(daily.length - 1, currentIndex + 1);
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = daily.length - 1;
    else if (event.key === "Escape") {
      setActivePoint(null);
      return;
    } else return;

    event.preventDefault();
    setActivePoint({ index: nextIndex, pointerClientY: null });
  };

  return {
    activeIndex,
    activePoint: activeIndex === null ? null : activePoint,
    handleBlur: () => setActivePoint(null),
    handleFocus: () =>
      setActivePoint(
        (current) => current ?? { index: 0, pointerClientY: null }
      ),
    handleKeyDown,
    handlePointerDown: (event: PointerEvent<SVGRectElement>) =>
      selectNearestDate(event.clientX, event.clientY),
    handlePointerLeave: (event: PointerEvent<SVGRectElement>) => {
      if (event.pointerType !== "touch") setActivePoint(null);
    },
    handlePointerMove: (event: PointerEvent<SVGRectElement>) => {
      if (event.pointerType !== "touch") {
        selectNearestDate(event.clientX, event.clientY);
      }
    },
  };
};
