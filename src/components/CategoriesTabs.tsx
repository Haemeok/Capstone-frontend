import { categoriesItems } from "@/mock";
import React from "react";
import CateGoryItem from "./CateGoryItem";
import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";

type CategoriesTabsProps = {
  title: string;
};

const CategoriesTabs = ({ title }: CategoriesTabsProps) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 w-full">
      <div className="flex justify-between items-center px-6 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <button className="text-sm text-gray-500 flex items-center hover:text-gray-700">
          더보기
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="pl-6 flex gap-3 w-full overflow-x-auto pb-4 scrollbar-hide">
        {categoriesItems.map((item) => (
          <CateGoryItem
            key={item.id}
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl}
            onClick={() => {
              // TODO: 실제 라우팅 로직 구현 (예: /recipes/{item.id})
              console.log(`Navigating to item: ${item.id}`);
              // navigate(`/recipes/${category.id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesTabs;
