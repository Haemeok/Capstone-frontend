import { API_CONFIG } from "@/shared/api/config";

import {
  type AdReport,
  type ReportFilters,
  reportSchema,
} from "./reportSchema";

export class ReportError extends Error {
  constructor(
    public readonly status: number,
    public readonly retryAfterSeconds = 0
  ) {
    super("광고 리포트를 불러오지 못했습니다.");
    this.name = "ReportError";
  }
}

export const fetchAdReport = async (
  token: string,
  filters: ReportFilters,
  signal: AbortSignal
): Promise<AdReport> => {
  if (token === "demo") {
    const { createMockReport } = await import("./reportMock");
    return createMockReport(filters);
  }
  const url = new URL(
    `${API_CONFIG.baseURL}/ad-reports`,
    window.location.origin
  );
  if (filters.period) {
    url.searchParams.set("from", filters.period.from);
    url.searchParams.set("to", filters.period.to);
  }
  if (filters.placementCode)
    url.searchParams.set("placementCode", filters.placementCode);
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  if (signal.aborted) abort();
  const timeout = window.setTimeout(abort, API_CONFIG.timeout);
  try {
    const response = await fetch(url, {
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
      headers: { "X-Ad-Report-Token": token },
      signal: controller.signal,
    });
    if (!response.ok) {
      const retry = Number(response.headers.get("Retry-After"));
      throw new ReportError(
        response.status,
        response.status === 429
          ? retry > 0 && Number.isFinite(retry)
            ? retry
            : 60
          : 0
      );
    }
    const result = reportSchema.safeParse(await response.json());
    if (!result.success) throw new ReportError(502);
    return result.data;
  } catch (error) {
    if (error instanceof ReportError) throw error;
    throw new ReportError(0);
  } finally {
    window.clearTimeout(timeout);
    signal.removeEventListener("abort", abort);
  }
};
