import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BottomAnchorAdSlot } from "@/shared/adsense";
import PrevButton from "@/shared/ui/PrevButton";

import {
  getRecipeStatusPublicOnServer,
  getStaticrecipionServer,
} from "@/entities/recipe/model/api.server";

import {
  createCurationDetailJsonLd,
  fetchCurationArticle,
  generateCurationDetailMetadata,
  toSavedRecord,
} from "@/features/curation";
import { CurationArticle } from "@/features/curation/ui/CurationArticle";

const cachedGet = cache(fetchCurationArticle);

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const data = await cachedGet(slug);
  if (!data) {
    return {
      title: "큐레이션을 찾을 수 없습니다 | 레시피오",
      description: "요청하신 큐레이션 글을 찾을 수 없습니다.",
    };
  }
  return generateCurationDetailMetadata(data, data.recipeIds.length);
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const data = await cachedGet(slug);
  if (!data) notFound();

  // /v2/recipes/${id}는 favoriteCount를 안 채워주므로 status 엔드포인트에서 카운트만 빌려와 머지.
  const recipes = await Promise.all(
    data.recipeIds.map(async (id) => {
      const [recipe, status] = await Promise.all([
        getStaticrecipionServer(id).catch(() => null),
        getRecipeStatusPublicOnServer(id),
      ]);
      if (!recipe) return null;
      return {
        ...recipe,
        favoriteCount: status?.favoriteCount ?? recipe.favoriteCount,
      };
    })
  );

  const record = toSavedRecord(data, recipes);
  const jsonLd = createCurationDetailJsonLd(data);

  return (
    <>
      <div className="fixed top-3 left-3 z-40 md:hidden">
        <PrevButton className="rounded-full bg-white/90 p-2 shadow-sm backdrop-blur" />
      </div>
      <CurationArticle data={record} recipes={recipes} />
      <BottomAnchorAdSlot />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
};

export default Page;
