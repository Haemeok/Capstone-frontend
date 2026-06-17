"use client";

import { useYoutubeDict } from "@/shared/i18n";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import {
  PendingRecipeSection,
  useYoutubeImportStoreV2,
} from "@/features/recipe-import-youtube";

import { RecipeBookGrid } from "@/widgets/RecipeBookGrid";

const MySavedRecipesTabContent = () => {
  const t = useYoutubeDict();
  const jobs = useYoutubeImportStoreV2((state) => state.jobs);
  const visibleJobKeys = Object.keys(jobs).filter((key) => {
    const job = jobs[key];
    return (
      job.state === "creating" ||
      job.state === "polling" ||
      job.state === "failed"
    );
  });

  const hasVisibleJobs = visibleJobKeys.length > 0;

  return (
    <div>
      {hasVisibleJobs && (
        <ErrorBoundary
          fallback={<SectionErrorFallback message={t.pendingLoadError} />}
        >
          <PendingRecipeSection pendingJobKeys={visibleJobKeys} />
        </ErrorBoundary>
      )}
      <RecipeBookGrid />
    </div>
  );
};

export default MySavedRecipesTabContent;
