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

export const createMonthlyCookingRecordImage = async (
  node: HTMLElement
): Promise<Blob> => {
  await waitForCardAssets(node);
  const { toSvg } = await import("html-to-image");
  const svg = await toSvg(node, CAPTURE_OPTIONS);
  const image = await loadSvgImage(svg);
  const canvas = drawExportCanvas(image);
  return createPngBlob(canvas);
};

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
