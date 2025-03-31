import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Plus, Minus, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Ingredient {
  id: number;
  name: string;
  image: string;
  isSelected: boolean; // 추가 여부
}

// 검색 결과용 재료 목록 (API 연동 전 임시 데이터)
const mockSearchResults: Ingredient[] = [
  {
    id: 1,
    name: "가다랑어포",
    image: "/ingredients/bonito-flakes.jpg",
    isSelected: false,
  },
  {
    id: 2,
    name: "가래떡",
    image: "/ingredients/garaetteok.jpg",
    isSelected: false,
  },
  {
    id: 3,
    name: "가지",
    image: "/ingredients/eggplant.jpg",
    isSelected: false,
  },
  {
    id: 4,
    name: "갈치",
    image: "/ingredients/cutlassfish.jpg",
    isSelected: false,
  },
  {
    id: 5,
    name: "감",
    image: "/ingredients/persimmon.jpg",
    isSelected: false,
  },
  {
    id: 6,
    name: "감자",
    image: "/ingredients/potato.jpg",
    isSelected: false,
  },
  {
    id: 7,
    name: "감자전분",
    image: "/ingredients/potato-starch.jpg",
    isSelected: false,
  },
  {
    id: 8,
    name: "감골주스",
    image: "/ingredients/persimmon-juice.jpg",
    isSelected: false,
  },
];

const NewIngredientPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<Ingredient[]>(mockSearchResults);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // 검색 쿼리에 따라 결과 필터링
    if (query.trim() === "") {
      setSearchResults(mockSearchResults);
    } else {
      const filtered = mockSearchResults.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  // 재료 추가/삭제 토글
  const toggleIngredient = (id: number) => {
    setSearchResults(
      searchResults.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  // 선택 완료 후 이전 페이지로 이동
  const handleComplete = () => {
    // 여기서 선택된 재료를 저장하거나 API 호출
    const selectedIngredients = searchResults.filter((item) => item.isSelected);
    console.log("선택된 재료:", selectedIngredients);

    // 이전 페이지로 이동
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#f4f3e7] text-[#333333]">
      {/* 헤더 */}
      <div className="relative flex items-center justify-between p-4 border-b border-[#00473c]/10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-[#00473c]/10"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-xl absolute left-1/2 transform -translate-x-1/2">
          재료 목록
        </h1>
        <button
          onClick={handleComplete}
          className="text-[#00473c] bg-[#f4f3e7] border border-[#00473c] rounded-full px-4 py-2"
        >
          완료
        </button>
      </div>

      {/* 검색창 */}
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="냉장고 속 재료를 찾아보세요!"
            className="w-full bg-white py-3 pl-10 pr-4 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00473c]"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b border-[#00473c]/10">
        <button className="flex-1 py-3 font-bold text-[#00473c] border-b-2 border-[#00473c]">
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
          {searchResults.map((ingredient) => (
            <div
              key={ingredient.id}
              className="flex items-center bg-white p-3 rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden mr-3">
                {ingredient.image && (
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{ingredient.name}</p>
              </div>
              <Button
                variant="ghost"
                className={`rounded-full p-2 ${
                  ingredient.isSelected
                    ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                    : "text-[#00473c] hover:bg-[#00473c]/10"
                }`}
                onClick={() => toggleIngredient(ingredient.id)}
              >
                {ingredient.isSelected ? (
                  <Minus size={20} />
                ) : (
                  <Plus size={20} />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 완료 버튼 */}
      <div className="fixed bottom-6 right-0 left-0 flex justify-center">
        <Button
          onClick={handleComplete}
          className="bg-[#00473c] hover:bg-[#00473c]/90 text-white rounded-full px-8 py-3 shadow-lg"
        >
          <Check size={18} className="mr-2" />
          선택 완료
        </Button>
      </div>
    </div>
  );
};

export default NewIngredientPage;
