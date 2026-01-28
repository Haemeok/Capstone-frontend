"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { InfiniteData } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { cn } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { getReplies, TotalRepliesApiResponse } from "@/entities/comment";

import CommentCard from "@/features/comment-card/ui/CommentCard";
import { CommentInput } from "@/features/comment-create";
import CommentInputModal from "@/features/comment-create/ui/CommentInputModal";
import { RecipeStatusProvider } from "@/features/recipe-status";

const DiscussionPage = () => {
  const { commentId } = useParams<{ commentId: string }>();
  const { recipeId } = useParams<{ recipeId: string }>();
  const [sort, setSort] = useState<string>("최신순");

  const { data, hasNextPage, isFetching, ref } = useInfiniteScroll<
    TotalRepliesApiResponse,
    Error,
    InfiniteData<TotalRepliesApiResponse>,
    [string, string | undefined, string | undefined, string],
    number
  >({
    queryKey: ["comments", recipeId, commentId, sort],
    queryFn: ({ pageParam }) =>
      getReplies({
        recipeId,
        commentId,
        pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.replies.page.totalPages === 0) return null;
      return lastPage.replies.page.number ===
        lastPage.replies.page.totalPages - 1
        ? null
        : lastPage.replies.page.number + 1;
    },
    initialPageParam: 0,
  });

  const replies = data?.pages.flatMap((page) => page.replies.content);
  const parentComment = data?.pages[0];

  return (
    <RecipeStatusProvider recipeId={recipeId}>
      <div className="relative h-full pb-10">
        <Container padding={false}>
          <header className="z-sticky sticky-optimized sticky top-0 border-b bg-white px-4 py-3">
            <div className="flex max-w-3xl items-center">
              <div className="flex items-center gap-2">
                <PrevButton size={22} showOnDesktop={true} />
                <h1 className="text-xl font-bold">답글</h1>
              </div>
            </div>
          </header>

          <main className="py-4">
            {parentComment ? (
              <CommentCard comment={parentComment} hideReplyButton />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 p-4">
                <p className="mb-4 text-lg text-gray-500">
                  해당 답글을 찾을 수 없습니다.
                </p>
              </div>
            )}

            <div className="mt-4 mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              {replies && replies.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-between px-2">
                    <span className="text-sm font-medium text-gray-500">
                      {data?.pages[0].replies.page.totalElements}개의 답글
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

                  <div className="mb-4 space-y-3">
                    {replies.map((reply) => (
                      <CommentCard
                        key={reply.id}
                        comment={reply}
                        hideReplyButton
                      />
                    ))}
                    <div ref={ref} className="h-10">
                      {isFetching && (
                        <div className="flex items-center justify-center gap-2 p-4">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-olive-light border-t-transparent" />
                          <p className="text-sm text-gray-500">
                            답글 불러오는 중
                          </p>
                        </div>
                      )}

                      {!hasNextPage && replies.length > 0 && (
                        <div className="flex justify-center p-4">
                          <p className="text-sm text-gray-400">
                            마지막 답글입니다.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12">
                  <MessageSquare size={40} className="text-gray-300" />
                  <p className="text-sm text-gray-500">아직 답글이 없어요</p>
                  <p className="text-xs text-gray-400">
                    첫 번째 답글을 남겨보세요
                  </p>
                </div>
              )}
            </div>
          </main>
        </Container>

        {parentComment && (
          <>
            <CommentInput
              author={parentComment.author}
              commentId={commentId}
            />
            <CommentInputModal
              author={parentComment.author}
              commentId={commentId}
            />
          </>
        )}
      </div>
    </RecipeStatusProvider>
  );
};

export default DiscussionPage;
