import {
  BottomAnchorAdSlot,
  InArticleAdSlot,
  YoutubeAnchorAdSlot,
} from "@/shared/adsense";
import { getDictionary } from "@/shared/i18n";
import {
  createYoutubeExtractorStructuredData,
  youtubeExtractorMetadata,
} from "@/shared/lib/metadata";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { getTrendingYoutubeRecipesOnServer } from "@/entities/recipe/model/api.server";

import { YoutubeClientSection } from "./components/YoutubeClientSection";
import { YoutubeImportHero } from "./components/YoutubeImportHero";

export const metadata = youtubeExtractorMetadata;

type YoutubeImportPageProps = {
  searchParams: Promise<{ url?: string }>;
};

const YoutubeImportPage = async ({ searchParams }: YoutubeImportPageProps) => {
  const [{ url }, trendingRecipes] = await Promise.all([
    searchParams,
    getTrendingYoutubeRecipesOnServer(),
  ]);

  const dict = getDictionary("ko");
  const jsonLd = createYoutubeExtractorStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Container className="min-h-screen bg-white pb-20">
        <div className="pt-2">
          <PrevButton className="text-ink-sub" />
        </div>
        <YoutubeAnchorAdSlot />
        <YoutubeImportHero dict={dict.youtube} />
        <InArticleAdSlot className="my-4" />
        <YoutubeClientSection
          trendingRecipes={trendingRecipes}
          initialUrl={url ?? ""}
          dict={dict.youtube}
          locale="ko"
        />
      </Container>
      <BottomAnchorAdSlot />
    </>
  );
};

export default YoutubeImportPage;
