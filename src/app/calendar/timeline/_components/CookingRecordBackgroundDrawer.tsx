"use client";

import { X } from "lucide-react";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import { CookingRecordBackgroundPicker } from "./CookingRecordBackgroundPicker";
import type {
  CookingRecordBackground,
  CookingRecordBackgroundCopy,
  CookingRecordStickerItem,
} from "./cookingRecordUi.types";

export type CookingRecordBackgroundDrawerProps = {
  isOpen: boolean;
  monthLabel: string;
  selectedBackground: CookingRecordBackground;
  previewRecords: CookingRecordStickerItem[];
  copy: CookingRecordBackgroundCopy;
  onOpenChange: (open: boolean) => void;
  onSelectBackground: (background: CookingRecordBackground) => void;
  onCustomImageChange: (file: File) => void;
  onApply: () => void;
};

export const CookingRecordBackgroundDrawer = (
  props: CookingRecordBackgroundDrawerProps
) => {
  const {
    isOpen,
    monthLabel,
    selectedBackground,
    previewRecords,
    copy,
    onOpenChange,
    onSelectBackground,
    onCustomImageChange,
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
            <Description className="text-ink-muted mt-0.5 truncate text-center text-[11px]">
              {copy.monthOnlyLabel}
            </Description>
          </div>
          <span aria-hidden="true" />
        </Header>

        <CookingRecordBackgroundPicker
          monthLabel={monthLabel}
          selectedBackground={selectedBackground}
          previewRecords={previewRecords}
          copy={copy}
          onSelectBackground={onSelectBackground}
          onCustomImageChange={onCustomImageChange}
          onApply={onApply}
        />
      </Content>
    </Container>
  );
};
