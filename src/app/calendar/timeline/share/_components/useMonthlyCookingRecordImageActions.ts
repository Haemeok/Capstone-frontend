"use client";

import { useRef, useState } from "react";

import {
  isAppWebView,
  isNativeImageActionUnsupportedError,
  requestNativeImageAction,
  triggerHaptic,
} from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

import {
  downloadMonthlyCookingRecordImage,
  getMonthlyCookingRecordImageFileName,
  shareMonthlyCookingRecordImage,
} from "@/features/monthly-cooking-record-share";

import type { MonthlyCookingRecordShareCopy } from "./sharePage.types";

type Params = {
  blob: Blob | null;
  monthKey: string;
  shareTitle: string;
  shareText: string;
  copy: MonthlyCookingRecordShareCopy;
};

export const useMonthlyCookingRecordImageActions = ({
  blob,
  monthKey,
  shareTitle,
  shareText,
  copy,
}: Params) => {
  const [isPending, setIsPending] = useState(false);
  const isPendingRef = useRef(false);
  const addToast = useToastStore((state) => state.addToast);

  const runAction = async (action: () => Promise<void>) => {
    if (isPendingRef.current) return;
    isPendingRef.current = true;
    setIsPending(true);
    try {
      await action();
    } catch (error) {
      addToast({
        message: isNativeImageActionUnsupportedError(error)
          ? copy.appUpdateRequired
          : copy.actionError,
        variant: "error",
      });
    } finally {
      isPendingRef.current = false;
      setIsPending(false);
    }
  };

  const save = () => {
    if (!blob) return;
    if (!isAppWebView()) {
      downloadMonthlyCookingRecordImage(blob, monthKey);
      showSaveSuccess(addToast, copy.saveSuccess);
      return;
    }
    void runAction(async () => {
      await requestNativeImageAction({
        action: "saveImage",
        blob,
        fileName: getMonthlyCookingRecordImageFileName(monthKey),
      });
      showSaveSuccess(addToast, copy.saveSuccess);
    });
  };

  const share = () => {
    if (!blob) return;
    if (isAppWebView()) {
      void runAction(() =>
        requestNativeImageAction({
          action: "shareImage",
          blob,
          fileName: getMonthlyCookingRecordImageFileName(monthKey),
        }).then(() => undefined)
      );
      return;
    }
    void runAction(async () => {
      const result = await shareMonthlyCookingRecordImage({
        blob,
        monthKey,
        title: shareTitle,
        text: shareText,
        downloadFallback: downloadMonthlyCookingRecordImage,
      });
      if (result === "cancelled") return;
      triggerHaptic("Success");
      addToast({
        message:
          result === "shared" ? copy.shareSuccess : copy.downloadFallback,
        variant: "success",
      });
    });
  };

  return { save, share, isPending };
};

const showSaveSuccess = (
  addToast: ReturnType<typeof useToastStore.getState>["addToast"],
  message: string
): void => {
  triggerHaptic("Success");
  addToast({ message, variant: "success" });
};
