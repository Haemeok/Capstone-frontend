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
};

// 슬롯 표식은 `#`-prefixed fragment URL로 박는다. 커스텀 URL 스킴(`recipe-data:`)
// 은 rehype-sanitize의 attributes.a 오버라이드 + 커스텀 protocols 조합에서
// 빈 문자열로 strip돼 박스 렌더가 안 됐던 사례가 있어서, fragment로 우회.
const RECIPE_DATA_RE = /^#cur:(ingredients|steps|ad)(?:\/(\d+))?$/;
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
        if (kind === "ad") {
          const adIdx = idxStr ? Number(idxStr) : 0;
          return <InArticleAdSlot index={adIdx} />;
        }
        const recipe = recipes[Number(idxStr)] ?? null;
        if (kind === "ingredients") {
          return <RecipeIngredientsBox recipe={recipe} />;
        }
        return <RecipeStepsBox recipe={recipe} />;
      }

      if (href.startsWith("#recipe-")) {
        return (
          <a
            href={href}
            className="inline-flex items-center gap-1 rounded-full bg-green-900/10 px-3 py-1 text-xs font-semibold text-green-900 no-underline hover:bg-green-900/15"
          >
            {children}
          </a>
        );
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
    blockquote: ({ children }) => <div className="my-6">{children}</div>,
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
