import { type RefObject, useEffect, useState } from "react";

const DEFAULT_CHART_WIDTH = 1000;

export const useChartWidth = (
  containerRef: RefObject<HTMLDivElement | null>
): number => {
  const [width, setWidth] = useState(DEFAULT_CHART_WIDTH);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = (nextWidth: number) => {
      if (nextWidth > 0) setWidth(nextWidth);
    };

    updateWidth(container.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) updateWidth(entry.contentRect.width);
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef]);

  return width;
};
