"use client";

import { useId } from "react";

import { MoreVertical, Trash2, X } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/shadcn/dropdown-menu";

import { CookingRecordDetailActions } from "./CookingRecordDetailActions";
import { CookingRecordDetailContent } from "./CookingRecordDetailContent";
import { CookingRecordDetailStatus } from "./CookingRecordDetailStatus";
import type { CookingRecordDetailDrawerProps } from "./cookingRecordUi.types";

export type { CookingRecordDetailDrawerProps } from "./cookingRecordUi.types";

export const CookingRecordDetailDrawer = (
  props: CookingRecordDetailDrawerProps
) => {
  const {
    isOpen,
    mode,
    detail,
    copy,
    contentStatus,
    loadingLabel,
    errorLabel,
    retryLabel,
    isReviewSaving,
    isPhotoReplacing,
    onOpenChange,
    onStartEdit,
    onSaveRecord,
    onPhotoChange,
    onDeleteRequest,
    onRetry,
  } = props;
  const { isMobile, Container, Content, Header, Title, Description } =
    useResponsiveSheet();
  const reviewFormId = useId();
  const contentClassName = isMobile
    ? "h-[min(700px,92dvh)] max-h-[92dvh] rounded-t-3xl data-[vaul-drawer-direction=bottom]:max-h-[92dvh] data-[vaul-drawer-direction=bottom]:rounded-t-3xl data-[vaul-drawer-direction=bottom]:border-0"
    : "max-h-[calc(100dvh-2rem)] max-w-md rounded-2xl sm:max-w-md";

  return (
    <Container open={isOpen} onOpenChange={onOpenChange}>
      <Content
        hasDescription
        className={`flex w-full flex-col overflow-hidden border-0 bg-white p-0 shadow-xl [&>[data-slot=dialog-close]]:hidden [&>button]:hidden ${contentClassName}`}
      >
        <div className="kb-pb flex min-h-0 flex-1 flex-col">
          <Header className="grid shrink-0 grid-cols-[44px_1fr_44px] items-center border-b border-gray-100 px-2.5 py-0 text-left">
            <button
              type="button"
              aria-label={copy.closeLabel}
              onClick={() => onOpenChange(false)}
              className="text-ink focus-visible:outline-olive-dark flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
            <div className="min-w-0 py-2.5 text-center">
              <Title className="text-ink truncate text-center text-base font-bold">
                {copy.title}
              </Title>
              <Description className="text-ink-muted mt-0.5 truncate text-center text-xs">
                {detail.cookedAtLabel}
              </Description>
            </div>
            {mode === "view" && contentStatus === "ready" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={copy.moreLabel}
                    onClick={() => triggerHaptic("Light")}
                    className="text-ink focus-visible:outline-olive-dark flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <MoreVertical aria-hidden="true" className="size-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 rounded-xl border-gray-200 p-1.5 shadow-lg"
                >
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={onDeleteRequest}
                    className="min-h-11 cursor-pointer rounded-lg px-3 text-[13px] font-bold"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                    {copy.deleteRecord}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span aria-hidden="true" />
            )}
          </Header>

          {contentStatus === "ready" ? (
            <CookingRecordDetailContent
              mode={mode}
              detail={detail}
              copy={copy}
              isReviewSaving={isReviewSaving}
              formId={reviewFormId}
              onSaveRecord={onSaveRecord}
            />
          ) : (
            <CookingRecordDetailStatus
              status={contentStatus}
              loadingLabel={loadingLabel}
              errorLabel={errorLabel}
              retryLabel={retryLabel}
              onRetry={onRetry}
            />
          )}

          {contentStatus === "ready" && mode === "view" ? (
            <CookingRecordDetailActions
              detail={detail}
              copy={copy}
              isPhotoReplacing={isPhotoReplacing}
              onStartEdit={onStartEdit}
              onPhotoChange={onPhotoChange}
            />
          ) : null}

          {contentStatus === "ready" && mode === "edit" ? (
            <div className="shrink-0 border-t border-gray-100 bg-white px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
              <button
                type="submit"
                form={reviewFormId}
                disabled={isReviewSaving}
                className="bg-olive-light disabled:text-ink-disabled h-12 w-full cursor-pointer rounded-xl text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                {copy.saveRecord}
              </button>
            </div>
          ) : null}
        </div>
      </Content>
    </Container>
  );
};
