import {
  BaseRecipeGridItem,
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
  MyRecipeListItem,
} from "@/entities/recipe/model/types";

export type RecipeGridProps = {
  recipes:
    | BaseRecipeGridItem[]
    | DetailedRecipeGridItemType[]
    | MyRecipeListItem[];
  isSimple?: boolean;
  hasNextPage?: boolean;
  isFetching?: boolean;
  isPending?: boolean;
  observerRef?: (node: Element | null) => void;
  noResults?: boolean;
  noResultsMessage?: string;
  lastPageMessage?: string;
  error?: Error | null;
  queryKeyString?: string;
  prefetch?: boolean;
  showAIRecipeCTA?: boolean;
  useLCP?: boolean;
  queryKeyToInvalidate?: unknown[];
  onResetFilters?: () => void;
  nextPageHref?: string;
  showInFeedAds?: boolean;
  onItemMoreClick?: (id: string) => void;
};
