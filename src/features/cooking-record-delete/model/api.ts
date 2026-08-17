import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { CookingRecordSuccessResponse } from "@/entities/recipe/model/record";

export const deleteCookingRecord = async (
  recordId: string
): Promise<CookingRecordSuccessResponse> =>
  api.delete<CookingRecordSuccessResponse>(END_POINTS.MY_RECORD(recordId));
