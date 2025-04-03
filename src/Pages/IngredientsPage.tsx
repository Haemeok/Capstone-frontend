import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { ingredientItems } from "@/mock";
import IngredientItem from "@/components/ingredient/IngredientItem";
import { useNavigate } from "react-router";
const IngredientsPage = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold">도원진님의 냉장고</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsDeleteMode(!isDeleteMode)}
          >
            {isDeleteMode ? "완료" : "재료 삭제"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/ingredients/new")}
          >
            재료 추가
          </Button>
        </div>
      </div>
      <div className="w-full p-4 grid grid-cols-2 gap-4">
        {ingredientItems.map((ingredient, index) => (
          <IngredientItem
            key={ingredient.id}
            ingredient={ingredient}
            isDeleteMode={isDeleteMode}
          />
        ))}
      </div>
    </div>
  );
};

export default IngredientsPage;
