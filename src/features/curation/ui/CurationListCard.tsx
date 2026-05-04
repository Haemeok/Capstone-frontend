import Link from "next/link";

import { Image } from "@/shared/ui/image/Image";

import { coverImageUrlFromKey } from "../lib/coverImageUrl";

type CurationListCardProps = {
  slug: string;
  title: string;
  category: string | null;
  coverImageKey: string | null;
  priority?: boolean;
};

export const CurationListCard = ({
  slug,
  title,
  category,
  coverImageKey,
  priority = false,
}: CurationListCardProps) => {
  const imageUrl = coverImageUrlFromKey(coverImageKey);
  return (
    <Link
      href={`/curation/${slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-green-900"
      aria-label={title}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-beige">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            priority={priority}
            wrapperClassName="absolute inset-0"
            imgClassName="object-cover"
          />
        ) : null}
      </div>
      {category && (
        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-green-900">
          {category}
        </p>
      )}
      <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-brown underline-offset-4 group-hover:underline sm:text-[15px]">
        {title}
      </h3>
    </Link>
  );
};
