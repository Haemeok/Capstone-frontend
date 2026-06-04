import { z } from "zod";

export const CurationBlogMetaSchema = z.object({
  title: z.object({
    main: z.string().min(20).max(110),
    sub: z.string().min(8).max(70),
  }),
  hashtags: z.array(z.string()).min(8).max(10),
  captionForCover: z.string().min(8).max(40),
});

export type CurationBlogMeta = z.infer<typeof CurationBlogMetaSchema>;

export type CurationBlogJsonLdItem = {
  "@type": "ListItem";
  position: number;
  url: string;
  name: string;
};

export type CurationBlogJsonLd = {
  "@context": "https://schema.org";
  "@type": "ItemList";
  name: string;
  description?: string;
  itemListElement: CurationBlogJsonLdItem[];
};

export type CurationBlogPost = CurationBlogMeta & {
  alts: Record<string, string>; // 서버 액션이 recipe.title 로 합성
  bodyMarkdown: string;
  curationSlug: string;
  curationUrl: string;
  jsonLd: CurationBlogJsonLd;
};
