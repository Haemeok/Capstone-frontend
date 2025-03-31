import { categoriesItems } from "@/mock";
import React from "react";
import CateGoryItem from "./CateGoryItem";

const CategoriesTabs = () => {
  return (
    <div className="mt-8 w-full">
      <div className="flex justify-between items-center px-6 mb-4">
        <h2 className="text-2xl font-bold">카테고리</h2>
        <button className="text-sm text-gray-500 flex items-center">
          더보기
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="pl-6 flex gap-4 w-full overflow-x-auto pb-4 scrollbar-hide">
        {categoriesItems.map((category) => (
          <CateGoryItem
            key={category.id}
            name={category.name}
            image={category.image}
            count={category.count || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesTabs;
