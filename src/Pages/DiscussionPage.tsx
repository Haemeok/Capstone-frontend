import { useParams, useNavigate } from 'react-router';
import CommentBox from '@/components/CommentBox';
import {
  ArrowLeft,
  Share2,
  MoreHorizontal,
  MessageCircle,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Comment } from '@/type/comment';
import {
  getReplies,
  RepliesApiResponse,
  TotalRepliesApiResponse,
} from '@/api/comment';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { InfiniteData } from '@tanstack/react-query';
import CommentInput from '@/components/CommentInput';
import { comments } from '@/mock';
import Circle from '@/components/Icon/Circle';
import { cn } from '@/lib/utils';

const DiscussionPage = () => {
  const { commentId } = useParams<{ commentId: string }>();
  const { recipeId } = useParams<{ recipeId: string }>();
  const [sort, setSort] = useState<string>('최신순');
  const navigate = useNavigate();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    ref,
    refetch,
  } = useInfiniteScroll<
    TotalRepliesApiResponse,
    Error,
    InfiniteData<TotalRepliesApiResponse>,
    [string, string | undefined, string | undefined, string],
    number
  >({
    queryKey: ['comments', recipeId, commentId, sort],
    queryFn: ({ pageParam }) =>
      getReplies({
        recipeId: Number(recipeId),
        commentId: Number(commentId),
        pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.replies.page.number < lastPage.replies.page.totalPages - 1
        ? null
        : lastPage.replies.page.number + 1,
    initialPageParam: 0,
  });
  console.log('data', data);
  const replies = data?.pages.flatMap((page) => page.replies.content);
  const parentComment: Comment = {
    id: data?.pages[0]?.id ?? 0,
    content: data?.pages[0]?.content ?? '',
    createdAt: data?.pages[0]?.createdAt ?? '',
    author: data?.pages[0]?.author ?? {
      id: 0,
      nickname: '',
      profileImage: '',
    },
    likeCount: data?.pages[0]?.likeCount ?? 0,
    replyCount: data?.pages[0]?.replyCount ?? 0,
    likedByCurrentUser: data?.pages[0]?.likedByCurrentUser ?? false,
  };

  return (
    <div className="">
      <header className="sticky top-0 z-10 border-b bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">답글</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-4">
        <CommentBox
          comment={parentComment}
          hideReplyButton={true}
          recipeId={Number(recipeId)}
        />

        <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between px-2">
            <span className="text-sm font-medium text-gray-500">
              {data?.pages[0].replies.page.totalElements}개의 댓글
            </span>
            <div className="flex items-center text-sm font-semibold">
              <button
                className={cn(
                  'text-gray-400',
                  sort === '최신순' && 'text-olive-light',
                )}
                onClick={() => setSort('최신순')}
              >
                최신순
              </button>
              <span className="mx-1">•</span>
              <button
                className={cn(
                  'text-gray-400',
                  sort === '인기순' && 'text-olive-light',
                )}
                onClick={() => setSort('인기순')}
              >
                인기순
              </button>
            </div>
          </div>

          <div className="mb-4 space-y-3">
            {replies?.map((reply) => (
              <CommentBox
                comment={reply}
                hideReplyButton={true}
                recipeId={Number(recipeId)}
              />
            ))}
            <div ref={ref} className="h-10">
              {isFetchingNextPage && (
                <div className="flex justify-center p-4">
                  <p className="text-sm text-gray-500">
                    더 많은 댓글 로딩 중...
                  </p>
                </div>
              )}

              {!hasNextPage && replies && replies.length > 0 && (
                <div className="flex justify-center p-4">
                  <p className="text-sm text-gray-400">마지막 댓글입니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <CommentInput
          author={parentComment.author}
          commentId={Number(commentId)}
        />
      </main>
    </div>
  );
};

export default DiscussionPage;
