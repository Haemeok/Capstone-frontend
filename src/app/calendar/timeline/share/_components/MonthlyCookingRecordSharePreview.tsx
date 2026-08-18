"use client";

import { format, plural } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

import {
  downloadMonthlyCookingRecordImage,
  MonthlyCookingRecordShareCard,
  shareMonthlyCookingRecordImage,
  useMonthlyCookingRecordImage,
} from "@/features/monthly-cooking-record-share";

import { MonthlyCookingRecordShareActions } from "./MonthlyCookingRecordShareActions";
import type {
  MonthlyCookingRecordCopy,
  MonthlyCookingRecordShareRecords,
} from "./sharePage.types";

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
  const addToast = useToastStore((state) => state.addToast);
  const image = useMonthlyCookingRecordImage({
    enabled: records.isReady && records.totalCount > 0,
    generationKey: getGenerationKey(monthKey, records),
  });

  const handleSave = () => {
    if (!image.blob) return;
    downloadMonthlyCookingRecordImage(image.blob, monthKey);
    triggerHaptic("Success");
    addToast({ message: copy.share.saveSuccess, variant: "success" });
  };

  const handleShare = async () => {
    if (!image.blob) return;
    try {
      const result = await shareMonthlyCookingRecordImage({
        blob: image.blob,
        monthKey,
        title: format(copy.share.shareTitle, { month: monthLabel }),
        text: copy.share.shareText,
        downloadFallback: downloadMonthlyCookingRecordImage,
      });
      if (result === "cancelled") return;
      triggerHaptic("Success");
      addToast({
        message:
          result === "shared"
            ? copy.share.shareSuccess
            : copy.share.downloadFallback,
        variant: "success",
      });
    } catch {
      addToast({ message: copy.share.actionError, variant: "error" });
    }
  };

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
        copy={copy.share}
        onSave={handleSave}
        onShare={() => void handleShare()}
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
