import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { ingredientItems } from '@/mock';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import IngredientItem from '@/components/ingredient/IngredientItem';
import { cn } from '@/lib/utils';

// 스크롤 테스트를 위한 전체 페이지 컴포넌트

const ingreCategory = ['야채', '가공/유제품', '고기', '곡물', '과일', '면'];
const Page = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const currentItems = ingredientItems.filter(
    (item) => item.category === ingreCategory[currentTab],
  );
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const navigate = useNavigate();
  console.log(currentItems, currentTab, ingreCategory[currentTab]);
  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold">도원진님의 냉장고</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsDeleteMode(!isDeleteMode)}
          >
            {isDeleteMode ? '완료' : '재료 삭제'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/ingredients/new')}
          >
            재료 추가
          </Button>
        </div>
      </div>
      <div className="flex items-center">
        {ingreCategory.map((category, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => setCurrentTab(index)}
            className={cn(
              currentTab === index ? 'bg-green-300 hover:bg-green-300' : '',
            )}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="grid w-full grid-cols-2 gap-4 p-4">
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

export default Page;
