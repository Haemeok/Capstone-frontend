import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Ingredient {
  id: number;
  name: string;
  image: string;
  isSelected: boolean; // 선택 상태
  quantity?: string; // 수량
  expiryDate?: string; // 유통기한
}

const mockIngredients: Ingredient[] = [
  {
    id: 1,
    name: '감',
    image: '/ingredients/persimmon.jpg',
    isSelected: false,
  },
  {
    id: 2,
    name: '계란',
    image: '/ingredients/egg.jpg',
    isSelected: true,
  },
  {
    id: 3,
    name: '가지',
    image: '/ingredients/eggplant.jpg',
    isSelected: false,
  },
  {
    id: 4,
    name: '갈치',
    image: '/ingredients/cutlassfish.jpg',
    isSelected: false,
  },
  {
    id: 5,
    name: '감자',
    image: '/ingredients/potato.jpg',
    isSelected: true,
  },
  {
    id: 6,
    name: '감자전분',
    image: '/ingredients/potato-starch.jpg',
    isSelected: false,
  },
  {
    id: 7,
    name: '감골주스',
    image: '/ingredients/persimmon-juice.jpg',
    isSelected: true,
  },
];

const NewIngredientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<Ingredient[]>(mockIngredients);
  const [searchQuery, setSearchQuery] = useState('');
  const userName = '황민현'; // 나중에 실제 사용자 이름으로 변경

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleIngredientClick = (id: number) => {
    setIngredients(
      ingredients.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item,
      ),
    );
  };

  const handleAddIngredient = () => {
    navigate('/ingredients/new');
  };

  return (
    <div className="min-h-screen text-[#333333]">
      {/* 검색창 */}
      <div className="p-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="냉장고 속 재료를 찾아보세요!"
            className="w-full rounded-full bg-white py-2 pr-4 pl-10 shadow-sm focus:ring-2 focus:ring-[#00473c] focus:outline-none"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b border-[#00473c]/10">
        <button className="flex-1 border-b-2 border-[#5cc570] py-3 font-bold text-[#5cc570]">
          전체
        </button>
        <button className="flex-1 py-3 text-gray-500">가공/유제품</button>
        <button className="flex-1 py-3 text-gray-500">고기</button>
        <button className="flex-1 py-3 text-gray-500">곡물</button>
        <button className="flex-1 py-3 text-gray-500">과일</button>
      </div>

      {/* 재료 목록 */}
      <div className="p-4">
        <div className="space-y-3">
          {filteredIngredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className="flex items-center rounded-lg bg-white p-3 shadow-sm"
              onClick={() => handleIngredientClick(ingredient.id)}
            >
              <div className="mr-3 h-12 w-12 overflow-hidden rounded-lg bg-gray-200">
                {ingredient.image && (
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{ingredient.name}</p>
              </div>
              <Button
                variant={ingredient.isSelected ? 'default' : 'outline'}
                className={`rounded-full px-4 ${
                  ingredient.isSelected
                    ? 'border-0 bg-[#5cc570] text-white hover:bg-[#5cc570]/90'
                    : 'border border-gray-300 text-gray-400'
                }`}
              >
                {ingredient.isSelected ? '추가' : '설정'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 직접 추가 버튼 */}
      <div className="fixed right-6 bottom-6">
        <Button
          onClick={handleAddIngredient}
          className="rounded-lg bg-[#333333] px-4 py-2 text-white shadow-lg hover:bg-[#222222]"
        >
          <Plus size={18} className="mr-1" />
          직접 추가
        </Button>
      </div>
    </div>
  );
};

export default NewIngredientsPage;
