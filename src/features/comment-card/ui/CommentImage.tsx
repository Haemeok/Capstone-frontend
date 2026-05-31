type Props = {
  urls: string[];
};

const CommentImage = ({ urls }: Props) => {
  if (!urls.length) return null;
  const url = urls[0];

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-card bg-black">
      <img
        src={url}
        alt="댓글 이미지"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
};

export default CommentImage;
