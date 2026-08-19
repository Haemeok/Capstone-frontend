const EXPORT_SIZE = 360;
const EXPORT_PIXEL_RATIO = 3;

export const createMonthlyCookingRecordImage = async (
  node: HTMLElement
): Promise<Blob> => {
  await waitForCardAssets(node);
  const { toBlob } = await import("html-to-image");
  const blob = await toBlob(node, {
    cacheBust: true,
    canvasHeight: EXPORT_SIZE,
    canvasWidth: EXPORT_SIZE,
    pixelRatio: EXPORT_PIXEL_RATIO,
    skipAutoScale: true,
  });
  if (!blob) throw new Error("MONTHLY_COOKING_RECORD_IMAGE_EMPTY");
  return blob;
};

const waitForCardAssets = async (node: HTMLElement): Promise<void> => {
  const fontReady = document.fonts?.ready ?? Promise.resolve();
  const imageReady = Array.from(node.querySelectorAll("img")).map((image) => {
    if (image.complete) return Promise.resolve();
    return image.decode().catch(() => undefined);
  });
  await Promise.all([fontReady, ...imageReady]);
};
