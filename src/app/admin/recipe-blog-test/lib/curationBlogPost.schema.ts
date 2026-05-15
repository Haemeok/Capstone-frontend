import { z } from "zod";

// LLM 메타 출력만 검증한다 (Stage 2). regex/url/format 키워드는 일부 OpenAI
// compatible 모델(특히 Upstage solar-pro3 JSON mode)에서 500 을 유발하므로 피한다.
// 형식 강제는 prompt 가 책임지고, 보강 검증은 우리 코드(curationBlogBody.ts)가 한다.
// LLM 메타 출력 — primitive 타입만. record/regex/url/format/enum 같은 키워드는
// Upstage solar-pro3 JSON mode 가 자주 500 으로 거부하므로 피한다 (큐레이션 title
// schema 와 같은 패턴). alts 는 서버 액션이 recipe.title 로 자동 합성한다.
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

// 미리보기·발행 큐가 보는 최종 모양.
// bodyMarkdown 은 `{{recipe:rN}}` 토큰을 포함한 원본 markdown.
// 워커/미리보기가 hydrateCurationBlogMarkdown 으로 토큰을 이미지로 풀어 본다.
export type CurationBlogPost = CurationBlogMeta & {
  alts: Record<string, string>;  // 서버 액션이 recipe.title 로 합성
  bodyMarkdown: string;
  curationSlug: string;
  curationUrl: string;
  jsonLd: CurationBlogJsonLd;
};
