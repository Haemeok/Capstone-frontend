import { captureAnalyticsEvent } from "@/shared/lib/analytics/captureAnalyticsEvent";

import { getScrollSnapshot } from "./getScrollSnapshot";

const SAMPLE_INTERVAL_MS = 500;
const OBSERVATION_MS = 12000;
const MAX_REPORTS_PER_LOAD = 8;
const TOUCH_EVENTS = [
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
] as const;
let reportCount = 0;

export const startScrollDiagnostics = (
  container: HTMLElement,
  pathname: string
) => {
  if (reportCount >= MAX_REPORTS_PER_LOAD) {
    return {
      record: (_reason: string) => undefined,
      stop: (_reason: string) => undefined,
    };
  }
  const startedAt = performance.now();
  const trace: unknown[] = [];
  const touches = { touchstart: 0, touchmove: 0, touchend: 0, touchcancel: 0 };
  let lastTouch: TouchEvent | null = null;
  let lastMove: TouchEvent | null = null;
  let lastSampleAt = startedAt;
  let maxTimerDelay = 0;
  let scrollEvents = 0;
  let stopped = false;
  let markerCount = 0;
  let travelY = 0;
  let previousTouchY: number | null = null;

  const record = (reason: string) => {
    if (stopped || markerCount >= 40) return;
    markerCount += 1;
    trace.push({
      at: Math.round(performance.now() - startedAt),
      marker: reason,
      scrollTop: container.scrollTop,
    });
  };
  const onTouch = (event: TouchEvent) => {
    if (event.type === "touchstart") touches.touchstart += 1;
    if (event.type === "touchmove") {
      touches.touchmove += 1;
      lastMove = event;
    }
    if (event.type === "touchend") touches.touchend += 1;
    if (event.type === "touchcancel") touches.touchcancel += 1;
    const nextY = event.touches[0]?.clientY ?? null;
    if (
      event.type === "touchmove" &&
      previousTouchY !== null &&
      nextY !== null
    ) {
      travelY += Math.abs(nextY - previousTouchY);
    }
    previousTouchY = nextY;
    lastTouch = event;
  };
  const onScroll = () => {
    scrollEvents += 1;
  };
  const sample = () => {
    const now = performance.now();
    const timerDelay = Math.max(0, now - lastSampleAt - SAMPLE_INTERVAL_MS);
    maxTimerDelay = Math.max(maxTimerDelay, timerDelay);
    lastSampleAt = now;
    trace.push({
      at: Math.round(now - startedAt),
      timerDelay: Math.round(timerDelay),
      ...touches,
      travelY: Math.round(travelY),
      scrollEvents,
      lastTouchPrevented: lastTouch?.defaultPrevented ?? false,
      lastMovePrevented: lastMove?.defaultPrevented ?? false,
      ...getScrollSnapshot(container, lastTouch?.target ?? null),
    });
  };
  const interval = window.setInterval(sample, SAMPLE_INTERVAL_MS);
  const timeout = window.setTimeout(() => stop("timeout"), OBSERVATION_MS);
  const onVisibility = () => {
    if (document.visibilityState === "hidden") stop("hidden");
  };
  const stop = (reason: string) => {
    if (stopped) return;
    stopped = true;
    window.clearInterval(interval);
    window.clearTimeout(timeout);
    for (const type of TOUCH_EVENTS)
      document.removeEventListener(type, onTouch, true);
    container.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
    if (reportCount >= MAX_REPORTS_PER_LOAD) return;
    reportCount += 1;
    try {
      sample();
      const properties = {
        version: 1,
        pathname,
        reason,
        started_at: new Date(performance.timeOrigin + startedAt).toISOString(),
        duration_ms: Math.round(performance.now() - startedAt),
        touch_moves: touches.touchmove,
        max_timer_delay_ms: Math.round(maxTimerDelay),
        trace: JSON.stringify(trace),
      };
      console.log("[ios-scroll-diagnostic]", JSON.stringify(properties));
      captureAnalyticsEvent("ios_scroll_diagnostic", properties);
    } catch {
      return;
    }
  };
  for (const type of TOUCH_EVENTS) {
    document.addEventListener(type, onTouch, { passive: true, capture: true });
  }
  container.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  sample();
  return { record, stop };
};
