import type { ReportCategory } from "../ReportCategoryButton";

export const REPORT_CATEGORIES: ReportCategory[] = [
  {
    value: "WRONG_QUANTITY",
    label: "⚖️ 양이 틀려요",
    description: "재료의 양이나 단위가 잘못됐어요",
  },
  {
    value: "WRONG_NAME",
    label: "✏️ 이름이 틀려요",
    description: "재료 이름이 잘못됐어요",
  },
  {
    value: "NOT_EXIST",
    label: "🚫 필요 없는 재료예요",
    description: "레시피에 없어도 되는 재료예요",
  },
  {
    value: "ETC",
    label: "💬 기타 문제가 있어요",
    description: "품절, 링크 오류 등 다른 문제가 있어요",
  },
];

export const RETURN_TO_LIST_DELAY_MS = 2000;

export type Phase = "list" | "report" | "missing" | "success";
