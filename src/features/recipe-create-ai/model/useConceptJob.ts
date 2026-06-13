"use client";

import { useCallback } from "react";

import type { AIModelId } from "@/shared/config/constants/aiModel";
import { useApiLocale, useT } from "@/shared/i18n";

import { calculateFakeProgress } from "../lib/progress";
import { createAIRecipeJobV2 } from "./api";
import { useAIRecipeStoreV2, useJobByConcept } from "./store";
import type { ActiveAIJob, AIModelRequestMap } from "./types";

type ConceptJobResult<C extends AIModelId> = {
  job: ActiveAIJob | undefined;
  isPending: boolean;
  isSuccess: boolean;
  isFailed: boolean;
  progress: number;
  submit: (
    request: AIModelRequestMap[C],
    requestSummary: string
  ) => Promise<void>;
  retry: () => void;
};

export const useConceptJob = <C extends AIModelId>(
  concept: C
): ConceptJobResult<C> => {
  const t = useT();
  const locale = useApiLocale();
  const createJob = useAIRecipeStoreV2((s) => s.createJob);
  const setJobId = useAIRecipeStoreV2((s) => s.setJobId);
  const failJob = useAIRecipeStoreV2((s) => s.failJob);
  const removeJob = useAIRecipeStoreV2((s) => s.removeJob);
  const job = useJobByConcept(concept);

  const isPending = job?.state === "creating" || job?.state === "polling";
  const isSuccess = job?.state === "completed";
  const isFailed = job?.state === "failed";

  const fakeProgress = job ? calculateFakeProgress(job.startTime) : 0;
  const realProgress = job?.progress ?? 0;
  const progress = isSuccess ? 100 : Math.max(fakeProgress, realProgress);

  const modelName = t.aiRecipe.models[concept].name;

  const submit = useCallback(
    async (request: AIModelRequestMap[C], requestSummary: string) => {
      const meta = {
        concept,
        displayName: modelName,
        requestSummary,
      };
      const idempotencyKey = createJob(concept, request, meta, locale);
      try {
        const response = await createAIRecipeJobV2(
          request,
          concept,
          idempotencyKey,
          undefined,
          locale
        );
        setJobId(idempotencyKey, response.jobId);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "레시피 생성에 실패했습니다.";
        failJob(idempotencyKey, undefined, message);
      }
    },
    [concept, createJob, setJobId, failJob, modelName, locale]
  );

  const retry = useCallback(() => {
    if (job) removeJob(job.idempotencyKey);
  }, [job, removeJob]);

  return { job, isPending, isSuccess, isFailed, progress, submit, retry };
};
