import { cn } from "@/shared/lib/utils";

type AIGeneratedBadgeProps = {
  className?: string;
};

const AIGeneratedBadge = ({ className }: AIGeneratedBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex h-5 items-center justify-center rounded-full bg-orange-600 px-2.5",
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
