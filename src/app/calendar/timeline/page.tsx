"use client";

import { Loader2 } from "lucide-react";

import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { useRecordsTimelineInfiniteQuery } from "@/entities/recipe/model/hooks";

import { TimelineDateGroup } from "./components/TimelineDateGroup";
import { TimelineEmpty } from "./components/TimelineEmpty";

const SKELETON_COUNT = 3;

const TimelineSkeletonItem = () => (
  <div className="flex h-32 animate-pulse gap-4 rounded-2xl bg-white p-4 shadow-sm">
    <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-gray-100" />
    <div className="flex flex-1 flex-col justify-between py-1">
      <div className="h-5 w-2/3 rounded bg-gray-100" />
      <div className="h-4 w-1/2 rounded bg-gray-100" />
      <div className="h-6 w-24 rounded-full bg-gray-100" />
    </div>
  </div>
);

const TimelineRecordsPage = () => {
  const {
    groups,
    ref,
    isFetchingNextPage,
    hasNextPage,
    isPending,
    noResults,
  } = useRecordsTimelineInfiniteQuery();

  return (
    <Container>
      <header className="sticky top-0 z-10 flex items-center justify-center bg-white pt-4 pb-2">
        <PrevButton className="absolute left-0" />
        <h1 className="text-xl font-bold text-gray-900">요리 기록</h1>
      </header>

      <div className="pb-8">
        {isPending ? (
          <div className="flex flex-col gap-3 pt-6">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <TimelineSkeletonItem key={index} />
            ))}
          </div>
        ) : noResults ? (
          <div className="pt-6">
            <TimelineEmpty />
          </div>
        ) : (
          <>
            {groups.map((group) => (
              <TimelineDateGroup key={group.date} group={group} />
            ))}

            <div
              ref={ref}
              className="flex h-16 items-center justify-center"
              aria-hidden={!hasNextPage}
            >
              {isFetchingNextPage && (
                <Loader2 className="size-5 animate-spin text-gray-400" />
              )}
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default TimelineRecordsPage;
