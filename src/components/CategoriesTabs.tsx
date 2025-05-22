import { categoriesItems } from '@/mock';
import React from 'react';
import CateGoryItem from './CateGoryItem';
import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';

type CategoriesTabsProps = {
  title: string;
};

const CategoriesTabs = ({ title }: CategoriesTabsProps) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          더보기
          <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>

      <div className="scrollbar-hide flex w-full gap-3 overflow-x-auto rounded-2xl">
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
