import { Container } from "@/shared/ui/Container";

import { getTrendingYoutubeRecipesOnServer } from "@/entities/recipe/model/api.server";

import { YoutubeClientSection } from "./components/YoutubeClientSection";
import { YoutubeFeatureCards } from "./components/YoutubeFeatureCards";
import { YoutubeImportHero } from "./components/YoutubeImportHero";

const YoutubeImportPage = async () => {
  const trendingRecipes = await getTrendingYoutubeRecipesOnServer();

  return (
    <Container className="min-h-screen bg-white pb-20">
      <YoutubeImportHero />
      <YoutubeFeatureCards />
      <YoutubeClientSection trendingRecipes={trendingRecipes} />
    </Container>
  );
};

export default YoutubeImportPage;
