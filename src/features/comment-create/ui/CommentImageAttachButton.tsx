"use client";

import { useRef } from "react";

import { ImagePlus } from "lucide-react";

import { useCommentsDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import { useToastStore } from "@/shared/ui/toast/model/store";

import { validateCommentImage } from "../model/useCommentImageUpload";

type Props = {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
};

const CommentImageAttachButton = ({ onFileSelected, disabled }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToastStore();
  const t = useCommentsDict();

  const handleClick = () => {
    if (disabled) return;
    triggerHaptic("Light");
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const errorMsg = validateCommentImage(file);
    if (errorMsg) {
      addToast({ message: errorMsg, variant: "error", position: "bottom" });
      return;
    }
    onFileSelected(file);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label={t.imageAttachAria}
        className="text-ink-muted flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ImagePlus size={20} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
};

export default CommentImageAttachButton;
