import { getRecipeItems } from '@/api/recipe';
import { DetailedRecipesApiResponse } from '@/api/recipe';
import { InfiniteData } from '@tanstack/react-query';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ChevronDown, Search } from 'lucide-react';
import React, { useState } from 'react';
import {
  BASE_DRAWER_CONFIGS,
  DISH_TYPE_CODES,
  SORT_TYPE_CODES,
  TAG_CODES,
} from '@/constants/recipe';
import { DrawerType } from '@/constants/recipe';
import CategoryDrawer from './CategoryDrawer';
import RecipeGrid from '@/components/recipeGrid/RecipeGrid';
import FilterChip from '@/components/Button/FilterChip';
import useSearch from '@/hooks/useSearch';

type DrawerConfig = {
  type: 'dishType' | 'sort' | 'tags';
  header: string;
  description?: string;
  isMultiple: boolean;
  availableValues: string[];
  initialValue: string | string[];
  setValue: (value: string | string[]) => void;
};

const SearchPage = () => {
  const [sort, setSort] = useState<string>('최신순');
  const [dishType, setDishType] = useState<string>('전체');
  const [tagNames, setTagNames] = useState<string[]>([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerConfig, setDrawerConfig] = useState<DrawerConfig | null>(null);

  const {
    searchQuery,
    inputValue,
    handleSearchSubmit,
    handleInputChange,
    setInputValue,
  } = useSearch();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    ref,
  } = useInfiniteScroll<
    DetailedRecipesApiResponse,
    Error,
    InfiniteData<DetailedRecipesApiResponse>,
    [string, string, string, string[], string],
    number
  >({
    queryKey: ['recipes', dishType, sort, tagNames, searchQuery],
    queryFn: ({ pageParam }) =>
      getRecipeItems({
        sort: SORT_TYPE_CODES[sort as keyof typeof SORT_TYPE_CODES],
        dishType: DISH_TYPE_CODES[dishType as keyof typeof DISH_TYPE_CODES],
        tagNames: tagNames.map(
          (tag) => TAG_CODES[tag as keyof typeof TAG_CODES],
        ),
        q: searchQuery,
        pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? null : lastPage.number + 1,
    initialPageParam: 0,
  });

  const recipes = data?.pages.flatMap((page) => page.content) ?? [];

  const dynamicStateAccessors = {
    dishType: {
      state: dishType,
      setState: (value: string) => {
        setDishType(value);
      },
    },
    sort: {
      state: sort,
      setState: (value: string) => {
        setSort(value);
      },
    },
    tags: {
      state: tagNames,
      setState: (value: string[]) => {
        setTagNames(value);
      },
    },
  };

  const openDrawer = (type: DrawerType) => {
    const baseConfig = BASE_DRAWER_CONFIGS[type];

    const dynamicState = dynamicStateAccessors[type];

    if (!baseConfig || !dynamicState) {
      console.error(`Invalid drawer type or configuration missing: ${type}`);
      return;
    }

    const finalConfig: DrawerConfig = {
      ...baseConfig,
      type,
      initialValue: dynamicState.state,
      setValue: (value: string | string[]) => {
        dynamicState.setState(value as any);
      },
    };

    setDrawerConfig(finalConfig);
    setIsDrawerOpen(true);
  };

  const noResults = recipes.length === 0 && !isFetching;
  const noResultsMessage =
    searchQuery && recipes.length === 0
      ? `"${searchQuery}"에 해당하는 레시피가 없습니다.`
      : `"${dishType}"에 해당하는 레시피가 없습니다.`;

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 pb-0">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="search"
            placeholder="레시피를 검색하세요"
            className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-4 focus:outline-none"
            value={inputValue}
            onChange={handleInputChange}
          />

          <button
            type="submit"
            className="absolute top-1/2 right-3 -translate-y-1/2"
          >
            <Search size={18} className="text-gray-400" />
          </button>
        </form>
        <div className="flex gap-1 p-2">
          <FilterChip
            header={dishType}
            onClick={() => openDrawer('dishType')}
            isDirty={dishType !== '전체'}
          />
          <FilterChip
            header={sort}
            onClick={() => openDrawer('sort')}
            isDirty={sort !== '최신순'}
          />
          <FilterChip
            header={tagNames.length > 0 ? tagNames.join(', ') : '태그'}
            onClick={() => openDrawer('tags')}
            isDirty={tagNames.length > 0}
          />
        </div>
      </div>
      <RecipeGrid
        recipes={recipes}
        hasNextPage={hasNextPage}
        ref={ref}
        noResults={noResults}
        noResultsMessage={noResultsMessage}
        lastPageMessage={'모든 레시피를 불러왔습니다.'}
      />
      <CategoryDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        isMultiple={drawerConfig?.isMultiple ?? false}
        setValue={drawerConfig?.setValue ?? (() => {})}
        initialValue={drawerConfig?.initialValue ?? ''}
        availableValues={drawerConfig?.availableValues ?? []}
        header={drawerConfig?.header ?? ''}
        description={drawerConfig?.description ?? ''}
      />
    </div>
  );
};

export default SearchPage;
