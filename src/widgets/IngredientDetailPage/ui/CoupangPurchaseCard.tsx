import Link from "next/link";

import { ShoppingBasket } from "lucide-react";

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
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-gray-200 bg-white text-gray-800 font-medium active:scale-[0.99] transition-transform"
      >
        <ShoppingBasket size={18} className="text-gray-600" />
        <span>쿠팡에서 구매하기</span>
      </Link>
      <p className="mt-2 text-[11px] text-gray-400 font-light leading-tight text-center text-pretty break-keep">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
        수수료를 제공받습니다.
      </p>
    </section>
  );
};

export default CoupangPurchaseCard;
