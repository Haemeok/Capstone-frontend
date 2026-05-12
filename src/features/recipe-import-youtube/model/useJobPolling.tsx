"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { useDocumentVisibility } from "@/shared/hooks/useDocumentVisibility";

import { useToastStore } from "@/widgets/Toast";

import { JOB_POLLING_CONFIG } from "../lib/constants";
import {
  JobPollingDeps,
  pollSingleJob,
} from "./jobPollingHandlers";
import { useYoutubeImportStoreV2 } from "./store";

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

  const deps = useMemo<JobPollingDeps>(
    () => ({
      queryClient,
      addToast,
      router,
      storeActions: {
        completeJob,
        failJob,
        removeJob,
        setJobId,
        updateLastPollTime,
        updateJobProgress,
        incrementRetryCount,
      },
    }),
    [
      queryClient,
      addToast,
      router,
      completeJob,
      failJob,
      removeJob,
      setJobId,
      updateLastPollTime,
      updateJobProgress,
      incrementRetryCount,
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
        await Promise.all(
          currentPendingJobs.map((job) => pollSingleJob(deps, job))
        );
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
  }, [isVisible, jobs, getPendingJobs, deps]);

  return {
    pendingJobCount: getPendingJobs().length,
    isPolling: isVisible && getPendingJobs().length > 0,
  };
};
