"use client";

import type { ComponentProps } from "react";
import Link from "next/link";

import { localizedHref } from "./localizedHref";
import { useChromeLocale } from "./useChromeDict";

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export const LocalizedLink = ({ href, ...props }: LocalizedLinkProps) => {
  const locale = useChromeLocale();
  return <Link href={localizedHref(href, locale)} {...props} />;
};
