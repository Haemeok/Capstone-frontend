import { cn } from "@/shared/lib/utils";

type BetaBadgeProps = {
  className?: string;
};

const BetaBadge = ({ className }: BetaBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex h-5 items-center justify-center rounded-full bg-amber-100 px-2.5",
        className
      )}
      aria-label="베타 기능"
    >
      <span className="text-xs font-bold tracking-wide text-amber-700">
        Beta
      </span>
    </div>
  );
};

export default BetaBadge;
