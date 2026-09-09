import type { AdReport } from "./reportSchema";

const koreanDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
export const seoulDate = (value: Date) => {
  const parts = koreanDate.formatToParts(value);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${read("year")}-${read("month")}-${read("day")}`;
};
export const formatReportDate = (date: string) =>
  date.split("-").map(Number).join(". ");
export const formatCount = (value: number) => value.toLocaleString("ko-KR");
export const formatCtr = (value: number | null) =>
  value === null ? "—" : `${value.toFixed(2)}%`;
export const formatGeneratedAt = (value: string) =>
  `${new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value))} 조회 기준`;
export const campaignDates = (report: AdReport) => {
  const from = seoulDate(new Date(report.campaign.startAt));
  const to = seoulDate(new Date(new Date(report.campaign.endAt).getTime() - 1));
  const today = seoulDate(new Date());
  return { from, to, maxDate: from > today ? from : to < today ? to : today };
};
