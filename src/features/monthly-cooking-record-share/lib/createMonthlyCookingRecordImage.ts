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
  const imageReady = Array.from(node.querySelectorAll("img")).map(waitForImage);
  await Promise.all([fontReady, ...imageReady]);
  await waitForNextPaint();
  await waitForNextPaint();
};

const waitForImage = async (image: HTMLImageElement): Promise<void> => {
  if (typeof image.decode === "function") {
    await image.decode().catch(() => undefined);
  }
  if (!image.complete || image.naturalWidth === 0) {
    throw new Error("MONTHLY_COOKING_RECORD_IMAGE_ASSET_FAILED");
  }
};

const waitForNextPaint = (): Promise<void> =>
  new Promise((resolve) => requestAnimationFrame(() => resolve()));
