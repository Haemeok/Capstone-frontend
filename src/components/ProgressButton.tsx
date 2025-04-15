import { Clipboard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
        'group relative w-full overflow-hidden rounded-lg shadow-md',
        className,
      )}
    >
      <div className="absolute inset-0 bg-gray-300"></div>

      <div
        className="bg-olive-light absolute inset-y-0 left-0 transition-all duration-700 ease-out group-hover:brightness-110"
        style={{ width: `${progressPercentage}%` }}
      ></div>

      <Button
        className="group relative z-10 w-full cursor-pointer bg-transparent py-6 text-lg font-semibold transition-none hover:bg-transparent"
        disabled={!isFormValid}
        onClick={onClick}
      >
        <span className="flex items-center justify-center gap-2 text-white drop-shadow-sm">
          <Clipboard
            size={20}
            className="transition-transform duration-300 group-hover:scale-120"
          />
          <span>레시피 생성하기</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </Button>
    </div>
  );
};

export default ProgressButton;
