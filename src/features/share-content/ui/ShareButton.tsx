import { Share2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { useToastStore } from "@/widgets/Toast/model/store";

type ShareButtonProps = {
  className?: string;
  label?: string;
  title?: string;
  text?: string;
};

const ShareButton = ({
  className,
  label,
  title = "해먹에서 발견한 멋진 레시피!",
  text = "이 레시피를 확인해보세요!",
  ...props
}: ShareButtonProps) => {
  const { addToast } = useToastStore();

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: window.location.href,
        });
        console.log("공유 성공!");
      } catch (error) {
        console.log("공유 취소됨", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
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

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleShareClick}
        className={cn("flex h-10 w-10 items-center justify-center", className)}
        {...props}
      >
        <Share2 width={24} height={24} />
      </button>
      {label && <p className="mt-1 text-sm font-bold">{label}</p>}
    </div>
  );
};

export default ShareButton;
