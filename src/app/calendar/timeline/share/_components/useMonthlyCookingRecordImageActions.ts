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

type PendingImageAction = "saveImage" | "shareImage";

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
  const [pendingAction, setPendingAction] = useState<PendingImageAction | null>(
    null
  );
  const pendingActionRef = useRef<PendingImageAction | null>(null);
  const addToast = useToastStore((state) => state.addToast);

  const runAction = async (
    action: () => Promise<void>,
    currentAction: PendingImageAction,
    shouldCaptureDiagnostic = false
  ) => {
    if (pendingActionRef.current) return;
    pendingActionRef.current = currentAction;
    setPendingAction(currentAction);
    try {
      await action();
    } catch (error) {
      if (shouldCaptureDiagnostic) {
        captureNativeActionDiagnostic({
          action: currentAction,
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
      pendingActionRef.current = null;
      setPendingAction(null);
    }
  };

  const save = () => {
    if (!blob) return;
    const isWebView = isAppWebView();
    captureMonthlyShareActionClick("saveImage", isWebView);
    if (!isWebView) {
      downloadMonthlyCookingRecordImage(blob, monthKey);
      showSaveSuccess(addToast, copy.saveSuccess);
      return;
    }
    void runAction(
      async () => {
        await captureSquareImage(captureTarget, () =>
          requestNativeImageAction({
            action: "saveImage",
            blob,
            captureTarget,
            fileName: getMonthlyCookingRecordImageFileName(monthKey),
          })
        );
        captureNativeActionDiagnostic({
          action: "saveImage",
          blobSize: blob.size,
          status: "saved",
        });
        showSaveSuccess(addToast, copy.saveSuccess);
      },
      "saveImage",
      true
    );
  };

  const share = () => {
    if (!blob) return;
    const isWebView = isAppWebView();
    captureMonthlyShareActionClick("shareImage", isWebView);
    if (isWebView) {
      void runAction(
        async () => {
          await captureSquareImage(captureTarget, () =>
            requestNativeImageAction({
              action: "shareImage",
              blob,
              captureTarget,
              fileName: getMonthlyCookingRecordImageFileName(monthKey),
            })
          );
          captureNativeActionDiagnostic({
            action: "shareImage",
            blobSize: blob.size,
            status: "presented",
          });
        },
        "shareImage",
        true
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
    }, "shareImage");
  };

  return { save, share, pendingAction };
};

const captureMonthlyShareActionClick = (
  action: PendingImageAction,
  isWebView: boolean
): void => {
  captureAnalyticsEvent("monthly_share_action_clicked", {
    action,
    platform: isWebView ? "appWebView" : "web",
  });
};

const captureSquareImage = async <T>(
  captureTarget: HTMLElement | null,
  capture: () => Promise<T>
): Promise<T> => {
  if (!captureTarget) return capture();
  const previousBorderRadius = captureTarget.style.borderRadius;
  const previousBoxShadow = captureTarget.style.boxShadow;
  captureTarget.style.borderRadius = "0px";
  captureTarget.style.boxShadow = "none";

  try {
    await waitForNextPaint();
    return await capture();
  } finally {
    captureTarget.style.borderRadius = previousBorderRadius;
    captureTarget.style.boxShadow = previousBoxShadow;
  }
};

const waitForNextPaint = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

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
