import { cn } from "@/shared/lib/utils";

type AIGeneratedBadgeProps = {
  className?: string;
};

const AIGeneratedBadge = ({ className }: AIGeneratedBadgeProps) => {
  return (
    <div
      className={cn(
        "bg-olive-mint inline-flex h-5 items-center justify-center rounded-full px-[10px]",
        className
      )}
      aria-label="AI 생성 레시피"
    >
      <span className="text-sm font-bold tracking-wide text-white drop-shadow-sm">
        AI
      </span>
    </div>
  );
};

export default AIGeneratedBadge;
