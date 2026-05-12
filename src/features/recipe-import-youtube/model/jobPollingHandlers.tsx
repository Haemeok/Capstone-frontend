import type { useRouter } from "next/navigation";

import type { QueryClient } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";
import { trackReviewAction } from "@/shared/lib/review";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";

import { scheduleReviewGate } from "@/features/review-gate";

import type { useToastStore } from "@/widgets/Toast";

import { JOB_POLLING_CONFIG } from "../lib/constants";
import { mapJobFailureMessage } from "../lib/errors";
import { createExtractionJobV2, getYoutubeJobStatus } from "./api";
import { useYoutubeImportStoreV2 } from "./store";
import { ActiveJob } from "./types";

type AppRouterInstance = ReturnType<typeof useRouter>;
type AddToast = ReturnType<typeof useToastStore.getState>["addToast"];

type StoreActions = {
  completeJob: (idempotencyKey: string, recipeId: string) => void;
  failJob: (
    idempotencyKey: string,
    code: string | undefined,
    message: string
  ) => void;
  removeJob: (idempotencyKey: string) => void;
  setJobId: (idempotencyKey: string, jobId: string) => void;
  updateLastPollTime: (idempotencyKey: string) => void;
  updateJobProgress: (
    idempotencyKey: string,
    progress: number,
    resultRecipeId?: string
  ) => void;
  incrementRetryCount: (idempotencyKey: string) => void;
};

export type JobPollingDeps = {
  queryClient: QueryClient;
  addToast: AddToast;
  router: AppRouterInstance;
  storeActions: StoreActions;
};

export const completePollingJob = (
  deps: JobPollingDeps,
  idempotencyKey: string,
  recipeId: string
) => {
  const jobsState = useYoutubeImportStoreV2.getState().jobs;
  const job = jobsState[idempotencyKey];

  if (!job || job.state === "completed") return;

  const meta = job.meta;

  deps.storeActions.completeJob(idempotencyKey, recipeId);

  deps.queryClient.invalidateQueries({ queryKey: ["recipes"] });
  deps.queryClient.invalidateQueries({ queryKey: ["recipes", "saved"] });
  deps.queryClient.invalidateQueries({ queryKey: ["myInfo"] });

  const shouldShow = trackReviewAction("youtube_extract");
  if (shouldShow) scheduleReviewGate();
  triggerHaptic("Success");

  deps.addToast({
    message: "",
    variant: "rich-youtube",
    position: "bottom",
    duration: 8000,
    dismissible: "both",
    richContent: {
      thumbnail: meta.thumbnailUrl,
      title: "레시피 추출이 완료 되었어요!",
      subtitle: meta.title,
      badgeIcon: <YouTubeIconBadge className="h-6 w-6" />,
      recipeId,
    },
    action: {
      onClick: () => deps.router.push(`/recipes/${recipeId}`),
    },
  });

  setTimeout(() => {
    deps.storeActions.removeJob(idempotencyKey);
  }, 2000);
};

export const failPollingJob = (
  deps: JobPollingDeps,
  idempotencyKey: string,
  code: string | undefined,
  message: string
) => {
  const jobsState = useYoutubeImportStoreV2.getState().jobs;
  const job = jobsState[idempotencyKey];

  if (!job || job.state === "completed" || job.state === "failed") return;

  deps.storeActions.failJob(idempotencyKey, code, message);

  deps.addToast({
    message,
    variant: "error",
  });
};

export const recoverZombieJob = async (
  deps: JobPollingDeps,
  job: ActiveJob
) => {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return;
  }

  if (job.retryCount >= JOB_POLLING_CONFIG.MAX_RETRY_COUNT) {
    failPollingJob(
      deps,
      job.idempotencyKey,
      undefined,
      "최대 재시도 횟수를 초과했습니다. 다시 시도해주세요."
    );
    return;
  }

  deps.storeActions.incrementRetryCount(job.idempotencyKey);

  try {
    const response = await createExtractionJobV2(
      job.url,
      job.idempotencyKey
    );
    deps.storeActions.setJobId(job.idempotencyKey, response.jobId);
  } catch {
    // 재시도도 실패하면 다음 폴링 사이클에서 다시 시도
  }
};

export const pollSingleJob = async (
  deps: JobPollingDeps,
  job: ActiveJob
) => {
  if (!job.jobId) {
    const timeSinceStart = Date.now() - job.startTime;
    if (timeSinceStart > JOB_POLLING_CONFIG.ZOMBIE_THRESHOLD_MS) {
      await recoverZombieJob(deps, job);
    }
    return;
  }

  try {
    const status = await getYoutubeJobStatus(job.jobId);

    deps.storeActions.updateLastPollTime(job.idempotencyKey);

    if (status.resultRecipeId) {
      completePollingJob(deps, job.idempotencyKey, status.resultRecipeId);
      return;
    }

    switch (status.status) {
      case "COMPLETED":
        if (status.resultRecipeId) {
          completePollingJob(deps, job.idempotencyKey, status.resultRecipeId);
        }
        break;

      case "FAILED":
        failPollingJob(
          deps,
          job.idempotencyKey,
          status.code,
          mapJobFailureMessage(status)
        );
        break;

      case "IN_PROGRESS":
      case "PENDING":
        deps.storeActions.updateJobProgress(
          job.idempotencyKey,
          status.progress || 0,
          status.resultRecipeId
        );
        break;
    }
  } catch {
    const timeSinceLastPoll = Date.now() - job.lastPollTime;
    if (timeSinceLastPoll > JOB_POLLING_CONFIG.ZOMBIE_THRESHOLD_MS) {
      await recoverZombieJob(deps, job);
    }
  }
};
