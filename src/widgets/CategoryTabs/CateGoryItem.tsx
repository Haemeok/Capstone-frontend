"use client";

import type { TagCode } from "@/shared/config/constants/recipe";
import { LocalizedLink } from "@/shared/i18n";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

type CateGoryItemProps = {
  code: TagCode;
  imageUrl: string;
  className?: string;
  isLcpCandidate?: boolean;
};

const CateGoryItem = ({
  code,
  imageUrl,
  className,
  isLcpCandidate,
}: CateGoryItemProps) => {
  const { label } = useTaxonomy();
  const displayLabel = label(code, "tags");

  return (
    <LocalizedLink
      href={`/recipes/category/${code}`}
      className={cn(
        "rounded-card relative block h-50 w-50 flex-shrink-0 cursor-pointer overflow-hidden shadow-md",
        className
      )}
    >
      <Image
        src={imageUrl}
        alt={displayLabel}
        wrapperClassName="h-50 w-50"
        width={200}
        height={200}
        priority={isLcpCandidate}
        fit="cover"
        fetchPriority={isLcpCandidate ? "high" : "auto"}
      />
      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/90 to-transparent p-2 pt-8">
        <p className="truncate px-2 text-lg font-medium text-white">
          {displayLabel}
        </p>
      </div>
    </LocalizedLink>
  );
};

export default CateGoryItem;
