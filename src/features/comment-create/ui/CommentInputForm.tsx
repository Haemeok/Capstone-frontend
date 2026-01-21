"use client";

import { useState } from "react";

import { ArrowUp } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";
import { Image } from "@/shared/ui/image/Image";
import { triggerHaptic } from "@/shared/lib/bridge";
import { User } from "@/entities/user";

type CommentInputFormProps = {
  author: User | undefined;
  user: User | null;
  commentId?: string;
  onSubmit: (comment: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

const CommentInputForm = ({
  author,
  user,
  commentId,
  onSubmit,
  onFocus,
  onBlur,
}: CommentInputFormProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [comment, setComment] = useState("");

  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    const scrollHeight = element.scrollHeight;
    const maxHeight = 1.5 * 16 * 4 + 8 * 2;
    element.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    adjustHeight(e.target);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    triggerHaptic("Light");
    onSubmit(comment);
    setComment("");
  };

  const placeholder = user
    ? `${author?.nickname}님에게 답글 남기기...`
    : "로그인 후 이용해주세요.";

  const ariaLabel = commentId
    ? `${author?.nickname}님에게 답글 작성`
    : "댓글 작성";

  return (
    <form
      className="flex items-end gap-2"
      onSubmit={handleSubmit}
      aria-label={ariaLabel}
    >
      {!isFocused && user && (
        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-white">
          <Image
            src={user.profileImage || ""}
            alt="내 프로필"
            className="object-cover"
          />
        </div>
      )}
      <textarea
        value={comment}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={!user}
        aria-label={ariaLabel}
        className={`flex-1 resize-none overflow-y-auto rounded-xl border-none bg-white px-3 py-2 text-sm leading-tight placeholder-gray-500 transition-all duration-300 ease-in-out focus:outline-none ${isFocused ? "ml-0" : ""} ${
          comment ? "" : "truncate"
        }`}
        rows={1}
        style={{ maxHeight: "calc(1.5em * 4 + 1rem)", height: "auto" }}
      />
      <Button
        variant="ghost"
        size="icon"
        className="text-olive hover:bg-olive/10 flex-shrink-0"
        disabled={!comment.trim()}
        aria-label="댓글 전송"
        type="submit"
      >
        <ArrowUp size={20} />
      </Button>
    </form>
  );
};

export default CommentInputForm;
