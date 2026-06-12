import type { Metadata } from "next";

import {
  buildLocalizedIngredientMetadata,
  LocalizedIngredientPage,
} from "@/widgets/IngredientDetailPage/server/renderLocalizedIngredientPage";

type Props = { params: Promise<{ ingredientId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ingredientId } = await params;
  return buildLocalizedIngredientMetadata({ ingredientId, locale: "ja" });
}

export default async function JaIngredientDetailPage({ params }: Props) {
  const { ingredientId } = await params;
  return <LocalizedIngredientPage ingredientId={ingredientId} locale="ja" />;
}
