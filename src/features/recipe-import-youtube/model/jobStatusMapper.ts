import type { YoutubeDict } from "@/shared/i18n";

import { mapJobFailureMessage } from "../lib/errors";
import type { JobStatusResponse } from "./types";

export type JobStateUpdate =
  | { state: "completed"; resultRecipeId: string }
  | { state: "failed"; code: string | undefined; message: string }
  | { state: "polling"; progress: number };

export const fromJobStatusResponse = (
  raw: JobStatusResponse,
  dict: YoutubeDict
): JobStateUpdate => {
  if (raw.resultRecipeId) {
    return { state: "completed", resultRecipeId: raw.resultRecipeId };
  }

  switch (raw.status) {
    case "COMPLETED":
      return { state: "polling", progress: raw.progress ?? 0 };

    case "FAILED":
      return {
        state: "failed",
        code: raw.code,
        message: mapJobFailureMessage(raw, dict),
      };

    case "PENDING":
    case "IN_PROGRESS":
      return { state: "polling", progress: raw.progress ?? 0 };
  }
};
