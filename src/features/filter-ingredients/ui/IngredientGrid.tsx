import { IngredientGridItem } from "./IngredientGridItem";

type Ingredient = {
  id: string;
  name: string;
  imageUrl?: string | null;
};

type Props = {
  items: Ingredient[];
  isSelected: (id: string) => boolean;
  onToggle: (id: string, name: string) => void;
  loadMoreRef: (node?: Element | null) => void;
  isPending: boolean;
};

export const IngredientGrid = ({
  items,
  isSelected,
  onToggle,
  loadMoreRef,
  isPending,
}: Props) => {
  if (isPending) {
    return (
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square rounded-xl bg-gray-100" />
            <div className="mt-2 h-3 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-gray-500">검색 결과가 없습니다</p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3 pb-4 sm:grid-cols-5 md:grid-cols-6">
      {items.map((item) => (
        <IngredientGridItem
          key={item.id}
          id={item.id}
          name={item.name}
          imageUrl={item.imageUrl}
          isSelected={isSelected(item.id)}
          onToggle={onToggle}
        />
      ))}
      <div ref={loadMoreRef} className="col-span-full h-4" />
    </div>
  );
};
