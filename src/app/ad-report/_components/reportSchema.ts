import { z } from "zod";

const date = z.iso.date();
const instant = z.iso.datetime({ offset: true });
const metrics = z.object({
  impressions: z.number().int().nonnegative(),
  viewableImpressions: z.number().int().nonnegative(),
  clicks: z.number().int().nonnegative(),
  ctrPercent: z.number().nonnegative().nullable(),
});

export const reportSchema = z.object({
  campaign: z.object({
    id: z.string(),
    name: z.string(),
    advertiserName: z.string(),
    startAt: instant,
    endAt: instant,
    status: z.string(),
    displayStatus: z.string(),
  }),
  period: z.object({
    from: date,
    to: date,
    timezone: z.literal("Asia/Seoul"),
    placementCode: z.string().nullable(),
  }),
  measurement: z.object({
    impressionRule: z.string(),
    viewableImpressionRule: z.string(),
    clickRule: z.string(),
    ctrFormula: z.string(),
  }),
  summary: metrics,
  daily: z.array(metrics.extend({ date })),
  byPlacement: z.array(
    metrics.extend({
      placementCode: z.string(),
      placementName: z.string().nullable(),
    })
  ),
  generatedAt: instant,
});

export type AdReport = z.infer<typeof reportSchema>;
export type ReportMetrics = z.infer<typeof metrics>;
export type ReportPeriod = { from: string; to: string };
export type ReportFilters = { period?: ReportPeriod; placementCode?: string };
