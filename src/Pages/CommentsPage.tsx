import CommentBox from '@/components/CommentBox';
import {
  MessageCircle,
  RefreshCw,
  Filter,
  ArrowLeft,
  ArrowUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import CommentInput from '@/components/CommentInput';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { CommentsApiResponse, getComments } from '@/api/comment';
import { InfiniteData } from '@tanstack/react-query';
import { SORT_TYPE_CODES } from '@/constants/recipe';
import { useLocation, useParams } from 'react-router';

const CommentsPage = () => {
  const [sort, setSort] = useState<string>('최신순');
  const { recipeId } = useParams();
  const author = useLocation().state?.author;
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
    CommentsApiResponse,
    Error,
    InfiniteData<CommentsApiResponse>,
    [string, string | undefined, string],
    number
  >({
    queryKey: ['comments', recipeId, sort],
    queryFn: ({ pageParam }) =>
      getComments({
        sort: SORT_TYPE_CODES[sort as keyof typeof SORT_TYPE_CODES],
        recipeId: Number(recipeId),
        pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? null : lastPage.number + 1,
    initialPageParam: 0,
  });

  const comments = data?.pages.flatMap((page) => page.content);

  return (
    <div className="relative h-full bg-[#f7f7f7] pb-24">
      <header className="sticky top-0 z-10 border-b bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="flex items-center text-xl font-bold">
              <MessageCircle size={20} className="mr-2 text-[#526c04]" /> 댓글
            </h1>
          </div>
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              className={isFetching ? 'animate-spin text-[#526c04]' : ''}
            >
              <RefreshCw size={18} />
            </Button>
            <Button variant="ghost" size="icon">
              <Filter size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="h-full p-4">
        <div className="mb-4 flex items-center justify-between px-2">
          <span className="text-sm font-medium text-gray-500">
            {data?.pages[0].totalElements}개의 댓글
          </span>
          <div className="text-olive flex items-center text-sm font-semibold">
            <span>최신순</span>
            <span className="mx-1">•</span>
            <span>인기순</span>
          </div>
        </div>
        {comments?.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-500">댓글이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments?.map((comment) => (
              <CommentBox comment={comment} hideReplyButton={false} />
            ))}
          </div>
        )}
      </main>

      <CommentInput author={author} />
    </div>
  );
};

export default CommentsPage;
