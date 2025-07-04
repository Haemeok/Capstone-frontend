import { useState } from "react";
import { useParams } from "next/navigation";

import { InfiniteData } from "@tanstack/react-query";

import { SORT_TYPE_CODES } from "@/shared/config/constants/recipe";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { cn } from "@/shared/lib/utils";
import { getNextPageParam } from "@/shared/lib/utils";
import PrevButton from "@/shared/ui/PrevButton";

import { CommentsApiResponse,getComments } from "@/entities/comment";
import { useRecipeDetailQuery } from "@/entities/recipe";

import CommentCard from "@/features/comment-card/ui/CommentCard";
import { CommentInput } from "@/features/comment-create";

const CommentsPage = () => {
  const [sort, setSort] = useState<string>("최신순");
  const params = useParams();
  const recipeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { recipeData } = useRecipeDetailQuery(Number(recipeId));
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
        recipeId: Number(recipeId),
        pageParam,
      }),
    getNextPageParam: getNextPageParam,
    initialPageParam: 0,
  });

  const comments = data?.pages.flatMap((page) => page.content);

  return (
    <div className="relative h-full bg-[#f7f7f7] pb-10">
      <header className="sticky top-0 z-10 border-b bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2">
            <PrevButton size={22} />
            <h1 className="flex items-center text-xl font-bold">댓글</h1>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="mb-4 flex items-center justify-between px-2">
          <span className="text-sm font-medium text-gray-500">
            {data?.pages[0].page.totalElements}개의 댓글
          </span>
          <div className="flex items-center text-sm font-semibold">
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

        <div className="flex flex-col gap-4">
          {comments?.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              hideReplyButton={false}
              recipeId={Number(recipeId)}
            />
          ))}
        </div>
        <div ref={ref} className="h-10">
          {isFetchingNextPage && (
            <div className="flex justify-center p-4">
              <p className="text-sm text-gray-500">더 많은 댓글 로딩 중...</p>
            </div>
          )}

          {!hasNextPage && comments && comments.length > 0 && (
            <div className="flex justify-center p-4">
              <p className="text-sm text-gray-400">마지막 댓글입니다.</p>
            </div>
          )}
          {comments?.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-1 p-4">
              <p className="text-sm text-gray-400">
                첫번째 댓글을 작성해보세요 !
              </p>
            </div>
          )}
        </div>
      </main>

      <CommentInput author={author} />
    </div>
  );
};

export default CommentsPage;
