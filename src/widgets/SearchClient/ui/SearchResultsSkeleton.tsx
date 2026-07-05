import { Container } from "@/shared/ui/Container";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

const DETAILED_GRID_CLASS =
  "grid gap-4 px-2 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(165px,1fr))] md:[grid-template-columns:repeat(auto-fill,minmax(170px,1fr))] lg:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]";

const DetailedCellSkeleton = () => (
  <div className="flex shrink-0 flex-col gap-2 rounded-2xl">
    <Skeleton className="aspect-square w-full rounded-2xl" />
    <div className="flex grow flex-col gap-0.5 px-2 pb-2">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="mt-1 h-4 w-32" />
      <div className="mt-1 flex items-center gap-1">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </div>
);

export const SearchGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div>
    <div className={DETAILED_GRID_CLASS}>
      {Array.from({ length: count }).map((_, index) => (
        <DetailedCellSkeleton key={index} />
      ))}
    </div>
  </div>
);

const SearchChromeSkeleton = () => (
  <div className="sticky top-0 z-20 border-b border-gray-200 bg-white p-4 pb-0">
    <div className="flex items-center gap-2">
      <Skeleton className="h-6 w-6 shrink-0 rounded-md" />
      <Skeleton className="h-10 min-w-0 flex-1 rounded-full" />
    </div>
    <div className="-mx-4 flex items-center gap-1.5 overflow-x-hidden px-4 py-2">
      <Skeleton className="h-8 w-16 shrink-0 rounded-full" />
      <span className="h-6 w-px shrink-0 self-center bg-gray-200" />
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-14 shrink-0 rounded-full" />
      ))}
    </div>
  </div>
);

export const SearchResultsSkeleton = () => (
  <Container padding={false}>
    <div className="flex flex-col bg-white">
      <SearchChromeSkeleton />
      <div className="pt-4">
        <SearchGridSkeleton />
      </div>
    </div>
  </Container>
);
