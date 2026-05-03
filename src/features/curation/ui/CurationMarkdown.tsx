import ReactMarkdown from "react-markdown";

import { extractYouTubeVideoId } from "@/shared/lib/youtube/getYouTubeThumbnail";
import { Image } from "@/shared/ui/image";

import { RecipeButton } from "./RecipeButton";
import { YouTubeEmbed } from "./YouTubeEmbed";

const isYouTubeUrl = (url: string) => extractYouTubeVideoId(url) !== null;

const isInternalRecipeUrl = (url: string) => url.startsWith("/recipes/");

type CurationMarkdownProps = {
  markdown: string;
};

export const CurationMarkdown = ({ markdown }: CurationMarkdownProps) => (
  <div className="curation-prose">
    <ReactMarkdown
      components={{
        a: ({ href, children }) => {
          if (!href) return <>{children}</>;
          if (isYouTubeUrl(href)) return <YouTubeEmbed url={href} />;
          if (isInternalRecipeUrl(href))
            return <RecipeButton href={href}>{children}</RecipeButton>;
          return (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {children}
            </a>
          );
        },
        img: ({ src, alt }) => (
          <Image
            src={typeof src === "string" ? src : ""}
            alt={alt ?? ""}
            aspectRatio="4 / 3"
            fit="cover"
            wrapperClassName="my-8 w-full rounded-lg md:aspect-[16/10]"
          />
        ),
        h2: ({ children }) => (
          <h2 className="mt-12 mb-4 text-2xl font-bold tracking-tight">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-10 mb-3 text-xl font-bold tracking-tight">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="my-6 text-[17px] leading-[1.85] text-gray-800">
            {children}
          </p>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-8 border-l-4 border-gray-300 bg-gray-50 px-6 py-4 italic text-gray-700">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="my-6 list-disc space-y-2 pl-6 text-[17px] leading-[1.85] text-gray-800">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="my-6 list-decimal space-y-2 pl-6 text-[17px] leading-[1.85] text-gray-800">
            {children}
          </ol>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900">{children}</strong>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  </div>
);
