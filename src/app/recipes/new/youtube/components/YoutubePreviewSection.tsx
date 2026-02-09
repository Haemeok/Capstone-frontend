"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useAutoScrollOnMobile } from "@/shared/hooks/useAutoScrollOnMobile";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { useMyInfoQuery } from "@/entities/user/model/hooks";

import {
  createExtractionJobV2,
  DuplicateRecipeSection,
  useYoutubeDuplicateCheck,
  useYoutubeImportStoreV2,
  useYoutubeMeta,
  YoutubePreviewCard,
} from "@/features/recipe-import-youtube";

import UsageLimitBanner from "@/widgets/AIRecipeForm/UsageLimitBanner";
import { useToastStore } from "@/widgets/Toast";

import { useYoutubeUrl } from "./YoutubeUrlProvider";

const SCROLL_DELAY_MS = 500;

const DuplicateRecipeErrorFallback = () => (
  <div className="mx-auto w-full max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
    <p className="font-medium text-amber-800">
      레시피 정보를 불러올 수 없습니다.
    </p>
    <p className="mt-1 text-sm text-amber-600">
      해당 레시피가 삭제되었거나 비공개 상태일 수 있습니다.
    </p>
  </div>
);

const PreviewLoadingSkeleton = () => (
  <div className="mx-auto w-full animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <div className="flex gap-4">
      <Skeleton className="h-24 w-40 rounded-xl" />
      <div className="flex-1 space-y-3 py-2">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
    </div>
    <Skeleton className="mt-6 h-14 w-full rounded-xl" />
  </div>
);

const PreviewErrorMessage = () => (
  <div className="animate-fade-in mx-auto w-full rounded-2xl bg-red-50/80 p-6 text-center text-red-600">
    <p className="font-medium">
      영상 정보를 불러올 수 없습니다.
      <br />
      올바른 링크인지, 공개된 영상인지 확인해주세요.
    </p>
  </div>
);

type YoutubePreviewSectionProps = {
  onLoginRequired: () => void;
};

export const YoutubePreviewSection = ({
  onLoginRequired,
}: YoutubePreviewSectionProps) => {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  const { user } = useMyInfoQuery();
  const { validatedUrl, videoId, urlSource } = useYoutubeUrl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasNoQuota = user?.remainingYoutubeQuota === 0;

  const {
    data: youtubeMeta,
    isLoading: isLoadingMeta,
    isFetching: isFetchingMeta,
  } = useYoutubeMeta(validatedUrl);

  const {
    data: duplicateCheck,
    isLoading: isCheckingDuplicate,
    isFetching: isFetchingDuplicate,
  } = useYoutubeDuplicateCheck(validatedUrl);

  const createJob = useYoutubeImportStoreV2((state) => state.createJob);
  const setJobId = useYoutubeImportStoreV2((state) => state.setJobId);
  const failJob = useYoutubeImportStoreV2((state) => state.failJob);
  const existingJob = useYoutubeImportStoreV2((state) =>
    validatedUrl ? state.getJobByUrl(validatedUrl) : undefined
  );

  const isImporting =
    isSubmitting ||
    (existingJob?.state === "creating" || existingJob?.state === "polling");
  const isDuplicate = duplicateCheck?.recipeId !== undefined;

  const hasYoutubeData =
    youtubeMeta &&
    !isLoadingMeta &&
    !isFetchingMeta &&
    !isCheckingDuplicate &&
    !isFetchingDuplicate;

  const isShowingPreviewSection =
    isLoadingMeta ||
    isFetchingMeta ||
    isCheckingDuplicate ||
    isFetchingDuplicate ||
    (validatedUrl && !youtubeMeta) ||
    hasYoutubeData;

  const previewSectionRef = useAutoScrollOnMobile(
    !!isShowingPreviewSection,
    SCROLL_DELAY_MS
  );

  const isLoading =
    isLoadingMeta ||
    isFetchingMeta ||
    isCheckingDuplicate ||
    isFetchingDuplicate;

  const handleConfirmImport = async () => {
    if (!validatedUrl || !videoId || !youtubeMeta) return;

    if (!user) {
      onLoginRequired();
      return;
    }

    if (existingJob) {
      router.push(`/users/${user.id}?tab=saved`);
      return;
    }

    setIsSubmitting(true);

    const idempotencyKey = createJob(validatedUrl, youtubeMeta);

    router.push(`/users/${user.id}?tab=saved`);
    addToast({
      message: "영상을 분석 중입니다. 잠시만 기다려주세요.",
      variant: "info",
    });

    try {
      const { jobId } = await createExtractionJobV2(
        validatedUrl,
        idempotencyKey
      );
      setJobId(idempotencyKey, jobId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "추출에 실패했습니다.";
      failJob(idempotencyKey, undefined, errorMessage);
      addToast({
        message: errorMessage,
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={previewSectionRef}>
      {isLoading && <PreviewLoadingSkeleton />}

      {validatedUrl && !isLoadingMeta && !youtubeMeta && <PreviewErrorMessage />}

      {hasYoutubeData && isDuplicate && duplicateCheck?.recipeId && (
        <div className="animate-fade-in-up">
          <ErrorBoundary fallback={<DuplicateRecipeErrorFallback />}>
            <DuplicateRecipeSection
              recipeId={duplicateCheck.recipeId}
              youtubeMeta={youtubeMeta}
              urlSource={urlSource}
              onSaveSuccess={() => {
                triggerHaptic("Success");
                addToast({
                  message: "레시피가 저장되었습니다!",
                  variant: "success",
                });
              }}
            />
          </ErrorBoundary>
        </div>
      )}

      {hasYoutubeData && !isDuplicate && (
        <div className="animate-fade-in-up">
          {hasNoQuota && (
            <UsageLimitBanner message="오늘 유튜브 레시피 추출 횟수를 모두 사용했어요." />
          )}
          <YoutubePreviewCard
            meta={youtubeMeta}
            onConfirm={handleConfirmImport}
            isLoading={isImporting}
            disabled={hasNoQuota}
          />
        </div>
      )}
    </div>
  );
};
