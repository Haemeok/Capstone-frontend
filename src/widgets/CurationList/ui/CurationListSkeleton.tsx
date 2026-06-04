type CurationListSkeletonProps = {
  count?: number;
};

export const CurationListSkeleton = ({
  count = 8,
}: CurationListSkeletonProps) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-beige/70 aspect-square w-full" />
        <div className="bg-beige mt-2 h-3 w-1/3" />
        <div className="bg-beige mt-2 h-4 w-4/5" />
      </div>
    ))}
  </>
);
