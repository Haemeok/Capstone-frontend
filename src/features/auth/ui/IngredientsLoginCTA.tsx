"use client";

import Link from "next/link";

import { LogIn } from "lucide-react";

import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import { localizedHref } from "@/shared/i18n/localizedHref";
import { useChromeLocale } from "@/shared/i18n/useChromeDict";
import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";
import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";

const IngredientsLoginCTA = () => {
  const t = useIngredientsDict().loginCta;
  const locale = useChromeLocale();
  const loginHref = `${localizedHref("/login", locale)}?redirectUrl=${localizedHref("/ingredients", locale)}`;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-8 shadow-xl">
        <div className="mb-8 space-y-4">
          <div className="flex items-start gap-2">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
              <Image
                src={`${ICON_BASE_URL}ai.webp`}
                alt="AI"
                wrapperClassName="w-10 h-10"
              />
            </div>
            <div>
              <h3 className="text-ink mb-1 font-semibold">{t.aiHeading}</h3>
              <p className="text-ink-sub text-sm">{t.aiBody}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
              <Image
                src={`${ICON_BASE_URL}search_intro.webp`}
                alt={t.searchAlt}
                wrapperClassName="w-10 h-10"
              />
            </div>
            <div>
              <h3 className="text-ink mb-1 font-semibold">{t.searchHeading}</h3>
              <p className="text-ink-sub text-sm">{t.searchBody}</p>
            </div>
          </div>
        </div>

        <Link href={loginHref} className="block">
          <Button className="bg-olive-light hover:bg-olive-light/90 w-full rounded-xl py-6 font-semibold text-white shadow-lg transition-all hover:shadow-xl">
            <LogIn className="mr-2 h-5 w-5" />
            {t.loginButton}
          </Button>
        </Link>

        <p className="text-ink-muted mt-4 text-center text-xs">
          {t.signupNote}
        </p>
      </div>
    </div>
  );
};

export default IngredientsLoginCTA;
