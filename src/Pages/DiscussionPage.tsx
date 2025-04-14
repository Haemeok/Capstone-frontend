import { useParams, useNavigate } from "react-router";
import { comments, replies } from "@/mock";
import CommentBox from "@/components/CommentBox";
import {
  ArrowLeft,
  Share2,
  MoreHorizontal,
  MessageCircle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DiscussionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const commentId = parseInt(id || "0");
  const [newReply, setNewReply] = useState("");

  const parentComment = comments.find((comment) => comment.id === commentId);

  if (!parentComment) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-md">
          <MessageCircle size={40} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            코멘트를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            요청하신 코멘트가 삭제되었거나 존재하지 않습니다.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const handleSendReply = () => {
    if (newReply.trim()) {
      console.log("답글 등록:", newReply);
      setNewReply("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-10 bg-white shadow-sm border-b p-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold">토론</h1>
          </div>
          <div className="flex">
            <Button variant="ghost" size="icon">
              <Share2 size={18} />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        <CommentBox comment={parentComment} hideReplyButton={true} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <MessageCircle size={18} className="text-blue-500 mr-2" />
              답글
              <span className="ml-2 py-0.5 px-2 bg-gray-100 rounded-full text-sm text-gray-600">
                {parentComment.replyCount}
              </span>
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="text-xs py-1 px-2 rounded-full"
            >
              최신순 ▼
            </Button>
          </div>

          <div className="space-y-3 mb-4">
            {replies.map((reply) => (
              <CommentBox comment={reply} hideReplyButton={true} />
            ))}
          </div>
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
            <div className="flex-1 bg-gray-100 rounded-full px-4 flex items-center">
              <input
                type="text"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder={`${parentComment.user.nickname}님에게 답글 남기기...`}
                className="py-2 bg-transparent w-full focus:outline-none text-sm"
              />
            </div>
            <Button
              size="icon"
              variant={newReply.trim() ? "default" : "ghost"}
              className={
                newReply.trim()
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "text-gray-400"
              }
              onClick={handleSendReply}
              disabled={!newReply.trim()}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>

        <div className="h-20"></div>
      </main>
    </div>
  );
};

export default DiscussionPage;
