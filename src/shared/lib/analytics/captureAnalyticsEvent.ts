import { isPrivateReportDocument } from "@/shared/config/privateRoutes";

type AnalyticsEventProperties = Record<
  string,
  string | number | boolean | null
>;

type AnalyticsClient = {
  capture: (event: string, properties?: AnalyticsEventProperties) => unknown;
};

type PendingAnalyticsEvent = {
  event: string;
  properties: AnalyticsEventProperties;
};

const MAX_PENDING_EVENT_COUNT = 20;
const pendingEvents: PendingAnalyticsEvent[] = [];
let analyticsClient: AnalyticsClient | null = null;

export const captureAnalyticsEvent = (
  event: string,
  properties: AnalyticsEventProperties
): void => {
  if (isPrivateReportDocument()) return;
  if (analyticsClient) {
    analyticsClient.capture(event, properties);
    return;
  }
  if (pendingEvents.length < MAX_PENDING_EVENT_COUNT) {
    pendingEvents.push({ event, properties });
  }
};

export const registerAnalyticsClient = (client: AnalyticsClient): void => {
  analyticsClient = client;
  while (pendingEvents.length > 0) {
    const pending = pendingEvents.shift();
    if (pending) client.capture(pending.event, pending.properties);
  }
};
