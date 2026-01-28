"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { InfiniteData } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";

import { SORT_TYPE_CODES } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { cn } from "@/shared/lib/utils";
import { getNextPageParam } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { CommentsApiResponse, getComments } from "@/entities/comment";
import { useRecipeDetailQuery } from "@/entities/recipe";

import CommentCard from "@/features/comment-card/ui/CommentCard";
import { CommentInput } from "@/features/comment-create";
import CommentInputModal from "@/features/comment-create/ui/CommentInputModal";
import { RecipeStatusProvider } from "@/features/recipe-status";

const CommentsPage = () => {
  const [sort, setSort] = useState<string>("최신순");
  const { recipeId } = useParams<{ recipeId: string }>();
  const { recipeData } = useRecipeDetailQuery(recipeId);
  const author = recipeData.author;
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

  return (
    <RecipeStatusProvider recipeId={recipeId}>
      <div className="relative h-full pb-10">
        <Container padding={false}>
          <header className="z-sticky sticky-optimized sticky top-0 border-b bg-white px-4 py-3">
            <div className="flex max-w-3xl items-center">
              <div className="flex items-center gap-2">
                <PrevButton size={22} showOnDesktop={true} />
                <h1 className="flex items-center text-xl font-bold">댓글</h1>
              </div>
            </div>
          </header>

          <main className="py-4">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-sm font-medium text-gray-500">
                {data?.pages[0].page.totalElements}개의 댓글
              </span>
              <div className="flex items-center gap-1">
                <button
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                    sort === "최신순"
                      ? "bg-olive-light/10 text-olive-light"
                      : "text-gray-400 hover:bg-gray-100"
                  )}
                  onClick={() => setSort("최신순")}
                >
                  최신순
                </button>
                <button
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                    sort === "인기순"
                      ? "bg-olive-light/10 text-olive-light"
                      : "text-gray-400 hover:bg-gray-100"
                  )}
                  onClick={() => setSort("인기순")}
                >
                  인기순
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
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-olive-light border-t-transparent" />
                  <p className="text-sm text-gray-500">댓글 불러오는 중</p>
                </div>
              )}

              {!hasNextPage && comments && comments.length > 0 && (
                <div className="flex justify-center p-4">
                  <p className="text-sm text-gray-400">마지막 댓글입니다.</p>
                </div>
              )}
              {comments?.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-12">
                  <MessageSquare size={40} className="text-gray-300" />
                  <p className="text-sm text-gray-500">아직 댓글이 없어요</p>
                  <p className="text-xs text-gray-400">
                    첫 번째 댓글을 남겨보세요
                  </p>
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
