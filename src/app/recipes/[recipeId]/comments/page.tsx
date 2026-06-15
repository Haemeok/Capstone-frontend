"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { InfiniteData } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";

import { SORT_TYPE_CODES } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { format, plural, useCommentsDict } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import { getNextPageParam } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { CommentsApiResponse, getComments } from "@/entities/comment";
import {
  type CommentSortState,
  resolveCommentSortLabel,
} from "@/entities/comment/lib/commentSortLabel";
import { useRecipeDetailQuery } from "@/entities/recipe";

import CommentCard from "@/features/comment-card/ui/CommentCard";
import { CommentInput } from "@/features/comment-create";
import CommentInputModal from "@/features/comment-create/ui/CommentInputModal";
import { RecipeStatusProvider } from "@/features/recipe-status";

const CommentsPage = () => {
  const [sort, setSort] = useState<CommentSortState>("최신순");
  const { recipeId } = useParams<{ recipeId: string }>();
  const { recipeData } = useRecipeDetailQuery(recipeId);
  const author = recipeData.author;
  const t = useCommentsDict();
  const { data, hasNextPage, isFetchingNextPage, ref } = useInfiniteScroll<
    CommentsApiResponse,
    Error,
    InfiniteData<CommentsApiResponse>,
    [string, string | undefined, string],
    number
  >({
    queryKey: ["comments", recipeId, sort],
    queryFn: ({ pageParam }) =>
      getComments({
        sort: SORT_TYPE_CODES[sort as keyof typeof SORT_TYPE_CODES],
        recipeId,
        pageParam,
      }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
  });

  const comments = data?.pages.flatMap((page) => page.content);
  const totalElements = data?.pages[0].page.totalElements ?? 0;

  return (
    <RecipeStatusProvider recipeId={recipeId}>
      <div className="relative h-full pb-10">
        <header className="z-sticky sticky-optimized sticky top-0 border-b bg-white px-4 py-3">
          <div className="flex max-w-3xl items-center">
            <div className="flex items-center gap-2">
              <PrevButton size={22} showOnDesktop={true} />
              <h1 className="flex items-center text-xl font-bold">{t.title}</h1>
            </div>
          </div>
        </header>
        <Container className="pt-0">
          <main className="py-4">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-ink-muted text-sm font-medium">
                {format(plural(totalElements, t.count), {
                  count: totalElements,
                })}
              </span>
              <div className="flex items-center gap-1">
                <button
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                    sort === "최신순"
                      ? "bg-olive-light/10 text-olive-light"
                      : "text-ink-muted hover:bg-gray-100"
                  )}
                  onClick={() => setSort("최신순")}
                >
                  {resolveCommentSortLabel("최신순", t.sort)}
                </button>
                <button
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                    sort === "인기순"
                      ? "bg-olive-light/10 text-olive-light"
                      : "text-ink-muted hover:bg-gray-100"
                  )}
                  onClick={() => setSort("인기순")}
                >
                  {resolveCommentSortLabel("인기순", t.sort)}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {comments?.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  hideReplyButton={false}
                />
              ))}
            </div>
            <div ref={ref} className="h-10">
              {isFetchingNextPage && (
                <div className="flex items-center justify-center gap-2 p-4">
                  <div className="border-olive-light h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  <p className="text-ink-muted text-sm">{t.loadingMore}</p>
                </div>
              )}

              {!hasNextPage && comments && comments.length > 0 && (
                <div className="flex justify-center p-4">
                  <p className="text-ink-muted text-sm">{t.lastItem}</p>
                </div>
              )}
              {comments !== undefined && comments.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-12">
                  <MessageSquare size={40} className="text-gray-300" />
                  <p className="text-ink-muted text-sm">{t.emptyTitle}</p>
                  <p className="text-ink-muted text-xs">{t.emptyCta}</p>
                </div>
              )}
            </div>
          </main>
        </Container>

        <CommentInput author={author} />
        <CommentInputModal author={author} />
      </div>
    </RecipeStatusProvider>
  );
};

export default CommentsPage;
