"use client";

import { X } from "lucide-react";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import type {
  StickerBookBackground,
  StickerBookBackgroundOption,
} from "@/entities/recipe";

import type { CustomBackgroundErrorKind } from "@/features/cooking-record-background";

import { CookingRecordBackgroundPicker } from "./CookingRecordBackgroundPicker";
import { CookingRecordNameVisibilityToggle } from "./CookingRecordNameVisibilityToggle";
import type {
  CookingRecordStickerItem,
  CookingRecordViewSettingsCopy,
} from "./cookingRecordUi.types";

export type CookingRecordViewSettingsDrawerProps = {
  isOpen: boolean;
  isRecordNameVisible: boolean;
  backgrounds: StickerBookBackgroundOption[];
  previewBackground: StickerBookBackground | null;
  selectedBackgroundKey?: string;
  previewRecords: CookingRecordStickerItem[];
  copy: CookingRecordViewSettingsCopy;
  isListPending: boolean;
  isListError: boolean;
  isAddingCustom: boolean;
  isCustomBackgroundProcessing: boolean;
  customBackgroundErrorKind?: CustomBackgroundErrorKind | null;
  isApplying: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordNameVisibilityChange: (visible: boolean) => void;
  onSelectBackground: (backgroundKey: string) => void;
  onAddCustomBackground: (file: File) => void;
  onRetryCustomBackground: () => void;
  onRequestDeleteCustomBackground: () => void;
  onRetry: () => void;
  onApply: () => void;
};

export const CookingRecordViewSettingsDrawer = (
  props: CookingRecordViewSettingsDrawerProps
) => {
  const {
    isOpen,
    isRecordNameVisible,
    backgrounds,
    previewBackground,
    selectedBackgroundKey,
    previewRecords,
    copy,
    isListPending,
    isListError,
    isAddingCustom,
    isCustomBackgroundProcessing,
    customBackgroundErrorKind,
    isApplying,
    onOpenChange,
    onRecordNameVisibilityChange,
    onSelectBackground,
    onAddCustomBackground,
    onRetryCustomBackground,
    onRequestDeleteCustomBackground,
    onRetry,
    onApply,
  } = props;
  const { isMobile, Container, Content, Header, Title, Description } =
    useResponsiveSheet();
  const contentClassName = isMobile
    ? "max-h-[88dvh] rounded-t-3xl data-[vaul-drawer-direction=bottom]:max-h-[88dvh] data-[vaul-drawer-direction=bottom]:rounded-t-3xl data-[vaul-drawer-direction=bottom]:border-0"
    : "max-h-[calc(100dvh-2rem)] max-w-md rounded-2xl sm:max-w-md";

  return (
    <Container open={isOpen} onOpenChange={onOpenChange}>
      <Content
        hasDescription
        className={`flex w-full flex-col overflow-hidden border-0 bg-white p-0 shadow-xl [&>[data-slot=dialog-close]]:hidden [&>button]:hidden ${contentClassName}`}
      >
        <Header className="grid shrink-0 grid-cols-[1fr_44px] items-center border-b border-gray-100 py-0 pr-2.5 pl-5 text-left">
          <div className="min-w-0 py-3">
            <Title className="text-ink truncate text-base font-bold">
              {copy.title}
            </Title>
            <Description className="text-ink-muted mt-0.5 truncate text-xs">
              {copy.description}
            </Description>
          </div>
          <button
            type="button"
            aria-label={copy.closeLabel}
            onClick={() => onOpenChange(false)}
            className="text-ink focus-visible:outline-olive-dark flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </Header>

        <div className="shrink-0 px-5 pt-4">
          <CookingRecordNameVisibilityToggle
            isVisible={isRecordNameVisible}
            label={copy.showRecordNamesLabel}
            description={copy.showRecordNamesDescription}
            onChange={onRecordNameVisibilityChange}
          />
        </div>

        <CookingRecordBackgroundPicker
          backgrounds={backgrounds}
          previewBackground={previewBackground}
          selectedBackgroundKey={selectedBackgroundKey}
          previewRecords={previewRecords}
          copy={copy}
          isListPending={isListPending}
          isListError={isListError}
          isAddingCustom={isAddingCustom}
          isCustomBackgroundProcessing={isCustomBackgroundProcessing}
          customBackgroundErrorKind={customBackgroundErrorKind}
          isApplying={isApplying}
          onSelectBackground={onSelectBackground}
          onAddCustomBackground={onAddCustomBackground}
          onRetryCustomBackground={onRetryCustomBackground}
          onRequestDeleteCustomBackground={onRequestDeleteCustomBackground}
          onRetry={onRetry}
          onApply={onApply}
        />
      </Content>
    </Container>
  );
};
