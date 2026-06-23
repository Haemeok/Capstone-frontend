"use client";

import { useInViewOnce } from "@/shared/hooks/useInViewOnce";
import type { Locale } from "@/shared/i18n";

import { StaticDetailedRecipeGridItem } from "@/entities/recipe";

import { RecipeSlideLoading } from "./RecipeSlide";
import RecipeSlideSection from "./RecipeSlideSection";
import { shouldHideRecipeSlide } from "./recipeSlideVisibility";

export type SlideData = {
  title: string;
  items: StaticDetailedRecipeGridItem[];
  isLoading: boolean;
  error: Error | null;
  requiresMeta?: boolean;
  metaName?: string | null;
  disabled?: boolean;
};

type BaseSlideProps = { locale?: Locale };

type UseSlideData<P extends BaseSlideProps> = (args: {
  inView: boolean;
  props: P;
}) => SlideData;

export const createRecipeSlide = <P extends BaseSlideProps>(
  useSlideData: UseSlideData<P>
) => {
  const Slide = (props: P) => {
    const { ref, inView } = useInViewOnce({ rootMargin: "400px" });
    const { title, items, isLoading, error, requiresMeta, metaName, disabled } =
      useSlideData({ inView, props });

    if (disabled) return null;

    if (!inView) {
      return <div ref={ref} className="h-[260px] w-full" aria-hidden />;
    }

    if (isLoading) {
      return (
        <div ref={ref} className="h-[260px] w-full overflow-hidden pt-6">
          <RecipeSlideLoading />
        </div>
      );
    }

    if (
      shouldHideRecipeSlide({
        isLoading,
        hasError: !!error,
        recipeCount: items.length,
        requiresMeta,
        metaName,
      })
    ) {
      return null;
    }

    return (
      <div ref={ref} className="w-full">
        <RecipeSlideSection
          title={title}
          recipes={items}
          isLoading={false}
          error={error}
          locale={props.locale}
        />
      </div>
    );
  };
  return Slide;
};
