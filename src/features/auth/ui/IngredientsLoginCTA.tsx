"use client";

import Link from "next/link";

import { localizedHref } from "@/shared/i18n/localizedHref";
import { useChromeLocale } from "@/shared/i18n/useChromeDict";
import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";

const IngredientsLoginCTA = () => {
  const t = useIngredientsDict().loginCta;
  const locale = useChromeLocale();
  const loginHref = `${localizedHref("/login", locale)}?redirectUrl=${localizedHref("/ingredients", locale)}`;

  return (
    <section className="px-5 py-10 md:px-6">
      <h1 className="text-ink text-2xl leading-8 font-bold tracking-tight">
        {t.title}
      </h1>
      <p className="text-ink-sub mt-2 max-w-md text-sm leading-6">{t.body}</p>
      <Link
        href={loginHref}
        className="bg-olive-light focus-visible:ring-olive-light active:bg-olive-dark mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-xl px-5 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {t.loginButton}
      </Link>
    </section>
  );
};

export default IngredientsLoginCTA;
