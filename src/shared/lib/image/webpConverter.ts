export type ImageConversionResult = {
  webpFile: File;
  originalFile: File;
  conversionTime: number;
};

export type ConversionOptions = {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
};

const DEFAULT_OPTIONS: Required<ConversionOptions> = {
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
};

export const convertToWebP = async (
  file: File,
  options: ConversionOptions = {}
): Promise<ImageConversionResult> => {
  const startTime = performance.now();
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    img.onload = () => {
      const { width: originalWidth, height: originalHeight } = img;

      const scale = Math.min(
        opts.maxWidth / originalWidth,
        opts.maxHeight / originalHeight,
        1
      );

      canvas.width = originalWidth * scale;
      canvas.height = originalHeight * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("WebP conversion failed"));
            return;
          }

          const webpFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, ".webp"),
            {
              type: "image/webp",
              lastModified: Date.now(),
            }
          );

          const conversionTime = performance.now() - startTime;

          resolve({
            webpFile,
            originalFile: file,
            conversionTime,
          });
        },
        "image/webp",
        opts.quality
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image for conversion"));
    };

    img.src = URL.createObjectURL(file);
  });
};

export const isWebPSupported = (): boolean => {
  const canvas = document.createElement("canvas");
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
};

export const shouldConvertToWebP = (file: File): boolean => {
  if (!isWebPSupported()) return false;

  const supportedTypes = ["image/jpeg", "image/jpg", "image/png"];
  return supportedTypes.includes(file.type.toLowerCase());
};

export const createImageChangeHandler = (
  onChange: (file: File | null) => void
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) {
      onChange(null);
      return;
    }

    if (shouldConvertToWebP(selectedFile)) {
      onChange(selectedFile);

      convertToWebP(selectedFile)
        .then(({ webpFile }) => {
          onChange(webpFile);
        })
        .catch((error) => {
          console.error("WebP conversion failed, using original file:", error);
        });
    } else {
      onChange(selectedFile);
    }
  };
};
