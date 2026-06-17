import { Plus } from "lucide-react";

import { useYoutubeDict } from "@/shared/i18n";

export const PlaceholderCard = () => {
  const t = useYoutubeDict();
  return (
    <div className="border-olive-light group relative block h-full overflow-hidden rounded-2xl border-2 border-dashed">
      <div className="relative flex aspect-square items-center justify-center">
        <div className="text-olive-light text-center">
          <Plus className="mx-auto mb-2 h-8 w-8" />
          <p className="text-xs">{t.pendingPlaceholder}</p>
        </div>
      </div>
    </div>
  );
};
