"use client";

import { useToastStore } from "@/widgets/Toast/model/store";

type UseShareProps = {
  title?: string;
  text?: string;
  url?: string;
};

export const useShare = () => {
  const { addToast } = useToastStore();

  const share = async ({ 
    title = "해먹에서 발견한 멋진 레시피!", 
    text = "이 레시피를 확인해보세요!", 
    url 
  }: UseShareProps = {}) => {
    const shareUrl = url || window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("공유 실패:", error);
          addToast({
            message: "공유에 실패했습니다. 다시 시도해주세요.",
            variant: "error",
          });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        addToast({
          message: "공유 링크가 복사되었습니다!",
          variant: "success",
        });
      } catch (err) {
        console.error("링크 복사 실패", err);
        addToast({
          message: "오류가 발생했습니다. 다시 시도해주세요.",
          variant: "error",
        });
      }
    }
  };

  return { share };
};