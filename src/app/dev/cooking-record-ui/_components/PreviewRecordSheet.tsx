"use client";

import { useState } from "react";

import type { Locale, UserPagesDict } from "@/shared/i18n";
import { recordPhotoMessages } from "@/shared/i18n/recordPhotoMessages";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import type {
  RecordPhotoCatalogState,
  RecordPhotoDraft,
} from "@/entities/recipe/model/recordPhoto.types";

import type { PreviewRecord } from "../_fixtures/records";
import { PreviewRecordSheetBody } from "./PreviewRecordSheetBody";
import { PreviewRecordSheetFooter } from "./PreviewRecordSheetFooter";

export type PreviewSheetMode =
  | "create"
  | "view"
  | "edit"
  | "recipe"
  | "success"
  | null;

type PreviewRecordSheetProps = {
  mode: PreviewSheetMode;
  locale: Locale;
  photo: RecordPhotoDraft;
  catalog: RecordPhotoCatalogState;
  record: PreviewRecord;
  onPhoto: (photo: RecordPhotoDraft) => void;
  onMode: (mode: PreviewSheetMode) => void;
  onRetry: () => void;
  onSave: (values: { title: string; review: string; date: string }) => void;
};

const getSheetTitle = (
  mode: PreviewSheetMode,
  copy: UserPagesDict["calendar"]["cookingRecord"]
) => {
  if (mode === "create") return copy.create.title;
  if (mode === "success") return copy.create.successTitle;
  if (mode === "edit") return copy.detail.editRecord;
  return copy.detail.title;
};

export const PreviewRecordSheet = ({
  mode,
  locale,
  photo,
  catalog,
  record,
  onPhoto,
  onMode,
  onRetry,
  onSave,
}: PreviewRecordSheetProps) => {
  const { Container, Content, Title, Description } = useResponsiveSheet();
  const [isPhotoPending, setIsPhotoPending] = useState(false);
  const copy = userPagesMessages[locale].calendar.cookingRecord;
  const photoCopy = recordPhotoMessages[locale];

  const handleSave = (values: {
    title: string;
    review: string;
    date: string;
  }) => {
    if (isPhotoPending) return;
    triggerHaptic("Success");
    onSave(values);
  };

  return (
    <Container
      open={mode !== null}
      onOpenChange={(open) => {
        if (!open) onMode(null);
      }}
    >
      <Content
        closeLabel={copy.create.closeLabel}
        className="flex max-h-[92dvh] flex-col overflow-hidden border-0 bg-white sm:max-w-md"
      >
        <header className="shrink-0 px-5 pt-5 pr-14 pb-4">
          <Title className="text-[23px] font-bold">
            {getSheetTitle(mode, copy)}
          </Title>
          <Description className="text-ink-sub mt-1 text-sm">
            {mode === "create" ? copy.create.description : record.date}
          </Description>
        </header>
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          <PreviewRecordSheetBody
            mode={mode}
            locale={locale}
            photo={photo}
            catalog={catalog}
            record={record}
            copy={copy}
            photoCopy={photoCopy}
            isPhotoPending={isPhotoPending}
            onPhoto={onPhoto}
            onPhotoPendingChange={setIsPhotoPending}
            onRetry={onRetry}
            onSave={handleSave}
          />
        </div>
        <PreviewRecordSheetFooter
          mode={mode}
          copy={copy}
          recordPhoto={record.photo}
          isPhotoPending={isPhotoPending}
          onPhoto={onPhoto}
          onMode={onMode}
        />
      </Content>
    </Container>
  );
};
