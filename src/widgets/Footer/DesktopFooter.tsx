"use client";

import { useId, useState } from "react";
import Link from "next/link";

import { ChevronDown } from "lucide-react";

import { Container } from "@/shared/ui/Container";

const FOOTER_LINKS = {
  service: [
    { label: "서비스 이용약관", href: "/terms" },
    { label: "개인정보 처리방침", href: "/privacy" },
  ],
  support: [
    {
      label: "오류제보",
      href: "https://slashpage.com/recipio/943zqpmqxn63g2wnvy87",
      external: true,
    },
    { label: "광고/제휴 문의", href: "/contact" },
    {
      label: "저작권 신고 및 게시 중단 요청",
      href: "https://docs.google.com/forms/d/e/1FAIpQLSdVUjr7LsnvG-WVG46cBhQOOUJN82irzTaKVS2Uthl6qKZgVg/viewform?usp=publish-editor",
      external: true,
    },
  ],
} as const;

const INFO_ROWS = [
  { label: "대표", value: "도원진" },
  { label: "고객센터", value: "recipio.cs@gmail.com" },
  { label: "광고 문의", value: "recipio.kr@gmail.com" },
] as const;

const DesktopFooter = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoPanelId = useId();

  return (
    <footer className="mt-16 hidden w-full border-t border-gray-200 bg-gray-50 md:block">
      <Container className="py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">
                레시피오 (Recipio)
              </h3>
              <button
                type="button"
                aria-expanded={isInfoOpen}
                aria-controls={infoPanelId}
                aria-label="사업자 정보 펼치기"
                onClick={() => setIsInfoOpen((prev) => !prev)}
                className="text-gray-400 transition-colors hover:text-gray-700"
              >
                <ChevronDown
                  className={`size-5 transition-transform ${isInfoOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
            </div>
            <p className="max-w-xl text-sm text-gray-600">
              AI 기반 레시피 추천 서비스로, 냉장고 재료만으로 맛있는 요리를
              만들어보세요.
            </p>

            {isInfoOpen && (
              <div
                id={infoPanelId}
                className="mt-1 flex flex-col gap-2 text-xs text-gray-500"
              >
                {INFO_ROWS.map((row) => (
                  <div key={row.label} className="flex items-center gap-2">
                    <span>{row.label}</span>
                    <span>|</span>
                    <span>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-gray-900">서비스</h4>
              <div className="flex flex-col gap-2">
                {FOOTER_LINKS.service.map((link) =>
                  "external" in link && link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-gray-900">고객지원</h4>
              <div className="flex flex-col gap-2">
                {FOOTER_LINKS.support.map((link) =>
                  "external" in link && link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 text-xs text-gray-400">
            Copyright © 2026 Team Recipio. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default DesktopFooter;
