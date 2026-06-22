"use client";

import { useEffect, useMemo } from "react";

import { X } from "lucide-react";

import { useCommentsDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

type Props = {
  file: File;
  onRemove: () => void;
};

const CommentImagePreview = ({ file, onRemove }: Props) => {
  const t = useCommentsDict();
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleRemove = () => {
    triggerHaptic("Light");
    onRemove();
  };

  return (
    <div className="relative inline-block">
      <img
        src={previewUrl}
        alt={t.imagePreviewAlt}
        className="h-16 w-16 rounded-lg object-cover"
      />
      <button
        type="button"
        onClick={handleRemove}
        aria-label={t.imageRemoveAria}
        className="absolute -top-1 -right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-gray-800 text-white shadow"
      >
        <X size={12} />
      </button>
    </div>
  );
};

export default CommentImagePreview;
