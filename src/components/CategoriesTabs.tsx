import { categoriesItems } from "@/mock";
import React from "react";
import CateGoryItem from "./CateGoryItem";
import { useNavigate } from "react-router";
const CategoriesTabs = () => {
  const navigate = useNavigate();
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
          <div
            key={category.id}
            className="rounded-2xl overflow-hidden bg-white shadow-md flex-shrink-0"
            onClick={() => {
              navigate(`/recipes/${category.id}`);
            }}
          >
            <div className="relative w-48 h-48">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute flex items-end h-1/3 bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-sm font-semibold">
                  {category.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTabs;
