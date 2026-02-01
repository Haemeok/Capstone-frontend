import { cn } from "@/shared/lib/utils";

type BudgetTier = {
  maxCost: number;
  label: string;
  className: string;
};

const BUDGET_TIERS: BudgetTier[] = [
  { maxCost: 3000, label: "3천원 이하", className: "bg-emerald-500" },
  { maxCost: 5000, label: "5천원 이하", className: "bg-sky-500" },
  { maxCost: 10000, label: "만원 이하", className: "bg-amber-500" },
];

const getBudgetTier = (ingredientCost: number): BudgetTier | null => {
  return BUDGET_TIERS.find((tier) => ingredientCost <= tier.maxCost) ?? null;
};

type BudgetTierBadgeProps = {
  ingredientCost: number;
  className?: string;
};

const BudgetTierBadge = ({
  ingredientCost,
  className,
}: BudgetTierBadgeProps) => {
  const tier = getBudgetTier(ingredientCost);

  if (!tier) return null;

  return (
    <div
      className={cn(
        "inline-flex h-5 items-center justify-center rounded-full px-2",
        tier.className,
        className
      )}
    >
      <span className="text-xs font-bold text-white drop-shadow-sm">
        {tier.label}
      </span>
    </div>
  );
};

export default BudgetTierBadge;
