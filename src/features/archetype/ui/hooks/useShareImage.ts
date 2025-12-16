import { toPng } from "html-to-image";
import { useState, useCallback } from "react";

export const useShareImage = (elementId: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = useCallback(async () => {
    const shareElement = document.getElementById(elementId);
    if (!shareElement) return;

    try {
      setIsLoading(true);

      await document.fonts.ready;

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      const options = {
        cacheBust: true,
        backgroundColor: "#FFFEF7",
        pixelRatio: isMobile ? 2 : 3,
        style: {
          height: "auto",
        },

        fetchRequestInit: {
          cache: "no-cache",
        } as RequestInit,
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
      alert("이미지 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [elementId]);

  const downloadImage = async () => {
    if (!imageUrl) {
      alert("이미지 생성 중입니다. 잠시만 기다려주세요!");
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
          title: "Recipio 티켓",
          text: "나의 파인다이닝 페르소나",
        });
      } else {
        const link = document.createElement("a");
        link.download = `recipio-ticket-${Date.now()}.png`;
        link.href = imageUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert("티켓이 앨범에 저장되었습니다!");
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
          alert("티켓이 저장되었습니다!");
        } catch (downloadError) {
          alert("저장에 실패했습니다. 화면을 캡처해서 사용해주세요.");
        }
      }
    }
  };

  return { generateImage, downloadImage, imageUrl, isLoading };
};
