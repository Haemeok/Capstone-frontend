import Link from "next/link";

import { ChevronRight, ShoppingBasket } from "lucide-react";

type CoupangPurchaseCardProps = {
  href: string | null;
};

const CoupangPurchaseCard = ({ href }: CoupangPurchaseCardProps) => {
  if (!href) return null;

  return (
    <section data-testid="coupang-card" className="px-5 pt-2 pb-4">
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-between gap-3 rounded-xl bg-gray-50 p-4 transition-colors active:bg-gray-100"
      >
        <div className="flex items-center gap-3">
          <ShoppingBasket size={20} className="text-ink-sub" />
          <div className="flex flex-col">
            <span className="text-ink text-sm font-semibold">
              쿠팡에서 신선하게 받아보세요
            </span>
            <span className="text-ink-muted mt-0.5 text-xs">
              로켓배송으로 빠르게
            </span>
          </div>
        </div>
        <ChevronRight size={18} className="flex-shrink-0 text-gray-400" />
      </Link>
      <p className="mt-3 text-center text-[11px] leading-tight font-light text-pretty break-keep text-gray-400">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
        제공받습니다.
      </p>
    </section>
  );
};

export default CoupangPurchaseCard;
