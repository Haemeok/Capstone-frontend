"use client";

import { useState } from "react";

import { ArrowUp } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";

import { User } from "@/entities/user";

import CommentImageAttachButton from "./CommentImageAttachButton";
import CommentImagePreview from "./CommentImagePreview";

type CommentInputFormProps = {
  author: User | undefined;
  user: User | null;
  commentId?: string;
  enableImage?: boolean;
  onSubmit: (comment: string, file: File | null) => void;
  isSubmitting?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

const CommentInputForm = ({
  author,
  user,
  commentId,
  enableImage = false,
  onSubmit,
  isSubmitting = false,
  onFocus,
  onBlur,
}: CommentInputFormProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
    if (!comment.trim() && !file) return;
    triggerHaptic("Light");
    onSubmit(comment, file);
    setComment("");
    setFile(null);
  };

  const placeholder = user
    ? commentId
      ? `${author?.nickname}님에게 답글 남기기...`
      : "댓글 남기기..."
    : "로그인 후 이용해주세요.";

  const ariaLabel = commentId
    ? `${author?.nickname}님에게 답글 작성`
    : "댓글 작성";

  const canSubmit = (comment.trim().length > 0 || file !== null) && !isSubmitting;

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit}
      aria-label={ariaLabel}
    >
      {enableImage && file && (
        <div className="pl-10">
          <CommentImagePreview file={file} onRemove={() => setFile(null)} />
        </div>
      )}

      <div className="flex items-end gap-2">
        {enableImage ? (
          <CommentImageAttachButton
            onFileSelected={setFile}
            disabled={isSubmitting || !user}
          />
        ) : (
          !isFocused &&
          user && (
            <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-white">
              <Image
                src={user.profileImage || ""}
                alt="내 프로필"
                className="object-cover"
              />
            </div>
          )
        )}
        <textarea
          value={comment}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={!user || isSubmitting}
          aria-label={ariaLabel}
          className={`flex-1 resize-none overflow-y-auto rounded-xl border border-gray-200 bg-white px-3 py-2 text-base leading-tight placeholder-gray-500 transition-all duration-300 ease-in-out focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light ${
            comment ? "" : "truncate"
          }`}
          rows={1}
          style={{ maxHeight: "calc(1.5em * 4 + 1rem)", height: "auto" }}
        />
        <Button
          variant="ghost"
          className={`h-10 w-14 flex-shrink-0 rounded-full transition-all ${
            canSubmit
              ? "bg-olive-light text-white hover:bg-olive-dark"
              : "text-gray-300"
          }`}
          disabled={!canSubmit}
          aria-label="댓글 전송"
          type="submit"
          onMouseDown={(e) => e.preventDefault()}
        >
          <ArrowUp size={20} />
        </Button>
      </div>
    </form>
  );
};

export default CommentInputForm;
