import type { IngredientReportReason } from "@/entities/recipe/model/api";

export type ReportReasonValue = Exclude<IngredientReportReason, "MISSING">;

export const REPORT_CATEGORIES: { value: ReportReasonValue }[] = [
  { value: "WRONG_QUANTITY" },
  { value: "WRONG_NAME" },
  { value: "NOT_EXIST" },
  { value: "ETC" },
];

export const RETURN_TO_LIST_DELAY_MS = 2000;

export type Phase = "list" | "report" | "missing" | "success";
