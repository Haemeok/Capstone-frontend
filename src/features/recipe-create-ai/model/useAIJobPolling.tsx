"use client";

import { useCallback, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { addRecentAIRecipe } from "@/shared/config/constants/localStorage";
import { useDocumentVisibility } from "@/shared/hooks/useDocumentVisibility";
import { appGlobalMessages, format, useLocalizedRouter } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import AIGeneratedBadge from "@/shared/ui/badge/AIGeneratedBadge";

import { getRecipe } from "@/entities/recipe";

import { useToastStore } from "@/shared/ui/toast";

import { AI_JOB_POLLING_CONFIG } from "../lib/constants";
import { createAIRecipeJobV2, getAIRecipeJobStatus } from "./api";
import { fromAIJobStatusResponse } from "./jobStatusMapper";
import { useAIRecipeStoreV2 } from "./store";
import { ActiveAIJob } from "./types";

export const useAIJobPolling = () => {
  const router = useLocalizedRouter();
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
    async (idempotencyKey: string, recipeId: string) => {
      const jobsState = useAIRecipeStoreV2.getState().jobs;
      const job = jobsState[idempotencyKey];

      if (!job || job.state === "completed") return;

      const meta = job.meta;
      const t = appGlobalMessages[job.locale];

      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });

      triggerHaptic("Success");

      let toastId: number | undefined;

      try {
        const recipe = await queryClient.fetchQuery({
          queryKey: ["recipe", recipeId],
          queryFn: () => getRecipe(recipeId),
        });

        addRecentAIRecipe({
          recipeId: recipe.id,
          aiModelId: meta.concept,
          timestamp: Date.now(),
          title: recipe.title,
          imageUrl: recipe.imageUrl,
          authorName: recipe.author.nickname,
          authorId: recipe.author.id,
          profileImage: recipe.author.profileImage,
          cookingTime: recipe.cookingTime,
          createdAt: recipe.createdAt || new Date().toISOString(),
        });

        toastId = addToast({
          message: "",
          variant: "rich-youtube",
          position: "bottom",
          duration: 8000,
          dismissible: "both",
          richContent: {
            thumbnail: recipe.imageUrl,
            title: t.aiJob.completeTitle,
            subtitle: recipe.title,
            badgeIcon: <AIGeneratedBadge className="flex-shrink-0" />,
            recipeId,
          },
          action: {
            onClick: () => router.push(`/recipes/${recipeId}`),
          },
        });
      } catch {
        toastId = addToast({
          message: format(t.aiJob.completeFallback, {
            name: meta.displayName,
          }),
          variant: "success",
          position: "bottom",
          duration: 8000,
          dismissible: "both",
          action: {
            onClick: () => router.push(`/recipes/${recipeId}`),
          },
        });
      }

      completeJob(idempotencyKey, recipeId, toastId);

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
          appGlobalMessages[job.locale].aiJob.maxRetryExceeded
        );
        return;
      }

      incrementRetryCount(job.idempotencyKey);

      try {
        const response = await createAIRecipeJobV2(
          job.request,
          job.concept,
          job.idempotencyKey,
          undefined,
          job.locale
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

        const update = fromAIJobStatusResponse(status);

        switch (update.state) {
          case "completed":
            handleJobComplete(job.idempotencyKey, update.resultRecipeId);
            break;

          case "failed":
            handleJobFail(job.idempotencyKey, update.code, update.message);
            break;

          case "polling":
            updateJobProgress(job.idempotencyKey, update.progress);
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
        const currentPendingJobs = useAIRecipeStoreV2
          .getState()
          .getPendingJobs();
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
