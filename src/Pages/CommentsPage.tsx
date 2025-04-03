import { comments } from "@/mock";
import CommentBox from "@/components/CommentBox";
import { MessageCircle, RefreshCw, Filter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const CommentsPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 앱 헤더 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm border-b p-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold flex items-center">
              <MessageCircle size={20} className="text-[#5cc570] mr-2" /> 댓글
            </h1>
          </div>
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className={isLoading ? "animate-spin text-[#5cc570]" : ""}
            >
              <RefreshCw size={18} />
            </Button>
            <Button variant="ghost" size="icon">
              <Filter size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4 px-2">
          <span className="text-gray-500 text-sm font-medium">
            {comments.length}개의 댓글
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium text-[#5cc570]">최신순</span>
            <span className="mx-1">•</span>
            <span>인기순</span>
          </div>
        </div>

        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentBox comment={comment} />
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 shadow-lg">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
              <img
                src="https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png"
                alt="내 프로필"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-gray-500">
              댓글을 입력하세요...
            </div>
            <Button size="sm" variant="ghost" className="text-[#5cc570]">
              게시
            </Button>
          </div>
        </div>

        {/* 댓글 입력창 여백 */}
        <div className="h-20"></div>
      </main>
    </div>
  );
};

export default CommentsPage;
