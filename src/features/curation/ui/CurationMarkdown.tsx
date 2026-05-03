import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import { InArticleAdSlot } from "@/shared/adsense";
import { extractYouTubeVideoId } from "@/shared/lib/youtube/getYouTubeThumbnail";
import { Image } from "@/shared/ui/image";

import type { StaticRecipe } from "@/entities/recipe/model/types";

import { RecipeCardLink } from "./RecipeCardLink";
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
    h2: ["id", "className"],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: [
      ...(defaultSchema.protocols?.href ?? []),
      "recipe-data",
    ],
  },
};

const RECIPE_DATA_RE = /^recipe-data:(ingredients|steps|ad)(?:\/(\d+))?$/;
const INTERNAL_RECIPE_RE = /^\/recipes\/([^/?#]+)$/;

const isYouTubeUrl = (url: string) => extractYouTubeVideoId(url) !== null;

const createComponents = (recipes: Array<StaticRecipe | null>): Components => {
  let h2Counter = 0;
  return {
    a: ({ href, children }) => {
      if (!href) return <>{children}</>;

      const dataMatch = href.match(RECIPE_DATA_RE);
      if (dataMatch) {
        const [, kind, idxStr] = dataMatch;
        if (kind === "ad") return <InArticleAdSlot />;
        const recipe = recipes[Number(idxStr)] ?? null;
        if (kind === "ingredients") {
          return <RecipeIngredientsBox recipe={recipe} />;
        }
        return <RecipeStepsBox recipe={recipe} />;
      }

      if (isYouTubeUrl(href)) return <YouTubeEmbed url={href} />;

      const internalMatch = href.match(INTERNAL_RECIPE_RE);
      if (internalMatch) {
        const id = internalMatch[1];
        const recipe = recipes.find((r) => r?.id === id) ?? null;
        return (
          <RecipeCardLink href={href} recipe={recipe}>
            {children}
          </RecipeCardLink>
        );
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
    h2: ({ children }) => {
      const id = `recipe-${h2Counter++}`;
      return (
        <h2
          id={id}
          className="mt-12 mb-4 scroll-mt-24 text-2xl font-bold tracking-tight"
        >
          {children}
        </h2>
      );
    },
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
  };
};

type CurationMarkdownProps = {
  markdown: string;
  recipes: Array<StaticRecipe | null>;
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
