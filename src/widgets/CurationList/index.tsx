"use client";

import { Container } from "@/shared/ui/Container";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import { alegreya } from "@/features/archetype/ui/fonts";
import { CurationListCard } from "@/features/curation";

import { useCurationArticles } from "./hooks/useCurationArticles";
import { CurationListSkeleton } from "./ui/CurationListSkeleton";

const GRID_CLASS =
  "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4";

type CurationListClientProps = {
  category: string | null;
  initialPage?: number;
};

export const CurationListClient = ({
  category,
  initialPage = 0,
}: CurationListClientProps) => {
  const { items, hasNextPage, isFetching, isPending, ref, noResults } =
    useCurationArticles({ category, initialPage });

  return (
    <Container maxWidth="6xl">
      <header
        className={`${alegreya.variable} pb-8 text-center sm:pb-12`}
        style={{ fontFamily: "var(--font-alegreya), serif" }}
      >
        <p className="text-xs tracking-[0.4em] text-brown/60 sm:text-sm">
          LIFESTYLE
        </p>
        <h1 className="mt-1 text-6xl leading-none tracking-tight text-brown sm:text-7xl">
          FOOD
        </h1>
      </header>
      <ErrorBoundary
        fallback={
          <SectionErrorFallback message="큐레이션을 불러올 수 없어요" />
        }
      >
        {noResults ? (
          <p className="py-16 text-center text-sm text-brown/60">
            아직 발행된 큐레이션이 없어요.
          </p>
        ) : (
          <div className={GRID_CLASS}>
            {items.map((item, i) => (
              <CurationListCard
                key={item.id}
                slug={item.slug}
                title={item.title}
                category={item.category}
                coverImageKey={item.coverImageKey}
                priority={i < 4}
              />
            ))}
            {(isFetching || isPending) && (
              <CurationListSkeleton count={isPending ? 8 : 4} />
            )}
          </div>
        )}
        {hasNextPage && <div ref={ref} className="h-16" aria-hidden />}
      </ErrorBoundary>
    </Container>
  );
};
