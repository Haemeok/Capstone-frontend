import { getMonthlyCookingRecordImageFileName } from "./downloadMonthlyCookingRecordImage";

type ShareMonthlyCookingRecordImageParams = {
  blob: Blob;
  monthKey: string;
  title: string;
  text: string;
  downloadFallback: (blob: Blob, monthKey: string) => void;
};

export type MonthlyCookingRecordShareResult =
  | "shared"
  | "downloaded"
  | "cancelled";

export const shareMonthlyCookingRecordImage = async ({
  blob,
  monthKey,
  title,
  text,
  downloadFallback,
}: ShareMonthlyCookingRecordImageParams): Promise<MonthlyCookingRecordShareResult> => {
  if (typeof File === "undefined") {
    downloadFallback(blob, monthKey);
    return "downloaded";
  }
  const file = new File(
    [blob],
    getMonthlyCookingRecordImageFileName(monthKey),
    { type: "image/png" }
  );
  const shareData = { files: [file], title, text };
  const canShareFile = canShareFiles(shareData);

  if (!canShareFile || typeof navigator.share !== "function") {
    downloadFallback(blob, monthKey);
    return "downloaded";
  }

  try {
    await navigator.share(shareData);
    return "shared";
  } catch (error) {
    if (isAbortError(error)) return "cancelled";
    throw error;
  }
};

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === "AbortError";

const canShareFiles = (shareData: ShareData): boolean => {
  if (typeof navigator.canShare !== "function") return false;
  try {
    return navigator.canShare(shareData);
  } catch {
    return false;
  }
};
