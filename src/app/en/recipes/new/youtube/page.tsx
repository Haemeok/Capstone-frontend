import {
  BottomAnchorAdSlot,
  InArticleAdSlot,
  YoutubeAnchorAdSlot,
} from "@/shared/adsense";
import { getDictionary } from "@/shared/i18n";
import {
  buildYoutubeExtractorMetadata,
  createYoutubeExtractorStructuredData,
} from "@/shared/lib/metadata";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { getTrendingYoutubeRecipesOnServer } from "@/entities/recipe/model/api.server";

import { YoutubeClientSection } from "@/app/recipes/new/youtube/components/YoutubeClientSection";
import { YoutubeImportHero } from "@/app/recipes/new/youtube/components/YoutubeImportHero";

export const metadata = buildYoutubeExtractorMetadata("en");

type Props = { searchParams: Promise<{ url?: string }> };

const Page = async ({ searchParams }: Props) => {
  const [{ url }, trendingRecipes] = await Promise.all([
    searchParams,
    getTrendingYoutubeRecipesOnServer("en"),
  ]);
  const dict = getDictionary("en");
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
        />
      </Container>
      <BottomAnchorAdSlot />
    </>
  );
};

export default Page;
