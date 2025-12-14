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

      const dataURL = await toPng(shareElement, {
        cacheBust: false,
        backgroundColor: "#FFFEF7",
        pixelRatio: isMobile ? 1.5 : 2,
        style: {
          height: "auto",
        },
      });

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
      if (navigator.share && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
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
      }
    } catch (error) {
      console.error("Download/Share failed:", error);
      const link = document.createElement("a");
      link.download = `recipio-ticket-${Date.now()}.png`;
      link.href = imageUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return { generateImage, downloadImage, imageUrl, isLoading };
};
