import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Search, PlusCircle } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";

type IngredientsDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (index: number) => void;
  onRemoveAllIngredients: () => void;
};

const IngredientsDrawer = ({
  isOpen,
  onOpenChange,
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onRemoveAllIngredients,
}: IngredientsDrawerProps) => {
  const [newIngredient, setNewIngredient] = useState("");

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      onAddIngredient(newIngredient.trim());
      setNewIngredient("");
    }
  };

  const popularIngredients = [
    "양파",
    "마늘",
    "당근",
    "감자",
    "돼지고기",
    "소고기",
    "닭고기",
    "토마토",
    "파",
    "생강",
  ];

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b">
          <div className="flex justify-between items-center mb-4">
            <DrawerTitle className="text-xl font-bold text-green-800">
              요리할 재료 추가
            </DrawerTitle>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
            >
              <X size={18} />
            </Button>
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="재료 이름을 입력하세요"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddIngredient();
                }
              }}
            />
            <Button
              onClick={handleAddIngredient}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <Plus size={16} />
              추가
            </Button>
          </div>

          {/* 인기 재료 빠른 추가 */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              인기 재료
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularIngredients.map((ingredient) => (
                <button
                  key={ingredient}
                  className="px-3 py-1.5 bg-green-50 rounded-full text-sm text-green-800 hover:bg-green-100 transition-colors flex items-center gap-1"
                  onClick={() => onAddIngredient(ingredient)}
                >
                  <PlusCircle size={14} />
                  {ingredient}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">
                추가된 재료{" "}
                {ingredients.length > 0 && `(${ingredients.length})`}
              </h3>
              {ingredients.length > 0 && (
                <button
                  className="text-xs text-red-600 hover:text-red-800"
                  onClick={onRemoveAllIngredients}
                >
                  전체 삭제
                </button>
              )}
            </div>

            {ingredients.length > 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg max-h-[35vh] overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200"
                    >
                      <span className="text-gray-800">{ingredient}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto ml-1 text-gray-400 hover:text-red-500"
                        onClick={() => onRemoveIngredient(index)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-gray-400 mb-2">
                  <Plus size={24} strokeWidth={1.5} />
                </div>
                <p className="text-gray-500 text-center">
                  추가된 재료가 없습니다.
                </p>
                <p className="text-gray-400 text-sm text-center mt-1">
                  위 검색창에서 재료를 추가해보세요
                </p>
              </div>
            )}
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-5"
            onClick={() => onOpenChange(false)}
          >
            완료
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default IngredientsDrawer;
