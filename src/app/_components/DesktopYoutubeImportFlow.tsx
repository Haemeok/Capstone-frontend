"use client";

import type { HomeDict } from "@/shared/i18n";
import { useCommonDict, useYoutubeDict } from "@/shared/i18n";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { useLoginEncourageDrawerStore } from "@/features/auth/ui/LoginEncourageDrawer/model/store";
import { useYoutubeImportFlow } from "@/features/recipe-import-youtube/model/useYoutubeImportFlow";
import DuplicateRecipeSection from "@/features/recipe-import-youtube/ui/DuplicateRecipeSection";
import { YoutubePreviewCard } from "@/features/recipe-import-youtube/ui/YoutubePreviewCard";

import UsageLimitBanner from "@/widgets/AIRecipeForm/UsageLimitBanner";

type DesktopYoutubeImportFlowProps = {
  messages: HomeDict["desktopYoutubeImport"];
  initialUrl: string;
  initialVideoId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const PreviewLoadingSkeleton = () => (
  <div
    data-testid="desktop-youtube-preview-loading"
    className="w-full animate-pulse rounded-xl border border-gray-100 bg-white p-4"
  >
    <div className="flex gap-4">
      <Skeleton className="h-[90px] w-40 rounded-xl" />
      <div className="flex-1 space-y-3 py-2">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
    </div>
    <Skeleton className="mt-6 h-12 w-full rounded-lg" />
  </div>
);

type PreviewErrorMessageProps = {
  title: string;
  hint: string;
};

const PreviewErrorMessage = ({ title, hint }: PreviewErrorMessageProps) => (
  <div
    role="alert"
    className="w-full rounded-xl bg-red-50/80 p-6 text-center text-red-600"
  >
    <strong className="block font-medium">{title}</strong>
    <span className="mt-1 block text-sm">{hint}</span>
  </div>
);

export const DesktopYoutubeImportFlow = ({
  messages,
  initialUrl,
  initialVideoId,
  isOpen,
  onOpenChange,
}: DesktopYoutubeImportFlowProps) => {
  const common = useCommonDict();
  const t = useYoutubeDict();
  const openLoginDrawer = useLoginEncourageDrawerStore(
    (state) => state.openDrawer
  );

  const handleLoginRequired = () => {
    onOpenChange(false);
    openLoginDrawer({
      icon: <YouTubeIconBadge className="h-6 w-6" />,
    });
  };

  const flow = useYoutubeImportFlow({
    validatedUrl: initialUrl,
    videoId: initialVideoId,
    onLoginRequired: handleLoginRequired,
  });
  const isShowingDuplicate = Boolean(
    isOpen &&
    flow.hasYoutubeData &&
    flow.youtubeMeta &&
    flow.isDuplicate &&
    flow.duplicateCheck?.recipeId
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        closeLabel={common.actions.close}
        className="max-h-[calc(100dvh-2rem)] gap-0 overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-xl sm:max-w-xl"
      >
        <DialogTitle className="sr-only">
          {isShowingDuplicate ? t.duplicateTitle : messages.eyebrow}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {isShowingDuplicate ? t.duplicateNoCredit : messages.description}
        </DialogDescription>
        {isShowingDuplicate &&
        flow.youtubeMeta &&
        flow.duplicateCheck?.recipeId ? (
          <DuplicateRecipeSection
            recipeId={flow.duplicateCheck.recipeId}
            youtubeMeta={flow.youtubeMeta}
            urlSource="direct"
            isEmbedded
          />
        ) : (
          <div className="p-5 sm:p-6">
            {flow.isLoading ? <PreviewLoadingSkeleton /> : null}

            {flow.isMetaError ? (
              <PreviewErrorMessage
                title={t.sectionMetaErrorTitle}
                hint={t.sectionMetaErrorHint}
              />
            ) : null}

            {flow.hasYoutubeData && flow.youtubeMeta && !flow.isDuplicate ? (
              <div className="pt-8">
                {flow.hasNoQuota ? (
                  <div className="mb-3">
                    <UsageLimitBanner message={t.sectionQuotaExhausted} />
                  </div>
                ) : null}
                <YoutubePreviewCard
                  meta={flow.youtubeMeta}
                  onConfirm={flow.confirmImport}
                  isLoading={flow.isImporting}
                  disabled={flow.hasNoQuota}
                />
              </div>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
