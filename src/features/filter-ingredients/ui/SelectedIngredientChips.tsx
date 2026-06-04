import { X } from "lucide-react";

type SelectedIngredient = {
  id: string;
  name: string;
};

type Props = {
  items: SelectedIngredient[];
  onRemove: (id: string) => void;
};

export const SelectedIngredientChips = ({ items, onRemove }: Props) => {
  if (items.length === 0) return null;

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto">
      {items.map(({ id, name }) => (
        <div
          key={id}
          className="bg-olive-light/10 text-olive-light flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium"
        >
          <span>{name}</span>
          <button
            onClick={() => onRemove(id)}
            className="hover:bg-olive-light/20 cursor-pointer rounded-full p-0.5"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      ))}
    </div>
  );
};
