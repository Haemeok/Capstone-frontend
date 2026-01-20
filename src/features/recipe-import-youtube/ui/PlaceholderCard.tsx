import { Plus } from "lucide-react";

export const PlaceholderCard = () => {
  return (
    <div className="border-olive-light bg-olive-light/10 group relative block h-full overflow-hidden rounded-2xl border-2 border-dashed">
      <div className="relative flex aspect-square items-center justify-center">
        <div className="text-olive-light text-center">
          <Plus className="mx-auto mb-2 h-8 w-8" />
          <p className="text-xs">레시피 대기중</p>
        </div>
      </div>
    </div>
  );
};
