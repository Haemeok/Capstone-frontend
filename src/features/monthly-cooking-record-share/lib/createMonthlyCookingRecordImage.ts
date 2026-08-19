const EXPORT_SIZE = 360;
const EXPORT_PIXEL_RATIO = 3;
const EXPORT_PIXEL_SIZE = EXPORT_SIZE * EXPORT_PIXEL_RATIO;

const CAPTURE_OPTIONS = {
  cacheBust: true,
  canvasHeight: EXPORT_SIZE,
  canvasWidth: EXPORT_SIZE,
  pixelRatio: EXPORT_PIXEL_RATIO,
  skipAutoScale: true,
};

export type MonthlyCookingRecordImageDiagnostics = {
  sourceImageCount: number;
  sourceLoadedImageCount: number;
  sourceStickerCount: number;
  sourceLoadedStickerCount: number;
  svgImageCount: number;
  svgEmbeddedImageCount: number;
  svgStickerCount: number;
  svgEmbeddedStickerCount: number;
  blobSize: number;
};

export type MonthlyCookingRecordImageResult = {
  blob: Blob;
  diagnostics: MonthlyCookingRecordImageDiagnostics;
};

export const createMonthlyCookingRecordImage = async (
  node: HTMLElement
): Promise<MonthlyCookingRecordImageResult> => {
  const sourceImages = getSourceImages(node);
  await waitForCardAssets(node);
  const { toSvg } = await import("html-to-image");
  const svg = await toSvg(node, CAPTURE_OPTIONS);
  const svgDiagnostics = getSvgDiagnostics(svg);
  const image = await loadSvgImage(svg);
  const canvas = drawExportCanvas(image);
  const blob = await createPngBlob(canvas);
  return {
    blob,
    diagnostics: {
      sourceImageCount: sourceImages.all.length,
      sourceLoadedImageCount: sourceImages.all.filter(isLoadedImage).length,
      sourceStickerCount: sourceImages.stickers.length,
      sourceLoadedStickerCount:
        sourceImages.stickers.filter(isLoadedImage).length,
      ...svgDiagnostics,
      blobSize: blob.size,
    },
  };
};

const getSourceImages = (node: HTMLElement) => ({
  all: Array.from(node.querySelectorAll<HTMLImageElement>("img")),
  stickers: Array.from(
    node.querySelectorAll<HTMLImageElement>('[data-share-sticker="true"] img')
  ),
});

const getSvgDiagnostics = (
  source: string
): Pick<
  MonthlyCookingRecordImageDiagnostics,
  | "svgImageCount"
  | "svgEmbeddedImageCount"
  | "svgStickerCount"
  | "svgEmbeddedStickerCount"
> => {
  const separatorIndex = source.indexOf(",");
  const markup = decodeURIComponent(source.slice(separatorIndex + 1));
  const document = new DOMParser().parseFromString(markup, "image/svg+xml");
  const images = Array.from(document.querySelectorAll("img"));
  const stickers = images.filter((image) =>
    image.closest('[data-share-sticker="true"]')
  );
  return {
    svgImageCount: images.length,
    svgEmbeddedImageCount: images.filter(isEmbeddedImage).length,
    svgStickerCount: stickers.length,
    svgEmbeddedStickerCount: stickers.filter(isEmbeddedImage).length,
  };
};

const isEmbeddedImage = (image: Element): boolean =>
  image.getAttribute("src")?.startsWith("data:image/") ?? false;

const isLoadedImage = (image: HTMLImageElement): boolean =>
  image.complete && image.naturalWidth > 0;

const loadSvgImage = async (source: string): Promise<HTMLImageElement> => {
  const image = new Image();
  const loaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () =>
      reject(new Error("MONTHLY_COOKING_RECORD_SVG_FAILED"));
  });
  image.crossOrigin = "anonymous";
  image.decoding = "sync";
  image.src = source;
  await loaded;
  if (typeof image.decode === "function") {
    await image.decode().catch(() => undefined);
  }
  await waitForNextPaint();
  return image;
};

const drawExportCanvas = (image: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_PIXEL_SIZE;
  canvas.height = EXPORT_PIXEL_SIZE;
  canvas.style.width = `${EXPORT_SIZE}px`;
  canvas.style.height = `${EXPORT_SIZE}px`;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("MONTHLY_COOKING_RECORD_CANVAS_FAILED");
  context.drawImage(image, 0, 0, EXPORT_PIXEL_SIZE, EXPORT_PIXEL_SIZE);
  return canvas;
};

const createPngBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }
      reject(new Error("MONTHLY_COOKING_RECORD_IMAGE_EMPTY"));
    }, "image/png");
  });

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
