"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { TAG_CODES } from "@/shared/config/constants/recipe";
import { cn } from "@/shared/lib/utils";

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
  const router = useRouter();
  return (
    <div
      className={cn(
        "relative h-70 w-50 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-md",
        className
      )}
      onClick={() => {
        router.push(
          `/recipes/category/${TAG_CODES[name as keyof typeof TAG_CODES]}`
        );
      }}
    >
      <Image
        src={imageUrl}
        alt={name}
        className="img-smooth h-70 w-50 object-cover"
        width={200}
        height={280}
        priority={isLcpCandidate}
        fetchPriority={isLcpCandidate ? "high" : "auto"}
      />
      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="truncate px-2 text-lg font-bold text-white">{name}</p>
      </div>
    </div>
  );
};

export default CateGoryItem;
