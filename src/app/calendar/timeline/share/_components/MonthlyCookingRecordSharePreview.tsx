"use client";

import { format, plural } from "@/shared/i18n";

import {
  MonthlyCookingRecordShareCard,
  useMonthlyCookingRecordImage,
} from "@/features/monthly-cooking-record-share";

import { MonthlyCookingRecordShareActions } from "./MonthlyCookingRecordShareActions";
import type {
  MonthlyCookingRecordCopy,
  MonthlyCookingRecordShareRecords,
} from "./sharePage.types";
import { useMonthlyCookingRecordImageActions } from "./useMonthlyCookingRecordImageActions";

type MonthlyCookingRecordSharePreviewProps = {
  monthKey: string;
  monthLabel: string;
  copy: MonthlyCookingRecordCopy;
  records: MonthlyCookingRecordShareRecords;
};

export const MonthlyCookingRecordSharePreview = ({
  monthKey,
  monthLabel,
  copy,
  records,
}: MonthlyCookingRecordSharePreviewProps) => {
  const image = useMonthlyCookingRecordImage({
    enabled: records.isReady && records.totalCount > 0,
    generationKey: getGenerationKey(monthKey, records),
  });
  const actions = useMonthlyCookingRecordImageActions({
    blob: image.blob,
    captureTarget: image.captureTarget,
    monthKey,
    shareTitle: format(copy.share.shareTitle, { month: monthLabel }),
    shareText: copy.share.shareText,
    copy: copy.share,
  });

  return (
    <>
      <main className="flex min-h-0 flex-1 items-center justify-center px-4 pt-4 pb-28">
        <div className="w-full max-w-[390px]">
          <p className="text-ink text-center text-[15px] font-bold">
            {copy.share.lead}
          </p>
          <p className="text-ink-muted mt-1 text-center text-xs leading-5">
            {copy.share.description}
          </p>
          <div className="mt-4.5">
            <MonthlyCookingRecordShareCard
              captureRef={image.captureRef}
              ariaLabel={format(copy.share.cardAria, { month: monthLabel })}
              kicker={copy.share.kicker}
              monthLabel={monthLabel}
              recordCountLabel={format(
                plural(records.totalCount, copy.recordCount),
                { count: records.totalCount }
              )}
              brandLabel={copy.share.brand}
              items={records.shareItems}
              background={records.background}
            />
          </div>
        </div>
      </main>
      <MonthlyCookingRecordShareActions
        status={image.status}
        pendingAction={actions.pendingAction}
        copy={copy.share}
        onSave={actions.save}
        onShare={actions.share}
        onRetry={image.retry}
      />
    </>
  );
};

const getGenerationKey = (
  monthKey: string,
  records: MonthlyCookingRecordShareRecords
): string =>
  [
    monthKey,
    records.background?.backgroundKey ?? "DEFAULT",
    records.background?.imageUrl ?? "",
    ...records.shareItems.map((item) => `${item.id}@${item.imageUrl}`),
  ].join(":");
