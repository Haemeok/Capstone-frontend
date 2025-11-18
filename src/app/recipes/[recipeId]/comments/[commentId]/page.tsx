"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { InfiniteData } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { cn } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/shadcn/button";

import { getReplies, TotalRepliesApiResponse } from "@/entities/comment";

import CommentCard from "@/features/comment-card/ui/CommentCard";
import { CommentInput } from "@/features/comment-create";
import CommentInputModal from "@/features/comment-create/ui/CommentInputModal";

const DiscussionPage = () => {
  const { commentId } = useParams<{ commentId: string }>();
  const { recipeId } = useParams<{ recipeId: string }>();
  const [sort, setSort] = useState<string>("최신순");
  const router = useRouter();

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
        recipeId: Number(recipeId),
        commentId: Number(commentId),
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
    <div className="">
      <header className="sticky top-0 z-10 border-b bg-white p-4 shadow-sm md:top-16">
        <div className="mx-auto flex max-w-3xl items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => router.back()}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">답글</h1>
          </div>
        </div>
      </header>

      <Container maxWidth="3xl">
        <main className="py-4">
          {parentComment ? (
            <CommentCard
              comment={parentComment}
              hideReplyButton
              recipeId={Number(recipeId)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-1 border-gray-200 p-4">
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
                  <div className="flex items-center text-sm font-bold">
                    <button
                      className={cn(
                        "text-gray-400",
                        sort === "최신순" && "text-olive-light"
                      )}
                      onClick={() => setSort("최신순")}
                    >
                      최신순
                    </button>
                    <span className="mx-1">•</span>
                    <button
                      className={cn(
                        "text-gray-400",
                        sort === "인기순" && "text-olive-light"
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
                      recipeId={Number(recipeId)}
                    />
                  ))}
                  <div ref={ref} className="h-10">
                    {isFetching && (
                      <div className="flex justify-center p-4">
                        <p className="text-sm text-gray-500">
                          더 많은 답글 로드 중...
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
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-base text-gray-400">
                  첫번째 답글을 남겨보세요!
                </p>
              </div>
            )}
          </div>

          {parentComment && (
            <>
              <CommentInput
                author={parentComment.author}
                commentId={Number(commentId)}
              />
              <CommentInputModal
                author={parentComment.author}
                commentId={Number(commentId)}
              />
            </>
          )}
        </main>
      </Container>
    </div>
  );
};

export default DiscussionPage;
