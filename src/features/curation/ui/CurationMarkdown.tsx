import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import { InArticleAdSlot } from "@/shared/adsense";
import { extractYouTubeVideoId } from "@/shared/lib/youtube/getYouTubeThumbnail";
import { Image } from "@/shared/ui/image";

import type { Recipe } from "@/entities/recipe/model/types";

import { RecipeButton } from "./RecipeButton";
import { RecipeIngredientsBox } from "./RecipeIngredientsBox";
import { RecipeStepsBox } from "./RecipeStepsBox";
import { YouTubeEmbed } from "./YouTubeEmbed";

const ALLOWED_TAGS = [
  "p",
  "strong",
  "em",
  "br",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h2",
  "h3",
  "img",
  "a",
  "span",
  "iframe",
  "aside",
  "div",
];

const SCHEMA = {
  ...defaultSchema,
  tagNames: ALLOWED_TAGS,
  attributes: {
    ...defaultSchema.attributes,
    iframe: ["src", "title", "loading", "allow", "allowfullscreen", "className"],
    a: ["href", "target", "rel", "className"],
    img: ["src", "alt", "className"],
    aside: ["className"],
    div: ["className"],
  },
};

const RECIPE_DATA_RE = /^recipe-data:(ingredients|steps)\/(\d+)$/;
const INTERNAL_RECIPE_RE = /^\/recipes\/([^/?#]+)$/;

const isYouTubeUrl = (url: string) => extractYouTubeVideoId(url) !== null;

const createComponents = (recipes: Array<Recipe | null>): Components => ({
  a: ({ href, children }) => {
    if (!href) return <>{children}</>;

    if (href === "in-article-ad") return <InArticleAdSlot />;

    const dataMatch = href.match(RECIPE_DATA_RE);
    if (dataMatch) {
      const [, kind, idxStr] = dataMatch;
      const recipe = recipes[Number(idxStr)] ?? null;
      if (kind === "ingredients") {
        return <RecipeIngredientsBox recipe={recipe} />;
      }
      return <RecipeStepsBox recipe={recipe} />;
    }

    if (isYouTubeUrl(href)) return <YouTubeEmbed url={href} />;

    if (INTERNAL_RECIPE_RE.test(href)) {
      return <RecipeButton href={href}>{children}</RecipeButton>;
    }

    return (
      <a href={href} target="_blank" rel="noreferrer" className="underline">
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
    <h2 className="mt-12 mb-4 text-2xl font-bold tracking-tight">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-10 mb-3 text-xl font-bold tracking-tight">{children}</h3>
  ),
  p: ({ children }) => <div className="my-6">{children}</div>,
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-4 border-gray-300 bg-gray-50 px-6 py-4 italic text-gray-700">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="my-6 list-disc space-y-2 pl-6">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-6 list-decimal space-y-2 pl-6">{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
});

type CurationMarkdownProps = {
  markdown: string;
  recipes: Array<Recipe | null>;
};

export const CurationMarkdown = ({
  markdown,
  recipes,
}: CurationMarkdownProps) => {
  const components = createComponents(recipes);
  return (
    <div className="curation-prose text-[17px] leading-[1.85] text-gray-800">
      <ReactMarkdown
        rehypePlugins={[[rehypeSanitize, SCHEMA]]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
