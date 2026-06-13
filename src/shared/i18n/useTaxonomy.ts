"use client";

import { usePathname } from "next/navigation";

import { resolveChromeLocale } from "./resolveChromeLocale";
import {
  localizeTaxonomy,
  type TaxonomyDomain,
  taxonomyLabel,
} from "./taxonomyLabel";
import { taxonomyMessages } from "./taxonomyMessages";

export const useTaxonomy = () => {
  const dict = taxonomyMessages[resolveChromeLocale(usePathname() ?? "/")];
  return {
    dict,
    label: (code: string, domain: TaxonomyDomain) =>
      taxonomyLabel(code, domain, dict),
    localize: (koValue: string, domain: TaxonomyDomain) =>
      localizeTaxonomy(koValue, domain, dict),
  };
};
