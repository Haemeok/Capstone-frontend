import { Container } from "@/shared/ui/Container";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

const SlideSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-6 w-40" />
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="w-36 shrink-0 space-y-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  </div>
);

export const SearchDiscoverySkeleton = () => (
  <Container className="pt-0">
    <div className="space-y-6 pt-4 pb-10">
      <Skeleton className="h-11 w-full rounded-full" />
      <SlideSkeleton />
      <SlideSkeleton />
    </div>
  </Container>
);
