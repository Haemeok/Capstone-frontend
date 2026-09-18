import type { CookingRecordListItem } from "@/entities/recipe";

export type MonthlyCookingRecordShareItem = {
  id: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  record?: CookingRecordListItem;
};
