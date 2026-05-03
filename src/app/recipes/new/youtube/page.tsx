import { BottomAnchorAdSlot } from "@/shared/adsense";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { getTrendingYoutubeRecipesOnServer } from "@/entities/recipe/model/api.server";

import { YoutubeClientSection } from "./components/YoutubeClientSection";
import { YoutubeFeatureCards } from "./components/YoutubeFeatureCards";
import { YoutubeImportHero } from "./components/YoutubeImportHero";

type YoutubeImportPageProps = {
  searchParams: Promise<{ url?: string }>;
};

const YoutubeImportPage = async ({ searchParams }: YoutubeImportPageProps) => {
  const [{ url }, trendingRecipes] = await Promise.all([
    searchParams,
    getTrendingYoutubeRecipesOnServer(),
  ]);

  return (
    <>
      <Container className="min-h-screen bg-white pb-20">
        <div className="pt-2">
          <PrevButton className="text-gray-600" />
        </div>
        <YoutubeImportHero />
        <YoutubeFeatureCards />
        <YoutubeClientSection
          trendingRecipes={trendingRecipes}
          initialUrl={url ?? ""}
        />
      </Container>
      <BottomAnchorAdSlot />
    </>
  );
};

export default YoutubeImportPage;
