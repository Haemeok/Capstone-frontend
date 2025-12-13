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

      const dataURL = await toPng(shareElement, {
        cacheBust: false,
        backgroundColor: "#FFFEF7",
        pixelRatio: 2,
        style: {
          height: "auto",
        },
      });

      setImageUrl(dataURL);
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [elementId]);

  const downloadImage = () => {
    if (!imageUrl) {
      alert("이미지 생성 중입니다. 잠시만 기다려주세요!");
      return;
    }

    const link = document.createElement("a");
    link.download = `recipio-ticket-${Date.now()}.png`;
    link.href = imageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { generateImage, downloadImage, imageUrl, isLoading };
};
