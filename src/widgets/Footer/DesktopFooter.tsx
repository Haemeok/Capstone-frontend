import Link from "next/link";

import { Container } from "@/shared/ui/Container";

const FOOTER_LINKS = {
  service: [
    { label: "서비스 이용약관", href: "/terms" },
    { label: "개인정보 처리방침", href: "/privacy" },
  ],
  support: [
    { label: "고객센터", href: "/support" },
    { label: "광고/제휴 문의", href: "/contact" },
  ],
} as const;

const DesktopFooter = () => {
  return (
    <footer className="hidden md:block w-full border-t border-gray-200 bg-gray-50 mt-16">
      <Container className="py-12">
        <div className="flex flex-col gap-8">
          <div className="text-center py-4 bg-white rounded-lg border border-gray-200">
            <p className="text-lg font-semibold text-gray-800">
              지금까지 <span className="text-olive-light">★1,234,567</span>개의
              평가가 생성되었어요
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-gray-900">
              Recipio (레시피오)
            </h3>
            <p className="text-sm text-gray-600 max-w-xl">
              AI 기반 레시피 추천 서비스로, 냉장고 재료만으로 맛있는 요리를
              만들어보세요.
            </p>
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-gray-900">서비스</h4>
              <div className="flex flex-col gap-2">
                {FOOTER_LINKS.service.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-gray-900">고객지원</h4>
              <div className="flex flex-col gap-2">
                {FOOTER_LINKS.support.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-xs text-gray-500 border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2">
              <span>고객센터 정보</span>
              <span>|</span>
              <span>cs@recipio.co.kr</span>
            </div>
            <div className="flex items-center gap-2">
              <span>광고 문의</span>
              <span>|</span>
              <span>ad-sales@recipio.com / 제휴 광고 소재 문의</span>
            </div>
            <div className="flex items-center gap-2">
              <span>제품 및 대외 문의</span>
              <span>|</span>
              <Link
                href="https://recipio.team/contact"
                className="hover:underline"
              >
                https://recipio.team/contact
              </Link>
            </div>
            <div className="mt-2">
              <span>주식회사 레시피오</span>
              <span className="mx-2">|</span>
              <span>대표 이사 | 서울특별시 강남구 테헤란로 123</span>
            </div>
            <div>
              <span>사업자 등록 번호 123-45-67890</span>
            </div>
            <div className="mt-4 text-gray-400">
              © 2025 by Recipio, Inc. All rights reserved.
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default DesktopFooter;
