"use client";

const getYouTubeId = (url: string): string | null => {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/,
  );
  return m ? m[1] : null;
};

export const YouTubeEmbed = ({ url }: { url: string }) => {
  const id = getYouTubeId(url);
  if (!id) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="underline">
        {url}
      </a>
    );
  }
  return (
    <span className="my-8 block aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube"
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </span>
  );
};
