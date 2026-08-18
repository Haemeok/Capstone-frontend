import type { UserPagesDict } from "@/shared/i18n";

import type { useMonthlyCookingRecordShareRecords } from "./useMonthlyCookingRecordShareRecords";

export type MonthlyCookingRecordCopy =
  UserPagesDict["calendar"]["cookingRecord"];

export type MonthlyCookingRecordShareCopy = MonthlyCookingRecordCopy["share"];

export type MonthlyCookingRecordShareRecords = ReturnType<
  typeof useMonthlyCookingRecordShareRecords
>;
