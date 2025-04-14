import { Clipboard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProgressButtonProps = {
  progressPercentage: number;
  isFormValid: boolean;
  onClick?: () => void;
  className?: string;
};

const ProgressButton = ({
  progressPercentage,
  isFormValid,
  onClick,
  className,
}: ProgressButtonProps) => {
  return (
    <div
      className={cn(
        "relative w-full rounded-lg overflow-hidden shadow-md group",
        className
      )}
    >
      <div className="absolute inset-0 bg-gray-300"></div>

      <div
        className="absolute inset-y-0 left-0 bg-olive-light transition-all duration-700 ease-out group-hover:brightness-110"
        style={{ width: `${progressPercentage}%` }}
      ></div>

      <Button
        className="w-full py-6 text-lg font-semibold relative z-10 bg-transparent hover:bg-transparent transition-none group cursor-pointer"
        disabled={!isFormValid}
        onClick={onClick}
      >
        <span className="flex items-center justify-center gap-2 text-white drop-shadow-sm">
          <Clipboard
            size={20}
            className="group-hover:scale-120 transition-transform duration-300"
          />
          <span>레시피 생성하기</span>
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </span>
      </Button>
    </div>
  );
};

export default ProgressButton;
