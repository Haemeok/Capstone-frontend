import { comments } from '@/mock';
import CommentBox from '@/components/CommentBox';
import { MessageCircle, RefreshCw, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const CommentsPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
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
              onClick={handleRefresh}
              className={isLoading ? 'animate-spin text-[#526c04]' : ''}
            >
              <RefreshCw size={18} />
            </Button>
            <Button variant="ghost" size="icon">
              <Filter size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-4">
        <div className="mb-4 flex items-center justify-between px-2">
          <span className="text-sm font-medium text-gray-500">
            {comments.length}개의 댓글
          </span>
          <div className="text-olive flex items-center text-sm font-semibold">
            <span>최신순</span>
            <span className="mx-1">•</span>
            <span>인기순</span>
          </div>
        </div>

        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentBox comment={comment} />
          ))}
        </div>

        <div className="fixed right-0 bottom-0 left-0 border-t bg-white p-3 shadow-lg">
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
              <img
                src="https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png"
                alt="내 프로필"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-gray-500">
              댓글을 입력하세요...
            </div>
            <button className="text-olive font-semibold">게시</button>
          </div>
        </div>

        {/* 댓글 입력창 여백 */}
        <div className="h-20"></div>
      </main>
    </div>
  );
};

export default CommentsPage;
