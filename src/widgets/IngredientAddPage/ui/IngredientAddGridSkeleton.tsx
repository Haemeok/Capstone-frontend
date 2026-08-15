type IngredientAddSkeletonCardsProps = {
  count: number;
};

type IngredientAddGridSkeletonProps = IngredientAddSkeletonCardsProps & {
  label: string;
};

export const IngredientAddSkeletonCards = ({
  count,
}: IngredientAddSkeletonCardsProps) => (
  <>
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        aria-hidden="true"
        data-testid="ingredient-add-skeleton-card"
        className="motion-safe:animate-pulse"
      >
        <div className="rounded-card aspect-square w-full bg-gray-100" />
        <div className="mt-2 h-3 w-10 rounded-sm bg-gray-100" />
        <div className="mt-1.5 h-4 w-16 rounded-sm bg-gray-100" />
      </div>
    ))}
  </>
);

export const IngredientAddGridSkeleton = ({
  count,
  label,
}: IngredientAddGridSkeletonProps) => (
  <div
    role="status"
    aria-label={label}
    data-testid="ingredient-add-skeleton"
    className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5"
  >
    <IngredientAddSkeletonCards count={count} />
  </div>
);
