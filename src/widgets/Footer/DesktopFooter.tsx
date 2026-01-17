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
    <footer className="mt-16 hidden w-full border-t border-gray-200 bg-gray-50 md:block">
      <Container className="py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-gray-900">
              Recipio (레시피오)
            </h3>
            <p className="max-w-xl text-sm text-gray-600">
              AI 기반 레시피 추천 서비스로, 냉장고 재료만으로 맛있는 요리를
              만들어보세요.
            </p>
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-gray-900">서비스</h4>
              <div className="flex flex-col gap-2">
                {FOOTER_LINKS.service.map((link) => (
                  <div
                    key={link.label}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-gray-900">고객지원</h4>
              <div className="flex flex-col gap-2">
                {FOOTER_LINKS.support.map((link) => (
                  <div
                    key={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-200 pt-6 text-xs text-gray-500">
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
