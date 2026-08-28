"use client";

import { useRef, useState } from "react";

import { ApiError, getErrorData } from "@/shared/api/errors";
import {
  useApiLocale,
  useLocalizedRouter,
  useYoutubeDict,
} from "@/shared/i18n";
import { useToastStore } from "@/shared/ui/toast";

import { useMyInfoQuery } from "@/entities/user/model/hooks";

import { mapJobFailureMessage } from "../lib/errors";
import { createExtractionJobV2 } from "./api";
import { useYoutubeDuplicateCheck, useYoutubeMeta } from "./hooks";
import { useYoutubeImportStoreV2 } from "./store";
import { jobByUrlSelector } from "./storeSelectors";

type UseYoutubeImportFlowParams = {
  validatedUrl: string | null;
  videoId: string | null;
  onLoginRequired: () => void;
};

export const useYoutubeImportFlow = ({
  validatedUrl,
  videoId,
  onLoginRequired,
}: UseYoutubeImportFlowParams) => {
  const router = useLocalizedRouter();
  const addToast = useToastStore((state) => state.addToast);
  const { user } = useMyInfoQuery();
  const locale = useApiLocale();
  const t = useYoutubeDict();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLockRef = useRef(false);

  const metaQuery = useYoutubeMeta(validatedUrl);
  const duplicateQuery = useYoutubeDuplicateCheck(validatedUrl);

  const createJob = useYoutubeImportStoreV2((state) => state.createJob);
  const setJobId = useYoutubeImportStoreV2((state) => state.setJobId);
  const failJob = useYoutubeImportStoreV2((state) => state.failJob);
  const existingJob = useYoutubeImportStoreV2(
    validatedUrl ? jobByUrlSelector(validatedUrl) : () => undefined
  );

  const youtubeMeta = metaQuery.data ?? undefined;
  const duplicateCheck = duplicateQuery.data;
  const isLoading =
    metaQuery.isLoading ||
    metaQuery.isFetching ||
    duplicateQuery.isLoading ||
    duplicateQuery.isFetching;
  const isDuplicate = duplicateCheck?.recipeId !== undefined;
  const hasYoutubeData = Boolean(youtubeMeta && !isLoading);
  const isMetaError = Boolean(validatedUrl && !isLoading && !youtubeMeta);
  const hasNoQuota = Boolean(user && (user.remainingYoutubeQuota ?? 0) < 2);
  const isImporting = isSubmitting;

  const confirmImport = async () => {
    if (
      !validatedUrl ||
      !videoId ||
      !youtubeMeta ||
      hasNoQuota ||
      isDuplicate ||
      submissionLockRef.current
    ) {
      return;
    }

    if (!user) {
      onLoginRequired();
      return;
    }

    if (existingJob) {
      router.push(`/users/${user.id}?tab=saved`, undefined);
      return;
    }

    submissionLockRef.current = true;
    setIsSubmitting(true);

    const idempotencyKey = createJob(validatedUrl, youtubeMeta, locale);

    router.push(`/users/${user.id}?tab=saved`, undefined);
    addToast({ message: t.sectionAnalyzingToast, variant: "info" });

    try {
      const { jobId } = await createExtractionJobV2(
        validatedUrl,
        idempotencyKey,
        undefined,
        locale
      );
      setJobId(idempotencyKey, jobId);
    } catch (error) {
      const errorData = ApiError.isApiError(error) ? getErrorData(error) : null;
      const errorMessage = errorData
        ? mapJobFailureMessage(
            {
              code: String(errorData.code),
              message: errorData.message,
              retryAfter: errorData.retryAfter,
            },
            t
          )
        : t.sectionExtractionFailed;

      failJob(idempotencyKey, undefined, errorMessage);
      addToast({ message: errorMessage, variant: "error" });
    } finally {
      submissionLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    youtubeMeta,
    duplicateCheck,
    isLoading,
    isDuplicate,
    hasYoutubeData,
    isMetaError,
    hasNoQuota,
    isImporting,
    confirmImport,
  };
};
