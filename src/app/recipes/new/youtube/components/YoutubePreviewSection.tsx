"use client";

import dynamic from "next/dynamic";

import { AnimatePresence, motion } from "motion/react";

import { useAutoScrollOnMobile } from "@/shared/hooks/useAutoScrollOnMobile";
import { useYoutubeDict } from "@/shared/i18n";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { useYoutubeImportFlow } from "@/features/recipe-import-youtube/model/useYoutubeImportFlow";
import { YoutubePreviewCard } from "@/features/recipe-import-youtube/ui/YoutubePreviewCard";

import UsageLimitBanner from "@/widgets/AIRecipeForm/UsageLimitBanner";

import { useYoutubeUrl } from "./YoutubeUrlProvider";

const DuplicateRecipeSection = dynamic(
  () => import("@/features/recipe-import-youtube/ui/DuplicateRecipeSection"),
  { ssr: false }
);

const SCROLL_DELAY_MS = 500;

const DuplicateRecipeErrorFallback = () => {
  const t = useYoutubeDict();

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
      <p className="font-medium text-amber-800">
        {t.sectionDuplicateErrorTitle}
      </p>
      <p className="mt-1 text-sm text-amber-600">
        {t.sectionDuplicateErrorHint}
      </p>
    </div>
  );
};

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

const PreviewErrorMessage = () => {
  const t = useYoutubeDict();

  return (
    <div className="mx-auto w-full rounded-2xl bg-red-50/80 p-6 text-center text-red-600">
      <p className="font-medium">
        {t.sectionMetaErrorTitle}
        <br />
        {t.sectionMetaErrorHint}
      </p>
    </div>
  );
};

const sectionVariants = {
  initial: { opacity: 0, y: 18, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
};
const sectionTransition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1] as const,
};

type YoutubePreviewSectionProps = {
  onLoginRequired: () => void;
};

export const YoutubePreviewSection = ({
  onLoginRequired,
}: YoutubePreviewSectionProps) => {
  const { validatedUrl, videoId, urlSource } = useYoutubeUrl();
  const t = useYoutubeDict();
  const {
    youtubeMeta,
    duplicateCheck,
    isLoading,
    isDuplicate,
    hasYoutubeData,
    isMetaError,
    hasNoQuota,
    isImporting,
    confirmImport,
  } = useYoutubeImportFlow({
    validatedUrl,
    videoId,
    onLoginRequired,
  });

  const isShowingPreviewSection = isLoading || isMetaError || hasYoutubeData;

  const previewSectionRef = useAutoScrollOnMobile(
    !!isShowingPreviewSection,
    SCROLL_DELAY_MS
  );

  return (
    <div ref={previewSectionRef}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            variants={sectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={sectionTransition}
          >
            <PreviewLoadingSkeleton />
          </motion.div>
        )}

        {isMetaError && (
          <motion.div
            key="error"
            variants={sectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={sectionTransition}
          >
            <PreviewErrorMessage />
          </motion.div>
        )}

        {hasYoutubeData &&
          youtubeMeta &&
          isDuplicate &&
          duplicateCheck?.recipeId && (
            <motion.div
              key={`duplicate-${duplicateCheck.recipeId}`}
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={sectionTransition}
            >
              <ErrorBoundary fallback={<DuplicateRecipeErrorFallback />}>
                <DuplicateRecipeSection
                  recipeId={duplicateCheck.recipeId}
                  youtubeMeta={youtubeMeta}
                  urlSource={urlSource}
                />
              </ErrorBoundary>
            </motion.div>
          )}

        {hasYoutubeData && youtubeMeta && !isDuplicate && (
          <motion.div
            key="preview"
            variants={sectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={sectionTransition}
          >
            {hasNoQuota && (
              <UsageLimitBanner message={t.sectionQuotaExhausted} />
            )}
            <YoutubePreviewCard
              meta={youtubeMeta}
              onConfirm={confirmImport}
              isLoading={isImporting}
              disabled={hasNoQuota}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
