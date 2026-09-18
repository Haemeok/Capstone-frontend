"use client";

import { useState } from "react";

import { type Locale } from "@/shared/i18n";
import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import type { RecordPhotoCatalogState } from "@/entities/recipe/model/recordPhoto.types";
import { createEmptyPhotoDraft } from "@/entities/recipe/model/recordPhotoView";

import { previewCatalog } from "../_fixtures/catalog";
import { type PreviewRecord, previewRecords } from "../_fixtures/records";
import { PreviewBookDisplay } from "./PreviewBookDisplay";
import { PreviewControls } from "./PreviewControls";
import { PreviewProfile } from "./PreviewProfile";
import {
  PreviewRecordSheet,
  type PreviewSheetMode,
} from "./PreviewRecordSheet";

type PreviewSurface = "book" | "profile";
type PreviewCatalogStatus = "ready" | "loading" | "error" | "empty";

const getPreviewCatalogState = (
  status: PreviewCatalogStatus
): RecordPhotoCatalogState => {
  if (status === "empty") {
    return {
      status: "ready",
      catalog: { plates: [], maskShapes: previewCatalog.maskShapes },
    };
  }
  if (status === "ready") return { status: "ready", catalog: previewCatalog };
  return { status };
};

export const CookingRecordUiPreview = () => {
  const [locale, setLocale] = useState<Locale>("ko");
  const [records, setRecords] = useState(previewRecords);
  const [selected, setSelected] = useState(previewRecords[0]);
  const [photo, setPhoto] = useState(createEmptyPhotoDraft);
  const [mode, setMode] = useState<PreviewSheetMode>(null);
  const [surface, setSurface] = useState<PreviewSurface>("book");
  const [catalog, setCatalog] = useState<RecordPhotoCatalogState>({
    status: "ready",
    catalog: previewCatalog,
  });
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState("");
  const copy = userPagesMessages[locale].calendar.cookingRecord;
  const monthLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(new Date(2026, 8, 1));

  const handleAdd = (date = "2026-09-17") => {
    setRevision((value) => value + 1);
    setSelected({ ...previewRecords[0], id: "new", date });
    setPhoto(createEmptyPhotoDraft());
    setMode("create");
  };

  const handleSave = (values: {
    title: string;
    review: string;
    date: string;
  }) => {
    const next: PreviewRecord = {
      ...values,
      id: mode === "edit" ? selected.id : crypto.randomUUID(),
      photo,
    };
    setRecords((current) =>
      mode === "edit"
        ? current.map((record) => (record.id === next.id ? next : record))
        : [next, ...current]
    );
    setSelected(next);
    setMode("success");
  };

  const handleOpen = (recordId: string) => {
    const record = records.find((item) => item.id === recordId);
    if (!record) return;
    setSelected(record);
    setPhoto(record.photo);
    setRevision((value) => value + 1);
    setMode("view");
  };

  const handleRecipe = () => {
    setSelected(previewRecords[0]);
    setPhoto(createEmptyPhotoDraft());
    setRevision((value) => value + 1);
    setMode("recipe");
  };

  const handleReset = () => {
    setRecords(previewRecords);
    setPhoto(createEmptyPhotoDraft());
    setCatalog({ status: "ready", catalog: previewCatalog });
    setMode(null);
    setSurface("book");
    setRevision((value) => value + 1);
  };

  return (
    <main className="text-ink min-h-dvh bg-gray-50 lg:flex lg:justify-center lg:gap-10 lg:px-8 lg:py-8">
      <PreviewControls
        locale={locale}
        onLocale={setLocale}
        onCreate={() => handleAdd()}
        onRecipe={handleRecipe}
        onProfile={() => setSurface("profile")}
        onReset={handleReset}
        onCatalog={(status) => setCatalog(getPreviewCatalogState(status))}
      />
      <section
        className="relative mx-auto flex min-h-[760px] w-full max-w-[430px] flex-col overflow-hidden bg-white lg:mx-0 lg:rounded-3xl lg:border lg:border-gray-200"
        aria-label={copy.pageTitle}
      >
        <header className="flex min-h-16 items-center justify-center border-b border-gray-100 px-5">
          <h2 className="text-lg font-bold">{copy.pageTitle}</h2>
        </header>
        {surface === "profile" ? (
          <PreviewProfile
            records={records}
            locale={locale}
            onAdd={handleAdd}
            onViewAll={() => setSurface("book")}
          />
        ) : (
          <PreviewBookDisplay
            records={records}
            locale={locale}
            monthLabel={monthLabel}
            copy={copy}
            onOpen={handleOpen}
            onAdd={() => handleAdd()}
            onShare={() =>
              setNotice("공유 이미지 내보내기는 다음 작업에서 연결합니다.")
            }
          />
        )}
        {notice ? (
          <p role="status" className="text-ink-sub bg-white p-4 text-sm">
            {notice}
          </p>
        ) : null}
      </section>
      <PreviewRecordSheet
        key={revision}
        mode={mode}
        locale={locale}
        photo={photo}
        catalog={catalog}
        record={selected}
        onPhoto={setPhoto}
        onMode={setMode}
        onSave={handleSave}
        onRetry={() => setCatalog({ status: "ready", catalog: previewCatalog })}
      />
    </main>
  );
};
