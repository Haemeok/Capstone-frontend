import { z } from "zod";

export const CurationBlogPostSchema = z.object({
  title: z.object({
    main: z
      .string()
      .min(20)
      .max(110)
      .describe(
        "메인 제목 — 큐레이션 주제 + 핵심 키워드 4~5개를 띄어쓰기로 묶는다. 60~90자 권장. 광고체·자랑어 금지."
      ),
    sub: z.string().min(8).max(70).describe("부제. 큐레이션 핵심을 한 줄로."),
  }),

  lead: z
    .string()
    .min(280)
    .max(520)
    .describe(
      "리드 단락. 일상 장면 진입으로 시작 — 큐레이션 주제가 한국 가정 식탁에서 등장하는 자리·계절·맥락 중 하나를 구체적으로. 1인칭 미량 허용. 평균치 추상 동사구 금지."
    ),

  sections: z
    .array(
      z.object({
        recipeId: z.string().min(1),
        recipeTitle: z.string().min(1),
        blurb: z
          .string()
          .min(80)
          .max(280)
          .describe(
            "이 레시피를 왜 골랐는지 + 한국 가정에서의 자리·짝꿍·메뉴 변주 1개. 평균치 묘사 금지."
          ),
        imageSlot: z
          .string()
          .regex(/^recipe-/, "imageSlot은 'recipe-' 접두사여야 한다")
          .describe("이미지 슬롯 키. 형식: recipe-{recipeId}"),
        recipeUrl: z
          .string()
          .url()
          .describe("레시피 상세 URL. 형식: https://recipio.kr/recipes/{recipeId}"),
      })
    )
    .min(3)
    .max(10),

  closingNote: z
    .string()
    .min(220)
    .max(480)
    .describe(
      "닫는 단락. 큐레이션 효용 정리 + 핵심 포인트 2~3개 한 줄로 압축 + 'recipio.kr/curation/{slug}' 페이지로 자연 권유 한 줄. 명령형·광고체 금지."
    ),

  hashtags: z.array(z.string()).min(8).max(10),

  alts: z
    .record(z.string(), z.string())
    .describe("이미지 슬롯별 alt 텍스트. 키는 imageSlot (cover 또는 recipe-{id})."),

  captionForCover: z
    .string()
    .min(8)
    .max(40)
    .describe("커버 사진 캡션. 14~22자 명명형. 예: '환절기 한 그릇, 세 가지.'"),
});

// LLM 이 직접 출력하는 narrative. cover 슬롯은 LLM 출력이 아니라 서버 액션이 합성한다.
export type CurationBlogPostNarrative = z.infer<typeof CurationBlogPostSchema>;

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

// 외부(미리보기·발행 큐)가 보는 최종 모양 — narrative + 후처리 합성 결과.
export type CurationBlogPost = CurationBlogPostNarrative & {
  curationSlug: string;
  curationUrl: string;        // https://recipio.kr/curation/{slug}
  jsonLd: CurationBlogJsonLd;
};
