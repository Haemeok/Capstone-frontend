"use client";

import { useCallback, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useDocumentVisibility } from "@/shared/hooks/useDocumentVisibility";

import { useToastStore } from "@/widgets/Toast";

import { AI_JOB_POLLING_CONFIG } from "../lib/constants";
import { createAIRecipeJobV2, getAIRecipeJobStatus } from "./api";
import { useAIRecipeStoreV2 } from "./store";
import { ActiveAIJob } from "./types";

export const useAIJobPolling = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const isVisible = useDocumentVisibility();

  const jobs = useAIRecipeStoreV2((state) => state.jobs);
  const completeJob = useAIRecipeStoreV2((state) => state.completeJob);
  const failJob = useAIRecipeStoreV2((state) => state.failJob);
  const updateJobProgress = useAIRecipeStoreV2(
    (state) => state.updateJobProgress
  );
  const updateLastPollTime = useAIRecipeStoreV2(
    (state) => state.updateLastPollTime
  );
  const incrementRetryCount = useAIRecipeStoreV2(
    (state) => state.incrementRetryCount
  );
  const setJobId = useAIRecipeStoreV2((state) => state.setJobId);
  const removeJob = useAIRecipeStoreV2((state) => state.removeJob);
  const getPendingJobs = useAIRecipeStoreV2((state) => state.getPendingJobs);

  const isPollingRef = useRef(false);

  const handleJobComplete = useCallback(
    (idempotencyKey: string, recipeId: string) => {
      const jobsState = useAIRecipeStoreV2.getState().jobs;
      const job = jobsState[idempotencyKey];

      if (!job || job.state === "completed") return;

      const meta = job.meta;

      completeJob(idempotencyKey, recipeId);

      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipes", "favorite"] });
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });

      triggerHaptic("Success");

      addToast({
        message: `${meta.displayName} 레시피가 완성되었어요!`,
        variant: "success",
        position: "bottom",
        persistent: true,
        dismissible: "both",
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
      const jobsState = useAIRecipeStoreV2.getState().jobs;
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
    async (job: ActiveAIJob) => {
      // 오프라인이면 재시도하지 않고 대기
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        return;
      }

      if (job.retryCount >= AI_JOB_POLLING_CONFIG.MAX_RETRY_COUNT) {
        handleJobFail(
          job.idempotencyKey,
          undefined,
          "최대 재시도 횟수를 초과했습니다. 다시 시도해주세요."
        );
        return;
      }

      incrementRetryCount(job.idempotencyKey);

      try {
        const response = await createAIRecipeJobV2(
          job.request,
          job.concept,
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
    async (job: ActiveAIJob) => {
      if (!job.jobId) {
        const timeSinceStart = Date.now() - job.startTime;
        if (timeSinceStart > AI_JOB_POLLING_CONFIG.ZOMBIE_THRESHOLD_MS) {
          await handleZombieRecovery(job);
        }
        return;
      }

      try {
        const status = await getAIRecipeJobStatus(job.jobId);

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
              status.message || "AI 레시피 생성에 실패했습니다."
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
        if (timeSinceLastPoll > AI_JOB_POLLING_CONFIG.ZOMBIE_THRESHOLD_MS) {
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
          useAIRecipeStoreV2.getState().getPendingJobs();
        await Promise.all(currentPendingJobs.map(pollJob));
      } finally {
        isPollingRef.current = false;
      }
    };

    pollAllJobs();

    const intervalId = setInterval(
      pollAllJobs,
      AI_JOB_POLLING_CONFIG.POLLING_INTERVAL_MS
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
