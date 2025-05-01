import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { User } from '@/type/user';
import useCreateCommentMutation from '@/hooks/useCreateCommentMutation';
import { useParams } from 'react-router';
import { useUserStore } from '@/store/useUserStore';

type CommentInputProps = {
  author: User;
};

const CommentInput = ({ author }: CommentInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [comment, setComment] = useState('');
  const { recipeId } = useParams();
  const { createComment } = useCreateCommentMutation(Number(recipeId));
  const { user } = useUserStore();

  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    const scrollHeight = element.scrollHeight;
    const maxHeight = 1.5 * 16 * 4 + 8 * 2;
    element.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    adjustHeight(e.target);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !recipeId) return;
    if (!user?.id) return;

    // 뮤테이션 실행 함수 호출 시 변수 객체 전달
    createComment(
      {
        recipeId: Number(recipeId),
        comment,
        userId: user.id,
      },
      {
        onSuccess: () => {
          setComment('');
        },
      },
    );
  };

  return (
    <div className="fixed right-0 bottom-20 left-0 mx-4 rounded-2xl border-t bg-white px-2 py-1 shadow-md">
      <form
        className="mx-auto flex max-w-3xl items-end gap-2"
        onSubmit={handleSubmit}
      >
        {!isFocused && (
          <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-white">
            <img
              src="https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png"
              alt="내 프로필"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <textarea
          value={comment}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={`${author.nickname}님에게 답글 남기기...`}
          className={`flex-1 resize-none overflow-y-auto rounded-xl border-none bg-white px-3 py-2 text-sm leading-tight placeholder-gray-500 transition-all duration-300 ease-in-out focus:outline-none ${isFocused ? 'ml-0' : ''} ${
            comment ? '' : 'truncate'
          }`}
          rows={1}
          style={{ maxHeight: 'calc(1.5em * 4 + 1rem)', height: 'auto' }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="text-olive hover:bg-olive/10 flex-shrink-0"
          disabled={!comment.trim()}
        >
          <ArrowUp size={20} />
        </Button>
      </form>
    </div>
  );
};

export default CommentInput;
