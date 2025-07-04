import { useRouter } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";

import { useRecipeItemsQuery } from "./hooks";

type RecipeSlideProps = {
  title: string;
  queryKey: string;
  isAiGenerated?: boolean;
  tagNames?: string[];
  to?: string;
};

const RecipeSlide = ({
  title,
  queryKey,
  isAiGenerated,
  tagNames,
  to,
}: RecipeSlideProps) => {
  const router = useRouter();
  const { data: recipes, isLoading } = useRecipeItemsQuery({
    key: queryKey,
    isAiGenerated,
    tagNames,
  });

  const handleMoreClick = () => {
    if (to) {
      router.push(to);
    }
  };

  return (
    <div className="mt-2 w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <button
          onClick={handleMoreClick}
          disabled={!to}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          더보기
          <ChevronRight size={16} />
        </button>
      </div>
      <div
        className="scrollbar-hide flex w-full gap-3 overflow-x-auto"
        style={{ overflowY: "visible" }}
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex-shrink-0">
                <Skeleton className="h-[125px] w-[200px] rounded-xl" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))
          : recipes.map((item) => (
              <DetailedRecipeGridItem
                key={item.id}
                recipe={item}
                height={200}
              />
            ))}
      </div>
    </div>
  );
};

export default RecipeSlide;
