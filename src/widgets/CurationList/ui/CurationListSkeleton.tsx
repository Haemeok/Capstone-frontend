type CurationListSkeletonProps = {
  count?: number;
};

export const CurationListSkeleton = ({
  count = 8,
}: CurationListSkeletonProps) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="aspect-square w-full bg-beige/70" />
        <div className="mt-2 h-3 w-1/3 bg-beige" />
        <div className="mt-2 h-4 w-4/5 bg-beige" />
      </div>
    ))}
  </>
);
