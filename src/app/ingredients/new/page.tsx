"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import {
  INGREDIENT_PACKS,
  type IngredientPack,
} from "@/shared/config/constants/ingredientPacks";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { useAddIngredientBulkMutation } from "@/features/ingredient-add-fridge";
import IngredientSearchDrawer from "@/features/ingredient-add-fridge/ui/IngredientSearchDrawer";
import IngredientPackDetailDrawer from "@/features/ingredient-add-fridge/ui/IngredientPackDetailDrawer";

import IngredientPackCard from "@/widgets/IngredientPackCard/IngredientPackCard";

const NewIngredientsPage = () => {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<IngredientPack | null>(null);

  const { mutate: addIngredientBulk, isPending } =
    useAddIngredientBulkMutation();

  const handlePackAddAll = (ingredientIds: number[]) => {
    addIngredientBulk(ingredientIds);
  };

  const handlePackViewDetail = (pack: IngredientPack) => {
    setSelectedPack(pack);
    setIsDetailDrawerOpen(true);
  };

  const handlePackAddSelected = (ingredientIds: number[]) => {
    addIngredientBulk(ingredientIds);
  };

  return (
    <Container padding={false}>
      <div className=" bg-white pb-10">
        <header className="sticky top-0 z-sticky border-b border-gray-200 bg-white px-4 py-3 md:px-6 sticky-optimized">
          <div className="flex items-center gap-2">
            <PrevButton />
            <h1 className="text-xl font-bold">재료 추가</h1>
          </div>
        </header>

        <div className="px-4 py-4 md:px-6">
          <button
            type="button"
            onClick={() => setIsSearchDrawerOpen(true)}
            aria-label="재료 직접 추가하기"
            className="border-olive-light hover:bg-olive-light/10 flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed bg-[#f7f7f7] p-6 transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <div className="mb-2 rounded-full bg-white p-3 shadow-md">
                <Plus
                  size={24}
                  className="text-olive-light"
                  aria-hidden="true"
                />
              </div>
              <span className="text-olive-light text-lg font-bold">
                재료 직접 추가하기
              </span>
              <span className="mt-1 text-sm text-gray-500">
                검색으로 원하는 재료를 추가하세요
              </span>
            </div>
          </button>
        </div>

        <div className="px-4 md:px-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              추천 재료 패키지
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              한 번에 여러 재료를 냉장고에 추가해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INGREDIENT_PACKS.map((pack) => (
              <IngredientPackCard
                key={pack.name + pack.description}
                pack={pack}
                onViewDetail={handlePackViewDetail}
                onAddAll={handlePackAddAll}
                isLoading={isPending}
              />
            ))}
          </div>
        </div>
      </div>

      <IngredientSearchDrawer
        open={isSearchDrawerOpen}
        onOpenChange={setIsSearchDrawerOpen}
      />

      <IngredientPackDetailDrawer
        pack={selectedPack}
        open={isDetailDrawerOpen}
        onOpenChange={setIsDetailDrawerOpen}
        onAddSelected={handlePackAddSelected}
        isLoading={isPending}
      />
    </Container>
  );
};

export default NewIngredientsPage;
