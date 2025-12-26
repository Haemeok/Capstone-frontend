import { toPng } from "html-to-image";
import { useState, useCallback } from "react";

import { useToastStore } from "@/widgets/Toast/model/store";

export const useShareImage = (elementId: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const convertImagesToBase64 = async (element: HTMLElement) => {
    const images = Array.from(element.getElementsByTagName("img"));
    const originalSrcs = new Map<HTMLImageElement, string>();

    await Promise.all(
      images.map(async (img) => {
        try {
          originalSrcs.set(img, img.src);

          const response = await fetch(img.src, {
            mode: "cors",
            cache: "no-cache",
          });

          const blob = await response.blob();

          await new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = async () => {
              if (reader.result) {
                img.src = reader.result as string;
                try {
                  await img.decode();
                  resolve();
                } catch (e) {
                  reject(e);
                }
              }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Failed to convert image to base64:", error);
        }
      })
    );

    return () => {
      images.forEach((img) => {
        const original = originalSrcs.get(img);
        if (original) {
          img.src = original;
        }
      });
    };
  };

  const generateImage = useCallback(async () => {
    const shareElement = document.getElementById(elementId);
    if (!shareElement) return;

    let cleanupImages: (() => void) | null = null;

    try {
      setIsLoading(true);

      await document.fonts.ready;

      cleanupImages = await convertImagesToBase64(shareElement);

      await new Promise((resolve) => setTimeout(resolve, 150));

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      const options = {
        cacheBust: true,
        backgroundColor: "#FFFEF7",
        pixelRatio: isMobile ? 2 : 3,
        style: {
          height: "auto",
        },
        skipAutoScale: true,
        fontEmbedCSS: "",
      };

      try {
        await toPng(shareElement, options);
      } catch (e) {
        console.warn(
          "Warm-up capture failed (expected behavior on some devices):",
          e
        );
      }

      const dataURL = await toPng(shareElement, options);
      setImageUrl(dataURL);
    } catch (error) {
      console.error("Image generation failed:", error);
      addToast({
        message: "이미지 생성에 실패했습니다. 다시 시도해주세요.",
        variant: "error",
      });
    } finally {
      if (cleanupImages) cleanupImages();
      setIsLoading(false);
    }
  }, [elementId, addToast]);

  const downloadImage = async () => {
    if (!imageUrl) {
      addToast({
        message: "이미지 생성 중입니다. 잠시만 기다려주세요!",
        variant: "info",
      });
      return;
    }

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (navigator.share && isMobile) {
        const blob = await fetch(imageUrl).then((res) => res.blob());
        const file = new File([blob], `recipio-ticket-${Date.now()}.png`, {
          type: "image/png",
        });

        await navigator.share({
          files: [file],
          title: "Recipio - 나의 파인다이닝 페르소나",
          text: "나를 파인다이닝으로 표현해보세요!\n\n링크 주소 : https://recipio.kr/archetype",
          url: "https://recipio.kr/archetype",
        });
      } else {
        const link = document.createElement("a");
        link.download = `recipio-ticket-${Date.now()}.png`;
        link.href = imageUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        addToast({
          message: "티켓이 앨범에 저장되었습니다!",
          variant: "success",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Download/Share failed:", error);

        try {
          const link = document.createElement("a");
          link.download = `recipio-ticket-${Date.now()}.png`;
          link.href = imageUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          addToast({
            message: "티켓이 저장되었습니다!",
            variant: "success",
          });
        } catch (downloadError) {
          addToast({
            message: "저장에 실패했습니다. 화면을 캡처해서 사용해주세요.",
            variant: "error",
          });
        }
      }
    }
  };

  return { generateImage, downloadImage, imageUrl, isLoading };
};
