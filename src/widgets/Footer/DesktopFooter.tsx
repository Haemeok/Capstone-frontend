"use client";

import { useId, useState } from "react";
import Link from "next/link";

import { ChevronDown } from "lucide-react";

import { useChromeDict } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";

const FOOTER_LINKS = {
  service: [
    { labelKey: "terms", href: "/terms" },
    { labelKey: "privacy", href: "/privacy" },
  ],
  support: [
    {
      labelKey: "reportError",
      href: "https://slashpage.com/recipio/943zqpmqxn63g2wnvy87",
      external: true,
    },
    { labelKey: "adInquiry", href: "/contact" },
    {
      labelKey: "copyrightReport",
      href: "https://docs.google.com/forms/d/e/1FAIpQLSdVUjr7LsnvG-WVG46cBhQOOUJN82irzTaKVS2Uthl6qKZgVg/viewform?usp=publish-editor",
      external: true,
    },
  ],
} as const;

const INFO_ROWS = [
  { labelKey: "ceoLabel", value: "도원진" },
  { labelKey: "csLabel", value: "recipio.cs@gmail.com" },
  { labelKey: "adLabel", value: "recipio.kr@gmail.com" },
] as const;

const DesktopFooter = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoPanelId = useId();
  const t = useChromeDict();

  return (
    <footer className="mt-16 hidden w-full border-t border-gray-200 bg-gray-50 md:block">
      <Container className="py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-ink text-lg font-bold">레시피오 (Recipio)</h3>
              <button
                type="button"
                aria-expanded={isInfoOpen}
                aria-controls={infoPanelId}
                aria-label={t.footer.businessInfoToggleAria}
                onClick={() => setIsInfoOpen((prev) => !prev)}
                className="hover:text-ink-sub text-gray-400 transition-colors"
              >
                <ChevronDown
                  className={`size-5 transition-transform ${isInfoOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
            </div>
            <p className="text-ink-sub max-w-xl text-sm">{t.footer.tagline}</p>

            {isInfoOpen && (
              <div
                id={infoPanelId}
                className="text-ink-muted mt-1 flex flex-col gap-2 text-xs"
              >
                {INFO_ROWS.map((row) => (
                  <div key={row.labelKey} className="flex items-center gap-2">
                    <span>{t.footer[row.labelKey]}</span>
                    <span>|</span>
                    <span>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <h4 className="text-ink text-sm font-semibold">
                {t.footer.sectionService}
              </h4>
              <div className="flex flex-col gap-2">
                {FOOTER_LINKS.service.map((link) =>
                  "external" in link && link.external ? (
                    <a
                      key={link.labelKey}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-sub hover:text-ink text-sm transition-colors"
                    >
                      {t.footer[link.labelKey]}
                    </a>
                  ) : (
                    <Link
                      key={link.labelKey}
                      href={link.href}
                      className="text-ink-sub hover:text-ink text-sm transition-colors"
                    >
                      {t.footer[link.labelKey]}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-ink text-sm font-semibold">
                {t.footer.sectionSupport}
              </h4>
              <div className="flex flex-col gap-2">
                {FOOTER_LINKS.support.map((link) =>
                  "external" in link && link.external ? (
                    <a
                      key={link.labelKey}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-sub hover:text-ink text-sm transition-colors"
                    >
                      {t.footer[link.labelKey]}
                    </a>
                  ) : (
                    <Link
                      key={link.labelKey}
                      href={link.href}
                      className="text-ink-sub hover:text-ink text-sm transition-colors"
                    >
                      {t.footer[link.labelKey]}
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
