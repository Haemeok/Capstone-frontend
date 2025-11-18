"use client";

import Link from "next/link";

import { TAG_CODES } from "@/shared/config/constants/recipe";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

type CateGoryItemProps = {
  id: number;
  name: string;
  imageUrl: string;

  className?: string;
  isLcpCandidate?: boolean;
};

const CateGoryItem = ({
  name,
  imageUrl,
  className,
  isLcpCandidate,
}: CateGoryItemProps) => {
  return (
    <Link
      href={`/recipes/category/${TAG_CODES[name as keyof typeof TAG_CODES]}`}
      className={cn(
        "relative h-70 w-50 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-md block",
        className
      )}
    >
      <Image
        src={imageUrl}
        alt={name}
        className="object-cover"
        wrapperClassName="h-70 w-50"
        width={200}
        height={280}
        priority={isLcpCandidate}
        fetchPriority={isLcpCandidate ? "high" : "auto"}
      />
      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="truncate px-2 text-lg font-bold text-white">{name}</p>
      </div>
    </Link>
  );
};

export default CateGoryItem;
