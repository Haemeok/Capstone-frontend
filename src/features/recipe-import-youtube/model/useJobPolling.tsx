"use client";

import { useCallback, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { triggerHaptic } from "@/shared/lib/bridge";
import { trackReviewAction } from "@/shared/lib/review";
import { useDocumentVisibility } from "@/shared/hooks/useDocumentVisibility";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";

import { useToastStore } from "@/widgets/Toast";

import { JOB_POLLING_CONFIG } from "../lib/constants";
import { mapJobFailureMessage } from "../lib/errors";
import { createExtractionJobV2, getYoutubeJobStatus } from "./api";
import { useYoutubeImportStoreV2 } from "./store";
import { ActiveJob } from "./types";

export const useJobPolling = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const isVisible = useDocumentVisibility();

  const jobs = useYoutubeImportStoreV2((state) => state.jobs);
  const completeJob = useYoutubeImportStoreV2((state) => state.completeJob);
  const failJob = useYoutubeImportStoreV2((state) => state.failJob);
  const updateJobProgress = useYoutubeImportStoreV2(
    (state) => state.updateJobProgress
  );
  const updateLastPollTime = useYoutubeImportStoreV2(
    (state) => state.updateLastPollTime
  );
  const incrementRetryCount = useYoutubeImportStoreV2(
    (state) => state.incrementRetryCount
  );
  const setJobId = useYoutubeImportStoreV2((state) => state.setJobId);
  const removeJob = useYoutubeImportStoreV2((state) => state.removeJob);
  const getPendingJobs = useYoutubeImportStoreV2(
    (state) => state.getPendingJobs
  );

  const isPollingRef = useRef(false);

  const handleJobComplete = useCallback(
    (idempotencyKey: string, recipeId: string) => {
      const jobsState = useYoutubeImportStoreV2.getState().jobs;
      const job = jobsState[idempotencyKey];
      
      if (!job || job.state === "completed") return;

      const meta = job.meta;

      completeJob(idempotencyKey, recipeId);

      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipes", "favorite"] });
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });

      trackReviewAction("youtube_extract");
      triggerHaptic("Success");

      addToast({
        message: "",
        variant: "rich-youtube",
        position: "bottom",
        persistent: true,
        dismissible: "both",
        richContent: {
          thumbnail: meta.thumbnailUrl,
          title: "레시피 추출이 완료 되었어요!",
          subtitle: meta.title,
          badgeIcon: <YouTubeIconBadge className="h-6 w-6" />,
          recipeId,
        },
        action: {
          onClick: () => router.push(`/recipes/${recipeId}`),
        },
      });

      setTimeout(() => {
        removeJob(idempotencyKey);
      }, 2000);
    },
    [completeJob, queryClient, addToast, router, removeJob]
  );

  const handleJobFail = useCallback(
    (idempotencyKey: string, code: string | undefined, message: string) => {
      const jobsState = useYoutubeImportStoreV2.getState().jobs;
      const job = jobsState[idempotencyKey];
      // 이미 실패/완료된 job이면 중복 처리 방지
      if (!job || job.state === "completed" || job.state === "failed") return;

      failJob(idempotencyKey, code, message);

      // 실패 시 사용자에게 피드백
      addToast({
        message: message,
        variant: "error",
      });
    },
    [failJob, addToast]
  );

  const handleZombieRecovery = useCallback(
    async (job: ActiveJob) => {
      // 오프라인이면 재시도하지 않고 대기
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        return;
      }

      if (job.retryCount >= JOB_POLLING_CONFIG.MAX_RETRY_COUNT) {
        handleJobFail(
          job.idempotencyKey,
          undefined,
          "최대 재시도 횟수를 초과했습니다. 다시 시도해주세요."
        );
        return;
      }

      incrementRetryCount(job.idempotencyKey);

      try {
        const response = await createExtractionJobV2(
          job.url,
          job.idempotencyKey
        );
        setJobId(job.idempotencyKey, response.jobId);
      } catch {
        // 재시도도 실패하면 다음 폴링 사이클에서 다시 시도
      }
    },
    [incrementRetryCount, setJobId, handleJobFail]
  );

  const pollJob = useCallback(
    async (job: ActiveJob) => {
      if (!job.jobId) {
        const timeSinceStart = Date.now() - job.startTime;
        if (timeSinceStart > JOB_POLLING_CONFIG.ZOMBIE_THRESHOLD_MS) {
          await handleZombieRecovery(job);
        }
        return;
      }

      try {
        const status = await getYoutubeJobStatus(job.jobId);

        updateLastPollTime(job.idempotencyKey);

        if (status.resultRecipeId) {
          handleJobComplete(job.idempotencyKey, status.resultRecipeId);
          return;
        }

        switch (status.status) {
          case "COMPLETED":
            if (status.resultRecipeId) {
              handleJobComplete(job.idempotencyKey, status.resultRecipeId);
            }
            break;

          case "FAILED":
            handleJobFail(
              job.idempotencyKey,
              status.code,
              mapJobFailureMessage(status)
            );
            break;

          case "IN_PROGRESS":
          case "PENDING":
            updateJobProgress(
              job.idempotencyKey,
              status.progress || 0,
              status.resultRecipeId
            );
            break;
        }
      } catch {
        const timeSinceLastPoll = Date.now() - job.lastPollTime;
        if (timeSinceLastPoll > JOB_POLLING_CONFIG.ZOMBIE_THRESHOLD_MS) {
          await handleZombieRecovery(job);
        }
      }
    },
    [
      updateLastPollTime,
      handleJobComplete,
      handleJobFail,
      updateJobProgress,
      handleZombieRecovery,
    ]
  );

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const pendingJobs = getPendingJobs();
    if (pendingJobs.length === 0) {
      return;
    }

    const pollAllJobs = async () => {
      if (isPollingRef.current) return;
      isPollingRef.current = true;

      try {
        const currentPendingJobs =
          useYoutubeImportStoreV2.getState().getPendingJobs();
        await Promise.all(currentPendingJobs.map(pollJob));
      } finally {
        isPollingRef.current = false;
      }
    };

    pollAllJobs();

    const intervalId = setInterval(
      pollAllJobs,
      JOB_POLLING_CONFIG.POLLING_INTERVAL_MS
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [isVisible, jobs, getPendingJobs, pollJob]);

  return {
    pendingJobCount: getPendingJobs().length,
    isPolling: isVisible && getPendingJobs().length > 0,
  };
};
