import Link from "next/link";

import { ChevronRight, ShoppingBasket } from "lucide-react";

type CoupangPurchaseCardProps = {
  href: string | null;
};

const CoupangPurchaseCard = ({ href }: CoupangPurchaseCardProps) => {
  if (!href) return null;

  return (
    <section className="px-5 pt-2 pb-4">
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 w-full rounded-xl bg-gray-50 p-4 active:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ShoppingBasket size={20} className="text-gray-700" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              쿠팡에서 신선하게 받아보세요
            </span>
            <span className="text-xs text-gray-500 mt-0.5">
              로켓배송으로 빠르게
            </span>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
      </Link>
      <p className="mt-3 text-[11px] text-gray-400 font-light leading-tight text-pretty break-keep text-center">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
        수수료를 제공받습니다.
      </p>
    </section>
  );
};

export default CoupangPurchaseCard;
