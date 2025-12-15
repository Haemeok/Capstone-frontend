import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

export default function RecipeDetailLoading() {
  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center px-4">
        <PrevButton showOnDesktop={true} />
      </div>

      <section className="flex flex-col items-center justify-center">
        <div className="relative w-full max-w-[550px] md:mt-4 md:w-1/2">
          <Skeleton className="aspect-square w-full md:rounded-2xl" />
        </div>

        <div className="mt-4 w-fit p-2">
          <Skeleton className="h-6 w-32" />
        </div>
      </section>

      <RecipeContainerSkeleton />
    </>
  );
}

function RecipeContainerSkeleton() {
  return (
    <Container>
      <div className="relative mt-6 flex flex-col space-y-8 pb-10">
        <div className="flex flex-col items-center justify-center gap-3">
          <Skeleton className="h-8 w-2/3 max-w-sm" />

          <div className="flex justify-center gap-4 py-2">
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-14 w-14 rounded-full" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex h-[80px] w-full max-w-md items-center gap-2">
            <Skeleton className="h-[80px] w-[80px] rounded-lg" />
            <div className="flex w-full flex-col gap-2 p-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full max-w-[200px]" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        <div className="flex justify-between rounded-lg border p-4">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />{" "}
                  {/* Ingredient Icon */}
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
