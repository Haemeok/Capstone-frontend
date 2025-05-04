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
import { comments, replies } from '@/mock';

const DiscussionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const commentId = parseInt(id || '0');
  const [newReply, setNewReply] = useState('');

  const parentComment = comments.find((comment) => comment.id === commentId);

  if (!parentComment) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-md">
          <MessageCircle size={40} className="mx-auto mb-4 text-gray-300" />
          <h2 className="mb-2 text-xl font-bold text-gray-800">
            코멘트를 찾을 수 없습니다
          </h2>
          <p className="mb-4 text-gray-600">
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
      console.log('답글 등록:', newReply);
      setNewReply('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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

      <main className="mx-auto max-w-3xl p-4">
        <CommentBox comment={parentComment} hideReplyButton={true} />

        <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center text-lg font-semibold">
              <MessageCircle size={18} className="mr-2 text-blue-500" />
              답글
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-sm text-gray-600">
                {parentComment.replyCount}
              </span>
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-2 py-1 text-xs"
            >
              최신순 ▼
            </Button>
          </div>

          <div className="mb-4 space-y-3">
            {replies.map((reply) => (
              <CommentBox comment={reply} hideReplyButton={true} />
            ))}
          </div>
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
            <div className="flex flex-1 items-center rounded-full bg-gray-100 px-4">
              <input
                type="text"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder={`${parentComment.author.nickname}님에게 답글 남기기...`}
                className="w-full bg-transparent py-2 text-sm focus:outline-none"
              />
            </div>
            <Button
              size="icon"
              variant={newReply.trim() ? 'default' : 'ghost'}
              className={
                newReply.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'text-gray-400'
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
