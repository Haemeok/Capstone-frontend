import { TAG_ITEMS } from "@/shared/config/constants/recipe";

import CateGoryItem from "./CateGoryItem";

type CategoryTabsProps = {
  title: string;
};

const CategoryTabs = ({ title }: CategoryTabsProps) => {
  return (
    <div className="mt-8 w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
      </div>

      <div className="scrollbar-hide flex w-full gap-3 overflow-x-auto rounded-2xl">
        {TAG_ITEMS.map((item) => (
          <CateGoryItem
            key={item.id}
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
