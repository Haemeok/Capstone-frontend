import { formatNumber } from "@/shared/lib/format";

import { computeUnitPrice } from "../lib/computeUnitPrice";
import type { CoupangProduct } from "../model/types";
import { DeliveryEstimate } from "./DeliveryEstimate";

type CoupangProductCardProps = {
  product: CoupangProduct;
  caption?: string;
};

export const CoupangProductCard = ({
  product,
  caption,
}: CoupangProductCardProps) => {
  const unit = computeUnitPrice(product.name, product.price);

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-[132px] shrink-0 flex-col gap-1"
    >
      {caption && (
        <span className="text-ink-muted truncate text-sm">{caption}</span>
      )}
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-[132px] w-full rounded-lg object-cover"
        loading="lazy"
      />
      <p className="text-ink mt-1 line-clamp-2 text-sm leading-snug">
        {product.name}
      </p>
      <div className="flex items-center gap-1">
        <span className="text-base font-bold text-red-600 md:text-lg">
          {formatNumber(product.price, "원")}
        </span>
        {product.rocket && (
          <img
            data-testid="rocket-badge"
            src="/rocket-delivery.webp"
            alt="로켓배송"
            className="h-3.5 w-auto"
          />
        )}
      </div>
      {unit && (
        <span className="text-ink-muted text-xs">
          {unit.base}당 {formatNumber(unit.unitPrice, "원")}
        </span>
      )}
      {product.rocket && <DeliveryEstimate />}
    </a>
  );
};
