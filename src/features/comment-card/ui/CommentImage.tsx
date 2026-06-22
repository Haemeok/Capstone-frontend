"use client";

import { useCommentsDict } from "@/shared/i18n";

type Props = {
  urls: string[];
};

const CommentImage = ({ urls }: Props) => {
  const t = useCommentsDict();
  if (!urls.length) return null;
  const url = urls[0];

  return (
    <div className="rounded-card relative aspect-square w-full overflow-hidden bg-black">
      <img
        src={url}
        alt={t.imageAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
};

export default CommentImage;
