"use client";

import { useRef, useState } from "react";

import { captureAnalyticsEvent } from "@/shared/lib/analytics";
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
  captureTarget: HTMLElement | null;
  monthKey: string;
  shareTitle: string;
  shareText: string;
  copy: MonthlyCookingRecordShareCopy;
};

export const useMonthlyCookingRecordImageActions = ({
  blob,
  captureTarget,
  monthKey,
  shareTitle,
  shareText,
  copy,
}: Params) => {
  const [isPending, setIsPending] = useState(false);
  const isPendingRef = useRef(false);
  const addToast = useToastStore((state) => state.addToast);

  const runAction = async (
    action: () => Promise<void>,
    nativeAction?: "saveImage" | "shareImage"
  ) => {
    if (isPendingRef.current) return;
    isPendingRef.current = true;
    setIsPending(true);
    try {
      await action();
    } catch (error) {
      if (nativeAction) {
        captureNativeActionDiagnostic({
          action: nativeAction,
          blobSize: blob?.size ?? 0,
          status: "failed",
          errorName: error instanceof Error ? error.name : "unknown",
        });
      }
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
        captureTarget,
        fileName: getMonthlyCookingRecordImageFileName(monthKey),
      });
      captureNativeActionDiagnostic({
        action: "saveImage",
        blobSize: blob.size,
        status: "saved",
      });
      showSaveSuccess(addToast, copy.saveSuccess);
    }, "saveImage");
  };

  const share = () => {
    if (!blob) return;
    if (isAppWebView()) {
      void runAction(async () => {
        await requestNativeImageAction({
          action: "shareImage",
          blob,
          captureTarget,
          fileName: getMonthlyCookingRecordImageFileName(monthKey),
        });
        captureNativeActionDiagnostic({
          action: "shareImage",
          blobSize: blob.size,
          status: "presented",
        });
      }, "shareImage");
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

const captureNativeActionDiagnostic = ({
  action,
  blobSize,
  status,
  errorName,
}: {
  action: "saveImage" | "shareImage";
  blobSize: number;
  status: "saved" | "presented" | "failed";
  errorName?: string;
}): void => {
  captureAnalyticsEvent("monthly_share_native_action_diagnostic", {
    captureVersion: 1,
    action,
    blobSize,
    status,
    ...(errorName ? { errorName } : {}),
  });
};

const showSaveSuccess = (
  addToast: ReturnType<typeof useToastStore.getState>["addToast"],
  message: string
): void => {
  triggerHaptic("Success");
  addToast({ message, variant: "success" });
};
