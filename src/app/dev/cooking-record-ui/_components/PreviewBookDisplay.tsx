"use client";

import { format, type Locale, plural, type UserPagesDict } from "@/shared/i18n";
import { recordPhotoMessages } from "@/shared/i18n/recordPhotoMessages";

import { toRecordPhotoView } from "@/entities/recipe/model/recordPhotoView";
import { CookingRecordPhoto } from "@/entities/recipe/ui/CookingRecordPhoto";

import { CookingRecordBoard } from "@/widgets/CookingRecordBoard";

import { previewCatalog } from "../_fixtures/catalog";
import type { PreviewRecord } from "../_fixtures/records";

type PreviewBookDisplayProps = {
  locale: Locale;
  monthLabel: string;
  records: PreviewRecord[];
  copy: UserPagesDict["calendar"]["cookingRecord"];
  onOpen: (recordId: string) => void;
  onAdd: () => void;
  onShare: () => void;
};

const PreviewMonthSummary = ({
  records,
  monthLabel,
  copy,
}: Pick<PreviewBookDisplayProps, "records" | "monthLabel" | "copy">) => (
  <div className="px-5 py-5">
    <p className="text-ink-muted text-sm">{monthLabel}</p>
    <h3 className="mt-2 text-xl font-bold">
      {format(plural(records.length, copy.summary.currentTitle), {
        count: records.length,
      })}
    </h3>
    <div className="mt-4 grid grid-cols-3 text-sm">
      <div>
        {copy.summary.cookingDaysLabel}
        <strong className="mt-1 block text-lg">
          {new Set(records.map((record) => record.date)).size}
        </strong>
      </div>
      <div>
        {copy.summary.savingsLabel}
        <strong className="mt-1 block text-lg">—</strong>
      </div>
      <div>
        {copy.summary.uniqueDishesLabel}
        <strong className="mt-1 block text-lg">{records.length}</strong>
      </div>
    </div>
  </div>
);

export const PreviewBookDisplay = ({
  locale,
  monthLabel,
  records,
  copy,
  onOpen,
  onAdd,
  onShare,
}: PreviewBookDisplayProps) => (
  <>
    <PreviewMonthSummary
      records={records}
      monthLabel={monthLabel}
      copy={copy}
    />
    <CookingRecordBoard
      actionsPosition="contained"
      ariaLabel={format(copy.boardLabel, { month: monthLabel })}
      records={records.map((record) => ({
        id: record.id,
        title: record.title,
        cookedAtLabel: record.date,
        imageUrl: record.photo.originalUrl ?? "",
        imageAlt: record.title,
      }))}
      background={null}
      recordCountLabel={format(plural(records.length, copy.recordCount), {
        count: records.length,
      })}
      addRecordLabel={copy.addRecord}
      shareRecordLabel={format(copy.shareRecord, { month: monthLabel })}
      getRecordLabel={(record) => record.title}
      onSelectRecord={(record) => onOpen(record.id)}
      onAddRecord={onAdd}
      onShareRecord={onShare}
      renderPhoto={(item) => {
        const record = records.find((row) => row.id === item.id);
        return record ? (
          <div className="mx-auto h-[122px] w-[122px] max-w-full">
            <CookingRecordPhoto
              view={toRecordPhotoView(record.photo, previewCatalog.plates)}
              alt={record.title}
              emptyLabel={recordPhotoMessages[locale].empty}
            />
          </div>
        ) : null;
      }}
    />
  </>
);
